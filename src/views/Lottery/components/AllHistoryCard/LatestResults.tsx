import SunburstSvg from 'components/Sunburst/SunburstSvg';
import { LotteryStatus } from 'config/constants/types';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from 'state';
import { fetchLottery } from 'state/lottery/helpers';
import { useFetchLottery, useLottery } from 'state/lottery/hooks';
import styled, { keyframes } from 'styled-components';
import getTimePeriods from 'utils/getTimePeriods';
import DrawTimer from 'views/Lottery/components/PreviousRoundCard/DrawTimer';
import UsdPrize from 'views/Lottery/components/PreviousRoundCard/UsdPrize';
import useStatusTransitions from 'views/Lottery/hooks/useStatusTransitions';

import { useTranslation } from '@kazamaswap/localization';
import {
    ArrowForwardIcon, Box, Button, CardBody, CardFooter, CardHeader, CardRibbon, Flex, Image,
    KazamaFrontCard, PocketWatchIcon, Skeleton, Text
} from '@kazamaswap/uikit';

import { getDrawnDate, processLotteryResponse } from '../../helpers';
import LatestResultRewards from '../LatestResultRewards';
import PreviousRoundCardBody from '../PreviousRoundCard/Body';
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer';
import LatestResultSwitcher from './LatestResultSwitcher';

const StyledSunburst = styled(SunburstSvg)`
  height: 300%;
  width: 125%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 400%;
    width: 125%;
  }
`

const TicketSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-4deg);
`

export const KazamaTextButton = styled(Button)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const StyledCardFooter = styled(CardFooter)`
  z-index: 2;
  background: none;
  border-radius: 0px 0px 15px 15px;
`

const StyledCard = styled(KazamaFrontCard)`
  width: 100%;
  background: #292734;
  border: 1px solid #1B1A23;
  border-right: 2px solid #1B1A23;
  border-bottom: 3px solid #1B1A23;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.301));
  
  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  padding-top: 10px;
  padding-bottom: 7px;
  z-index: 2;
  background: none;
  border-top: 1px ${({ theme }) => theme.colors.cardBorder} solid;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const StyledCardBody = styled(CardBody)`
  background-image: linear-gradient(#21202c ,#292734);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledPrizeBox = styled(Box)`
  background: #292734;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledSection = styled(CardBody)`
background: #292734;
position: relative;
overflow: hidden;
padding-top: 7px;
padding-bottom: 8px;
z-index: 10;
border-top: 1px ${({ theme }) => theme.colors.cardBorder} solid;
border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const StyledTimerBox = styled(CardBody)`
padding: 14px;
background: #2e2b3a;
position: relative;
overflow: hidden;
padding-top: 7px;
padding-bottom: 8px;
width: 90%;
z-index: 10;
border-top: 1px ${({ theme }) => theme.colors.cardBorder} solid;
border-bottom: 2px ${({ theme }) => theme.colors.cardBorder} solid;
border-left: 1px ${({ theme }) => theme.colors.cardBorder} solid;
border-right: 2px ${({ theme }) => theme.colors.cardBorder} solid;
border-radius: 10px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-row-gap: 36px;
    grid-template-columns: auto 1fr;
  }
`

export const LeftWrapper = styled(Flex)`
  z-index: 1;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  ${({ theme }) => theme.mediaQueries.md} {

    padding-bottom: 40px;
  }
`

export const RightWrapper = styled.div`
  position: absolute;
  right: -17px;
  opacity: 0.9;
  transform: translate(0, -50%);
  top: 50%;
  img {
    height: 100%;
    width: 500px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    right: 24px;
    bottom: 0;
    transform: unset;
    opacity: 1;
    top: unset;
    height: 211px;
  }
`

const BgWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`

const floatingTicketLeft = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-10px, 15px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const floatingTicketRight = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(10px, 15px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const mainTicketAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(6deg);
  }
  to {
    transform: rotate(0deg);
  }
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;
  z-index: 100;
  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

export const BoxWrapper = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0;
  gap: 1em;
  margin-bottom: 15px;
  margin-top: 30px;

  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

export const BackDrop = styled(Flex)`
background: linear-gradient(89.92deg, rgb(82, 0, 255) 0.08%, rgb(0, 255, 240) 52.6%, rgb(250, 0, 255) 99.93%);
opacity: 0.35;
filter: blur(135px);
border-radius: 190.145px;
width: 300px;
height: 317px;
position: absolute;
top: -90px;
`

const LatestResults = () => {
  useFetchLottery()
  useStatusTransitions()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    currentLotteryId,
    lotteriesData,
    currentRound: { status, isLoading },
  } = useLottery()
  const [latestRoundId, setLatestRoundId] = useState(null)
  const [selectedRoundId, setSelectedRoundId] = useState('')
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState(null)
  const timer = useRef(null)

  const numRoundsFetched = lotteriesData?.length

  useEffect(() => {
    if (currentLotteryId) {
      const currentLotteryIdAsInt = currentLotteryId ? parseInt(currentLotteryId) : null
      const mostRecentFinishedRoundId =
        status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
      setLatestRoundId(mostRecentFinishedRoundId)
      setSelectedRoundId(mostRecentFinishedRoundId.toString())
    }
  }, [currentLotteryId, status])

  useEffect(() => {
    setSelectedLotteryNodeData(null)

    const fetchLotteryData = async () => {
      const lotteryData = await fetchLottery(selectedRoundId)
      const processedLotteryData = processLotteryResponse(lotteryData)
      setSelectedLotteryNodeData(processedLotteryData)
    }

    timer.current = setInterval(() => {
      if (selectedRoundId) {
        fetchLotteryData()
      }
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRoundId, currentLotteryId, numRoundsFetched, dispatch])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRoundId(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRoundId('')
      }
      if (parseInt(value, 10) >= latestRoundId) {
        setSelectedRoundId(latestRoundId.toString())
      }
    } else {
      setSelectedRoundId('')
    }
  }

  const handleArrowButtonPress = (targetRound) => {
    if (targetRound) {
      setSelectedRoundId(latestRoundId.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId('1')
    }
  }

  return (
    <StyledCard>
      <StyledSection>
        <LatestResultSwitcher
          isLoading={isLoading}
          selectedRoundId={selectedRoundId}
          mostRecentRound={latestRoundId}
          handleInputChange={handleInputChange}
          handleArrowButtonPress={handleArrowButtonPress}
        />
          {selectedRoundId ? (
            selectedLotteryNodeData?.endTime ? (
              <Text fontSize="14px">
                {t('Drawn')} {getDrawnDate(locale, selectedLotteryNodeData.endTime)}
              </Text>
            ) : (
              <Skeleton width="185px" height="21px" />
            )
          ) : null}
      </StyledSection>
      <PreviousRoundCardBody lotteryNodeData={selectedLotteryNodeData} lotteryId={selectedRoundId} />
      <LatestResultRewards lotteryNodeData={selectedLotteryNodeData} />
      <StyledCardFooter>
        <KazamaTextButton width="100%">
        <PocketWatchIcon color="invertedContrast" width="35px" mr="7px" />
          Check for a prize!
        </KazamaTextButton>
      </StyledCardFooter>




      {/* <Image width={240} height={172} src="/images/lottery/tombola.png" alt="tombola senshi" mr="8px" mb="16px" /> */}
      {/* <StyledCardRibbon text={t('LOTTERY')} /> */}
            {/* <BgWrapper>
        <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
             <StyledSunburst />
        </Flex>
      </BgWrapper> */}
      {/* <StyledCardBody>
       <DrawTimer />
        </StyledCardBody>
        <StyledPrizeBox>
        <UsdPrize />
        </StyledPrizeBox> */}

    </StyledCard>
  )
}

export default LatestResults