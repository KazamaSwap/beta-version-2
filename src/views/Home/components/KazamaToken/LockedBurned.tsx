import { Flex, Heading, Skeleton, Text, CardBody, CardRibbon } from '@kazamaswap/uikit'
import Balance from 'components/Balance'
import kazamaAbi from 'config/abi/kazama.json'
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
import { SLOW_INTERVAL, FAST_INTERVAL } from 'config/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { getKazamaVaultV2Contract } from 'utils/contractHelpers'
import ThreeColumnFlex from 'components/Layout/ThreeColumnFlex'

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
    grid-gap: 32px;
    grid-template-columns: repeat(3, auto);
  }
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;
  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

const StyledCardBody = styled(CardBody)`
padding: 5px;
background-image: linear-gradient(#21202c ,#292734);
position: relative;
overflow: hidden;
padding-top: 7px;
padding-bottom: 8px;
z-index: 10;
border-top: 1px ${({ theme }) => theme.colors.cardBorder} solid;
border-bottom: 2px ${({ theme }) => theme.colors.cardBorder} solid;
border-left: 1px ${({ theme }) => theme.colors.cardBorder} solid;
border-right: 2px ${({ theme }) => theme.colors.cardBorder} solid;
border-radius: 10px;
margin-bottom: 10px;
`

const OutputText = styled(Balance)`
color: #F4EEFF;
    font-weight: 400;
    line-height: 1.5;
    font-size: 16px;
`

const PrintText = styled(Text)`
    font-weight: 400;
    line-height: 1.5;
    font-size: 16px;
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

const LockedBurned = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const {
    data: { kazamaSupply, burnedBalance, circulatingSupply, foreverLockedKazama, combinedKazamaDestroyed, liquidityLocked } = {
      kazamaSupply: 0,
      burnedBalance: 0,
      circulatingSupply: 0,
      foreverLockedKazama: 0,
      combinedKazamaDestroyed: 0,
      liquidityLocked: 0,
    },
  } = useSWR(
    loadData ? ['kazamaDataRow'] : null,
    async () => {
      const totalSupplyCall = { address: bscTestnetTokens.kazama.address, name: 'totalSupply' }
      const burnedTokenCall = { address: bscTestnetTokens.kazama.address, name: 'balanceOf', params: ['0x000000000000000000000000000000000000dEaD'], }
      const AllTimeBurnedCall = { address: bscTestnetTokens.kazama.address, name: 'AllTimeBurned', }

      const KazamaLiquidityBurnedCall = { address : bscTestnetTokens.kazamalp.address, name: 'balanceOf', params: ['0x000000000000000000000000000000000000dEaD'], }

      const [tokenDataResultRaw, totalLockedAmount] = await Promise.all([multicallv2({abi: kazamaAbi,calls: [totalSupplyCall, burnedTokenCall, AllTimeBurnedCall, KazamaLiquidityBurnedCall],
        options: {requireSuccess: false,},
        }),
        kazamaVault.totalLockedAmount(),
      ])
      const [totalSupply, burned, AllTimeBurned, KazamaLiquidityBurned] = tokenDataResultRaw.flat()

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
    <StyledCardBody>
      <StyledCardRibbon text={t('Latest')} />
      <StyledColumn>
      <Text fontSize="16px" bold color="#F4EEFF">{t('Burned & Locked')}</Text>
        {combinedKazamaDestroyed ? (
          <OutputText decimals={0} lineHeight="1.1" fontSize="24px" unit=" KAZAMA" bold value={combinedKazamaDestroyed} />
        ) : (
          <OutputText decimals={0} lineHeight="1.1" fontSize="24px" bold value={0} />
        )}
        {totalDestroyedUsd ? (
          <PrintText color="warning">{t('$%totalUsdDestroyed%', { totalUsdDestroyed: totalDestroyedUsdString })}</PrintText>
        ) : (
          <PrintText color="warning">$0.00</PrintText>
        )}
      </StyledColumn>
    </StyledCardBody>
  )
}

export default LockedBurned
