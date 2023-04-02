import React, { FC, useCallback, useState, useEffect } from 'react'
import ProgressBar from "@ramonak/react-progress-bar"
import PropTypes from "prop-types";
import Balance from 'components/Balance'
import { useWeb3React } from '@kazamaswap/wagmi'
import { Box, Flex, Text, useMatchBreakpoints, Card, Skeleton, Image, Button, AutoRenewIcon, TrophyGoldIcon } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import styled from 'styled-components'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import { formatBigNumber, formatNumberExact, formatNumber } from 'utils/formatBalance'
import { multicallv2 } from 'utils/multicall'
import { bscTokens, bscTestnetTokens } from '@kazamaswap/tokens'
import useSWR from 'swr'
import { BigNumber } from '@ethersproject/bignumber'
import { FAST_INTERVAL } from 'config/constants'
import kazamaAbi from 'config/abi/kazama.json'
import usdtAbi from 'config/abi/usdt.json'

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

const MINIMUM_TO_CLAIM_KAZAMA = 5000;

const NavBarBurned = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const [value, setValue] = useState(0);
  const {
    data: { AllTimeBurned } = {
      AllTimeBurned: 0,
    },
  } = useSWR(
    loadData ? ['kazamaDataRow'] : null,
    async () => {
      const AllTimeBurnedCall = { address: bscTestnetTokens.kazama.address, name: 'AllTimeBurned', }

      const [tokenDataResultRaw] = await Promise.all([
        multicallv2({
          abi: kazamaAbi,calls: [AllTimeBurnedCall],
        options:
         {requireSuccess: false,},
        }),
      ])
      const [totalKazamaBurned] = tokenDataResultRaw.flat()

      return {
        AllTimeBurned: totalKazamaBurned ? +formatBigNumber(totalKazamaBurned) : 0,
      }
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  const kazamaPriceBusd = usePriceKazamaBusd()
  const collectedValue = kazamaPriceBusd.times(AllTimeBurned)
  const collectedValueString = formatNumber(collectedValue.toNumber())

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
    <Flex flexDirection="row">
     <TrophyGoldIcon width={32}/>
     <Text>
          Kazama Burned
        </Text>
     <Flex flexDirection="row" ml="10px" alignContent="center">
      <Flex>
      {AllTimeBurned ? (
           <BalanceBig fontSize="15px" decimals={2} value={AllTimeBurned} />
        ) : (
          <>
            <div ref={observerRef} />
            <BalanceBig  decimals={2} bold value={0} />
          </>
        )}  
      </Flex>
      <Flex ml="2px">
      {collectedValue ? (
          <NavText fontSize="15px" color="#fff">{t('$%totalCollectedUsd%', { totalCollectedUsd: collectedValueString })}</NavText>
          ) : (
            <NavText>$0.00</NavText>
          )} 
      </Flex>
     </Flex>
    </Flex>

    </>
  )
}

export default NavBarBurned
