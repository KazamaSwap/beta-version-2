import Balance from 'components/Balance';
import kazamaAbi from 'config/abi/kazama.json';
import rankPotsAbi from 'config/abi/rankPots.json';
import { FAST_INTERVAL, RANKPOTS_GAME } from 'config/constants';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import PropTypes from 'prop-types';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { usePriceKazamaBusd } from 'state/farms/hooks';
import styled from 'styled-components';
import useSWR from 'swr';
import { formatBigNumber, formatNumber, formatNumberExact } from 'utils/formatBalance';
import { multicallv2 } from 'utils/multicall';

import { BigNumber } from '@ethersproject/bignumber';
import { useTranslation } from '@kazamaswap/localization';
import { bscTestnetTokens, bscTokens } from '@kazamaswap/tokens';
import {
    AutoRenewIcon, Box, Button, Card, FishIcon, Flex, Heading, Image, ShrimpIcon, Skeleton, Text,
    TrophyGoldIcon, useMatchBreakpoints
} from '@kazamaswap/uikit';
import { useWeb3React } from '@kazamaswap/wagmi';
import ProgressBar from '@ramonak/react-progress-bar';

import PoolsPage from '../../components/Layout/PoolsPage';

const HeaderText = styled(Text)`
font-weight: 800;
color: #fff;
`

const BalanceBig = styled(Balance)`
color: #fff;
font-weight: 600;
text-transform: uppercase;
`

const NavText = styled(Text)`
color: #fff;
font-weight: 600;
text-transform: uppercase;
`

const MinBalance = styled(Text)`
font-style: italic;
color: #fff;
`

const HeaderSmall = styled(Text)`
text-transform: uppercase;
color: rgb(255, 255, 255);
font-size: 14px;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 800;
font-style: normal;
`

const HeaderContainer = styled.div`
display: flex;
   -webkit-box-align: center;
   align-items: center;
   background-color: #292334;
   border-radius: 8px;
   min-height: 210px;
   gap: 32px;
   padding: 24px 32px;
   margin-bottom: 24px;
`

const Shadow = styled.div`
background: linear-gradient(89.92deg, rgb(82, 0, 255) 0.08%, rgb(0, 255, 240) 52.6%, rgb(250, 0, 255) 99.93%);
   opacity: 0.35;
   filter: blur(135px);
   border-radius: 190.145px;
   width: 300px;
   height: 317px;
   position: absolute;
   top: 140px;
`

const Shadow2 = styled.div`
background: linear-gradient(89.92deg, rgb(82, 0, 255) 0.08%, rgb(0, 255, 240) 52.6%, rgb(250, 0, 255) 99.93%);
opacity: 0.35;
filter: blur(135px);
border-radius: 190.145px;
width: 300px;
height: 317px;
position: absolute;
top: -90px;
`

export const GameContainer = styled(Flex)`
justify-content: space-between;
flex-direction: column;
max-width: 1200px;
width: 100%;
padding: 0;
gap: 1em;
& > * {
  width: 100%;
}
${({ theme }) => theme.mediaQueries.md} {
  max-width: 1200px;
  flex-direction: row;
}
`

export const HeaderTop = styled(Flex)`
justify-content: space-between;
flex-direction: column;
`

const PotBalance = styled.div`
justify-content: center;
`

export const Progress = styled.div`
background: #2e273b;
padding: 10px;
border-radius: 7px;
`

const OutputText = styled(Balance)`
font-style: italic;
`

export const GameBox = styled(Box)`
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
-webkit-box-align: center;
-webkit-align-items: center;
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
background-color: #141824;
border-bottom: 2px solid rgba(0, 0, 0, 0.35);
background-size: auto 100%;
background-position: 100% 50%;
background-repeat: no-repeat;
border-radius: 8px;
gap: 32px;
padding: 24px 32px;
margin-bottom: 24px;
`

const RankContainer = styled.div`
background: #141824;
border-radius: 10px;
padding: 20px;
min-width: 250px;
flex-direction: row-reverse;
margin-top: 7px;
margin-bottom: 7px;
`

const TimerBlock = styled.div`
-webkit-text-size-adjust: 100%;
-webkit-tap-highlight-color: transparent;
-webkit-font-smoothing: antialiased;
line-height: 1.2;
text-align: center;
box-sizing: border-box;
padding: 12px 16px;
border-radius: 8px;
font-variant-numeric: tabular-nums;
background: #201c29;
color: rgb(255, 255, 255);
font-size: 32px;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 800;
font-style: normal;
min-width: 80px;
`

const ClaimButton = styled(Button)`
position: relative;
padding: 0.5rem 0;
background: rgba(49, 208, 171, 0.13);
border: 2px solid #31D0AA;
box-sizing: border-box;
border-radius: 8px;
height: 2.75rem;
transition: all .2s ease-in-out;
width: 100%;
margin-top: 10px;
`

const PoolHeader = styled(Text)`
font-weight: 600;
text-transform: uppercase;
`

