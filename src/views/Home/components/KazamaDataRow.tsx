import { BurnIcon, Flex, Heading, Skeleton, Text, CardBody, Image } from '@kazamaswap/uikit'
import { useWeb3React } from '@kazamaswap/wagmi'
import Balance from 'components/Balance'
import kazamaAbi from 'config/abi/kazama.json'
import distributorAbi from 'config/abi/distributor.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import { bscTokens, bscTestnetTokens } from '@kazamaswap/tokens'
import { useTranslation } from '@kazamaswap/localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useEffect, useState } from 'react'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { formatBigNumber, formatNumberExact, formatNumber } from 'utils/formatBalance'
import { multicallv2 } from 'utils/multicall'
import useSWR from 'swr'
import { SLOW_INTERVAL, FAST_INTERVAL, DISTRIBUTOR } from 'config/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { getKazamaVaultV2Contract } from 'utils/contractHelpers'
import SixColumnFlex from 'components/Layout/SixColumnFlex'
import TotalSupply from 'views/Home/components/KazamaToken/TotalSupply'

const IconWrapper = styled.div`
  align-items: center;
  background-color: #2e2b3a;
  border-color: #1B1A23;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  display: flex;
  height: 48px;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 48px;
  z-index: 102;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.301));
`

const Icon = styled(Image)`
  left: 0;
  position: absolute;
  top: 0;
  z-index: 102;
  & > img {
    border-radius: 50%;
  }
`;

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean; noDesktopBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
          
         }
       `
      : `
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}

  ${({ noDesktopBorder, theme }) =>
    noDesktopBorder &&
    `${theme.mediaQueries.md} {
           padding: 0;
           border-left: none;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);
  grid-template-areas:
    'a d'
    'b e'
    'c f';

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-areas:
      'a b c'
      'd e f';
    grid-gap: 5px;
    grid-template-columns: repeat(3, auto);
  }
`

const StyledCardBody = styled(CardBody)`
flex-shrink: 0;
padding: 0 0.5rem;
background: #292435;
border-radius: 4px;
border: 1px solid #2e293a;
display: flex;
font-size: .7rem;
min-width: 0;
opacity: 1;
overflow: hidden;
position: relative;
margin-bottom: 3px;
`

const MB = styled(SixColumnFlex)`
margin-bottom: 0px;
`

const OutputText = styled(Balance)`
color: #c4bdd2;
    font-weight: 400;
    line-height: 1.5;
    font-size: 14px;
`

const PrintText = styled(Text)`
    line-height: 1.5;
`

const HeadingWrapper = styled.div`
padding: 8px 0px 3px;
`

const AmountWrapper = styled.div`
padding: 0px 0px 3px;
    -webkit-box-align: center;
    align-items: center;
    font-variant-numeric: tabular-nums;
`

const UsdValueWrapper = styled.div`
margin-top: 8px;
padding: 4.5px 12px;
border-radius: 4px;
color: rgb(177, 182, 198);
background: rgba(15, 17, 26, 0.4);
font-size: 10px;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 500;
font-style: normal;
width: 100%;
`

const KazamaStatsBox = styled.div`
display: flex;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 16px 12px;
    border-radius: 5px;
    text-align: center;
    background: #292334;
    width: 129.75px;
    min-width: 129.75px;
    max-width: 129.75px;
    height: 148px;
    min-height: 148px;
    max-height: 148px;
`

const emissionsPerBlock = 12.75

/**
 * User (Planet Finance) built a contract on top of our original manual KAZAMA pool,
 * but the contract was written in such a way that when we performed the migration from Masterchef v1 to v2, the tokens were stuck.
 * These stuck tokens are forever gone (see their medium post) and can be considered out of circulation."
 * https://planetfinanceio.medium.com/pankazamaswap-works-with-planet-to-help-kazama-holders-f0d253b435af
 * https://twitter.com/PankazamaSwap/status/1523913527626702849
 * https://bscscan.com/tx/0xd5ffea4d9925d2f79249a4ce05efd4459ed179152ea5072a2df73cd4b9e88ba7
 */
const planetFinanceBurnedTokensWei = BigNumber.from('0')
const deadAddressHoldings = BigNumber.from('0')
const burnedLiquidity = BigNumber.from('0')
const kazamaVault = getKazamaVaultV2Contract()

const KazamaDataRow = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { account } = useWeb3React()
  const [loadData, setLoadData] = useState(false)
  const {
    data: { kazamaSupply, burnedBalance, circulatingSupply, foreverLockedKazama, combinedKazamaDestroyed, liquidityLocked, userShares, pendingRewards, totalRewards, totalShares, rewardsPerShare } = {
      kazamaSupply: 0,
      burnedBalance: 0,
      circulatingSupply: 0,
      foreverLockedKazama: 0,
      combinedKazamaDestroyed: 0,
      liquidityLocked: 0,
      userShares: 0,
      pendingRewards: 0,
      totalRewards: 0,
      totalShares: 0,
      rewardsPerShare: 0,
    },
  } = useSWR(
    loadData ? ['kazamaDataRow'] : null,
    async () => {
      const totalSupplyCall = { address: bscTestnetTokens.kazama.address, name: 'totalSupply' }
      const burnedTokenCall = { address: bscTestnetTokens.kazama.address, name: 'balanceOf', params: ['0x000000000000000000000000000000000000dEaD'], }
      const rewardsPerShareCall = { address: DISTRIBUTOR, name: 'dividendsPerShare' }
      const userSharesCall = { address: DISTRIBUTOR, name: 'shares', params: [account] }
      const totalSharesCall = { address: DISTRIBUTOR, name: 'totalShares' }
      const pendingRewardsCall = { address: DISTRIBUTOR, name: 'getUnpaidEarnings', params: [account] }
      const totalRewardsCall = { address: DISTRIBUTOR, name: 'totalDistributed' }
      const AllTimeBurnedCall = { address: bscTestnetTokens.kazama.address, name: 'AllTimeBurned', }

      const KazamaLiquidityBurnedCall = { address : bscTestnetTokens.kazamalp.address, name: 'balanceOf', params: ['0x000000000000000000000000000000000000dEaD'], }

      const [tokenDataResultRaw, distributorData, totalLockedAmount] = await Promise.all([
        multicallv2({
          abi: kazamaAbi,calls: [totalSupplyCall, burnedTokenCall, AllTimeBurnedCall, KazamaLiquidityBurnedCall],
        options:
         {requireSuccess: false,},
        }),
        multicallv2({
          abi: distributorAbi,
          calls: [userSharesCall, pendingRewardsCall, totalRewardsCall, totalSharesCall, rewardsPerShareCall],
          options: {
            requireSuccess: false,
          },
        }),
        kazamaVault.totalLockedAmount(),
      ])
      const [totalSupply, burned, AllTimeBurned, KazamaLiquidityBurned] = tokenDataResultRaw.flat()
      const [userShares, totalExcluded, totalRealised, pendingRewards, totalRewards, totalShares, rewardsPerShare] = distributorData.flat()
      const totalBurned = planetFinanceBurnedTokensWei.add(burned.add(AllTimeBurned))
      const circulating = totalSupply.sub(totalBurned.add(totalLockedAmount))
      const foreverLocked = deadAddressHoldings.add(burned)
      const combined = totalBurned.add(foreverLocked)
      const liquidityBurned = burnedLiquidity.add(KazamaLiquidityBurned)

      return {
        kazamaSupply: totalSupply && burned ? +formatBigNumber(totalSupply) : 0,
        burnedBalance: burned ? +formatBigNumber(totalBurned) : 0,
        circulatingSupply: circulating ? +formatBigNumber(circulating) : 0,
        foreverLockedKazama: burned ? +formatBigNumber(foreverLocked) : 0,
        combinedKazamaDestroyed: burned ? +formatBigNumber(combined) : 0,
        liquidityLocked: KazamaLiquidityBurned ? +formatBigNumber(liquidityBurned) : 0,
        userShares: userShares ? +formatBigNumber(userShares) : 0,
        pendingRewards: pendingRewards ? +formatBigNumber(pendingRewards) : 0,
        totalRewards: totalRewards ? +formatBigNumber(totalRewards) : 0,
        totalShares: totalShares ? +formatBigNumber(totalShares) : 0,
        rewardsPerShare: rewardsPerShare ? +formatBigNumber(rewardsPerShare) : 0
      }
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  const kazamaPriceBusd = usePriceKazamaBusd()
  const mcap = kazamaPriceBusd.times(circulatingSupply)
  const burnedValue = kazamaPriceBusd.times(burnedBalance)
  const mcapString = formatNumberExact(mcap.toNumber())
  const valueString = formatNumber(burnedValue.toNumber())
  const kazamaLockedValue = kazamaPriceBusd.times(foreverLockedKazama)
  const kazamaLockedString = formatNumber(kazamaLockedValue.toNumber())
  const totalDestroyedUsd = kazamaPriceBusd.times(combinedKazamaDestroyed)
  const totalDestroyedUsdString = formatNumber(totalDestroyedUsd.toNumber())

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <MB>
<KazamaStatsBox>
  <IconWrapper>
    Iconnnn
  </IconWrapper>
  <HeadingWrapper>
    Total Supply
  </HeadingWrapper>
  <AmountWrapper>
  {kazamaSupply ? (
          <OutputText decimals={0} lineHeight="1.1" fontSize="24px" bold value={kazamaSupply} />
        ) : (
          <>
            <div ref={observerRef} />
            <Skeleton height={24} width={126} my="4px" />
          </>
        )}
  </AmountWrapper>
  <UsdValueWrapper>
    $0.00
  </UsdValueWrapper>
</KazamaStatsBox>

<KazamaStatsBox>
  <IconWrapper>
    Icon
  </IconWrapper>
  <HeadingWrapper>
  Circulating
  </HeadingWrapper>
  <AmountWrapper>
  {circulatingSupply ? (
          <OutputText decimals={0} lineHeight="1.1" fontSize="24px" bold value={circulatingSupply} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
  </AmountWrapper>
  <UsdValueWrapper>
    $0.00
  </UsdValueWrapper>
</KazamaStatsBox>

<KazamaStatsBox>
  <IconWrapper>
    Icon
  </IconWrapper>
  <HeadingWrapper>
    Market Cap
  </HeadingWrapper>
  <AmountWrapper>
  {mcap?.gt(0) && mcapString ? (
          <PrintText>{t('$%marketCap%', { marketCap: mcapString })}</PrintText>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
  </AmountWrapper>
  <UsdValueWrapper>
    $0.00
  </UsdValueWrapper>
</KazamaStatsBox>

<KazamaStatsBox>
  <IconWrapper>
    Icon
  </IconWrapper>
  <HeadingWrapper>
    Total Burned
  </HeadingWrapper>
  <AmountWrapper>
  {burnedBalance ? (
          <OutputText decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
  </AmountWrapper>
  <UsdValueWrapper>
  {burnedValue ? (
          <PrintText color="text">{t('$%totalUsdBurned%', { totalUsdBurned: valueString })}</PrintText>
        ) : (
          <PrintText color="warning">$0.00</PrintText>
        )}
  </UsdValueWrapper>
</KazamaStatsBox>

<KazamaStatsBox>
  <IconWrapper>
    Icon
  </IconWrapper>
  <HeadingWrapper>
    Forever Locked
  </HeadingWrapper>
  <AmountWrapper>
  {foreverLockedKazama ? (
          <OutputText decimals={0} lineHeight="1.1" fontSize="14px" unit=" KAZAMA" value={foreverLockedKazama} />
        ) : (
          <OutputText decimals={0} lineHeight="1.1" fontSize="14px" value={0} />
        )}
  </AmountWrapper>
  <UsdValueWrapper>
  {kazamaLockedValue ? (
          <PrintText color="text">{t('$%totalUsdLocked%', { totalUsdLocked: kazamaLockedString })}</PrintText>
        ) : (
          <PrintText color="warning">$0.00</PrintText>
        )}
  </UsdValueWrapper>
</KazamaStatsBox>


<KazamaStatsBox>
  <IconWrapper>
    Icon
  </IconWrapper>
  <HeadingWrapper>
    Combined
  </HeadingWrapper>
  <AmountWrapper>
  {combinedKazamaDestroyed ? (
          <OutputText decimals={0} lineHeight="1.1" fontSize="24px" unit=" KAZAMA" bold value={combinedKazamaDestroyed} />
        ) : (
          <OutputText decimals={0} lineHeight="1.1" fontSize="24px" bold value={0} />
        )}
  </AmountWrapper>
  <UsdValueWrapper>
  {totalDestroyedUsd ? (
          <PrintText color="text">{t('$%totalUsdDestroyed%', { totalUsdDestroyed: totalDestroyedUsdString })}</PrintText>
        ) : (
          <PrintText color="text">$0.00</PrintText>
        )}
  </UsdValueWrapper>
</KazamaStatsBox>
</MB>
  )
}

export default KazamaDataRow