const ClaimersContainer = styled(Flex)`
justify-content: space-between;
flex-direction: column;
max-width: 1200px;
width: 100%;
padding: 0;
gap: 1em;
& > * {
  width: 100%;
}
${({ theme }) => theme.mediaQueries.md} {
  max-width: 1200px;
  flex-direction: row;
}
`

const ClaimersBox = styled.div`
background: #141824;
border-radius: 10px;
padding: 20px;
`

const MINIMUM_TO_CLAIM_KAZAMA = 5000;

// Percentage claimable of the balance per rank
const shrimpShare = 1;
const crabShare = 2;
const fishShare = 3;
const turtleShare = 5;
const dolphinShare = 7;
const orcaShare = 9;
const sharkShare = 11;
const whaleShare = 17;
const krakenShare = 20;
const spacenautShare = 25;

const RankPots = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const [value, setValue] = useState(0);
  const { account, isConnected } = useWeb3React()
  const {
    data: { rankPotsBalance, burnedByGame, allTimeClaimed, totalClaimedByShrimps, totalBurnedByShrimps, totalShrimpClaimers, claimTimeShrimp } = {
      rankPotsBalance: 0,
      burnedByGame: 0,
      allTimeClaimed: 0,
      // Shrimps
      totalClaimedByShrimps: 0,
      totalBurnedByShrimps: 0,
      totalShrimpClaimers: 0,
      claimTimeShrimp: 0,
    },
  } = useSWR(
    loadData ? ['kazamaDataRow'] : null,
    async () => {
      const rankPotsKazamaCall = { address: bscTestnetTokens.kazama.address, name: 'balanceOf', params: ['0xe0F3D27E5006EDA78FE3015D065eb227106C9bD0'], }
      const burnedByGameCall = { address: RANKPOTS_GAME, name: 'totalBurned'}
      const allTimeClaimedCall = { address: RANKPOTS_GAME, name: 'totalClaimedEver'}
      // Shrimp section
      const totalClaimedByShrimpsCall = { address: RANKPOTS_GAME, name: 'totalClaimedShrimps'}
      const totalBurnedByShrimpsCall = { address: RANKPOTS_GAME, name: 'burnedByShrimps'}
      const totalShrimpClaimersCall = { address: RANKPOTS_GAME, name: 'totalShrimpClaimers'}
      const claimTimeShrimpCall = { address: RANKPOTS_GAME, name: 'shrimpNextClaim', params: [account], }

      const [tokenDataResultRaw, rankPotsData] = await Promise.all([
        multicallv2({
          abi: kazamaAbi,calls: [rankPotsKazamaCall],
        options:
         {requireSuccess: false,},
        }),
        multicallv2({
          abi: rankPotsAbi,calls: [burnedByGameCall, allTimeClaimedCall, totalClaimedByShrimpsCall, totalBurnedByShrimpsCall, totalShrimpClaimersCall, claimTimeShrimpCall],
        options:
         {requireSuccess: false,},
        }),
      ])
      const [rankPotsKazama] = tokenDataResultRaw.flat()
      const [burnedKazama, allTimeKazamaClaimed, totalAmountShrimps, totalBurnedShrimps, totalClaimersShrimp, userTimeShrimp] = rankPotsData.flat()

      return {
        rankPotsBalance: rankPotsKazama ? +formatBigNumber(rankPotsKazama) : 0,
        burnedByGame: burnedKazama ? +formatBigNumber(burnedKazama) : 0,
        allTimeClaimed: allTimeKazamaClaimed ? +formatBigNumber(allTimeKazamaClaimed) : 0,
        totalClaimedByShrimps: totalAmountShrimps ? +formatBigNumber(totalAmountShrimps) : 0,
        totalBurnedByShrimps: totalBurnedShrimps ? +formatBigNumber(totalBurnedShrimps) : 0,
        totalShrimpClaimers: totalClaimersShrimp ? +formatBigNumber(totalClaimersShrimp) : 0,
        claimTimeShrimp: userTimeShrimp ? +formatBigNumber(userTimeShrimp) : 0,
      }
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  const kazamaPriceBusd = usePriceKazamaBusd()

  // Total collected
  const collectedValue = kazamaPriceBusd.times(rankPotsBalance)
  const collectedValueString = formatNumber(collectedValue.toNumber())

  // Total burned USD
  const burnedValue = kazamaPriceBusd.times(burnedByGame)
  const burnedValueString = formatNumber(burnedValue.toNumber())

  // All time claimed USD
  const allTimeClaimedValue = kazamaPriceBusd.times(allTimeClaimed)
  const allTimeClaimedValueString = formatNumber(allTimeClaimedValue.toNumber())

  // Shrimp data
  const allTimeClaimedShrimps = kazamaPriceBusd.times(totalClaimedByShrimps)
  const allTimeClaimedShrimpsValueString = formatNumber(allTimeClaimedShrimps.toNumber()) 

  // Shrimp share
  const shrimpAmount = rankPotsBalance / 100 * shrimpShare;
  // Crab share
  const crabAmount = rankPotsBalance / 100 * crabShare;
  // Fish share
  const fishAmount = rankPotsBalance / 100 * fishShare;
  // Turtle share
  const turtleAmount = rankPotsBalance / 100 * turtleShare;
  // Dolphin share
  const dolphinAmount = rankPotsBalance / 100 * dolphinShare;
  // Orca share
  const orcaAmount = rankPotsBalance / 100 * orcaShare;
  // Shark share
  const sharkAmount = rankPotsBalance / 100 * sharkShare;
  // Whale share
  const whaleAmount = rankPotsBalance / 100 * whaleShare;
  // Kraken share
  const krakenAmount = rankPotsBalance / 100 * krakenShare;
  // Spacenaut share
  const spacenautAmount = rankPotsBalance / 100 * spacenautShare;

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(oldValue => {
        const newValue = oldValue + 10;

        if (newValue === 100) {
          clearInterval(interval);
        }

        return newValue;
      });
    }, 1000);
  }, []);

  return (
    <>
    <PoolsPage>
     <GameContainer>
      <RankContainer>
          <PoolHeader>
         Shrimp Pool
        </PoolHeader>


        Overall pool stats
        <ClaimersContainer>
          <ClaimersBox>
          {totalBurnedByShrimps ? (
           <BalanceBig fontSize="15px" decimals={2} value={totalBurnedByShrimps} />
        ) : (
          <>
            <div ref={observerRef} />
            <BalanceBig  decimals={2} bold value={0} />
          </>
        )}  
          </ClaimersBox>
          <ClaimersBox>
         {shrimpAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={shrimpAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
          </ClaimersBox>
        </ClaimersContainer>
      </RankContainer>

      <RankContainer>
      <PoolHeader>
         Crab Pool
      </PoolHeader>
      {crabAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={crabAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
      </RankContainer>

      <RankContainer>
      <PoolHeader>
         Fish Pool
      </PoolHeader>
      {fishAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={fishAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
      </RankContainer>

     </GameContainer>

     <GameContainer>
      <RankContainer>
      <PoolHeader>
         Turtle Pool
        </PoolHeader>
        {turtleAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={turtleAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
      </RankContainer>

      <RankContainer>
      <PoolHeader>
         Dolphin Pool
        </PoolHeader>
        {dolphinAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={dolphinAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
      </RankContainer>

      <RankContainer>
      <PoolHeader>
         Orca Pool
        </PoolHeader>
        {orcaAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={orcaAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
      </RankContainer>
     </GameContainer>

     <GameContainer>
      <RankContainer>
      <PoolHeader>
         Shark Pool
        </PoolHeader>
        {sharkAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={sharkAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
      </RankContainer>

      <RankContainer>
      <PoolHeader>
         Whale Pool
        </PoolHeader>
        {whaleAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={whaleAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
      </RankContainer>

      <RankContainer>
      <PoolHeader>
         Kraken Pool
        </PoolHeader>
        {krakenAmount ? (
          <BalanceBig fontSize="18px" decimals={2} value={krakenAmount} />
         ) : (
           <BalanceBig  decimals={2} bold value={0} />
         )
        }
      </RankContainer>

     </GameContainer>




      <Flex flexDirection="row" style={{justifyContent: "space-between"}}>
      <Flex flexDirection="column">
        <Flex>
        {rankPotsBalance ? (
           <BalanceBig fontSize="15px" decimals={2} value={rankPotsBalance} />
        ) : (
          <>
            <div ref={observerRef} />
            <BalanceBig  decimals={2} bold value={0} />
          </>
        )}  
        </Flex>
        <Flex>
        {collectedValue ? (
          <NavText fontSize="15px" color="#fff">{t('$%totalCollectedUsd%', { totalCollectedUsd: collectedValueString })}</NavText>
          ) : (
            <NavText>$0.00</NavText>
          )} 
        </Flex>
      </Flex>

      <Flex flexDirection="column">
        <Flex>
        {burnedByGame ? (
           <BalanceBig fontSize="15px" decimals={2} value={burnedByGame} />
        ) : (
          <>
            <div ref={observerRef} />
            <BalanceBig  decimals={2} bold value={0} />
          </>
        )}  
        </Flex>
        <Flex>
        {burnedValue ? (
          <NavText fontSize="15px" color="#fff">{t('$%totalBurnedUsd%', { totalBurnedUsd: burnedValueString })}</NavText>
          ) : (
            <NavText>$0.00</NavText>
          )} 
       </Flex>
       </Flex>

       <Flex flexDirection="column">
       <Flex>
        {allTimeClaimed ? (
           <BalanceBig fontSize="15px" decimals={2} value={allTimeClaimed} />
        ) : (
          <>
            <div ref={observerRef} />
            <BalanceBig  decimals={2} bold value={0} />
          </>
        )}  
        </Flex>
        <Flex>
        {allTimeClaimedValue ? (
          <NavText fontSize="15px" color="#fff">{t('$%allTimeClaimedUsd%', { allTimeClaimedUsd: allTimeClaimedValueString })}</NavText>
          ) : (
            <NavText>$0.00</NavText>
          )} 
       </Flex>
        </Flex>



       </Flex>
    </PoolsPage>
    </>
  )
}

export default RankPots
