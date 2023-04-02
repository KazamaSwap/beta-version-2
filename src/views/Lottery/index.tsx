import LotteryPage from 'components/Layout/LotteryPage';
import { PageMeta } from 'components/Layout/Page';
import PageSection from 'components/PageSection';
import SunburstSvg from 'components/Sunburst/SunburstSvg';
import { LotteryStatus } from 'config/constants/types';
import useTheme from 'hooks/useTheme';
import { useState } from 'react';
import { useFetchLottery, useLottery } from 'state/lottery/hooks';
import styled, { keyframes } from 'styled-components';
import TopSliderBar from 'views/Home/components/TopSliderBar';
import BuyTicketsButton from 'views/Lottery/components/BuyTicketsButton';

import { useTranslation } from '@kazamaswap/localization';
import {
    Box, Card, CardFooter, CardHeader, Flex, Heading, Image, KazamaFrontCard, Skeleton, Text,
    useIsomorphicEffect
} from '@kazamaswap/uikit';

import HistoryTable from './components/AllHistoryCard/historyTable';
import BuyTicketsBox from './components/BuyTicketsModal/BuyTicketsBox';
import CheckPrizesSection from './components/CheckPrizesSection';
import CurrentPrizes from './components/CurrentPrizes';
import CurrentRoundTickets from './components/CurrentRoundTickets';
import Hero from './components/Hero';
import HowToPlay from './components/HowToPlay';
import NextDrawCard from './components/NextDrawCard';
import NextDrawDate from './components/NextDrawDate';
import CurrentRoundRow from './components/PreviousRoundCard/CurrentRoundRow';
import TicketsBox from './components/ViewTicketsModal/ticketsBox';
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent';
import useStatusTransitions from './hooks/useStatusTransitions';
import LotteryHeader from './LotteryHeader';
import {
    CHECK_PRIZES_BG, FINISHED_ROUNDS_BG, FINISHED_ROUNDS_BG_DARK, GET_TICKETS_BG, TITLE_BG
} from './pageSectionStyles';
import * as S from './Styled';

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

const TicketContainer = styled(Flex)`
  animation: ${mainTicketAnimation} 3s ease-in-out infinite;
`

const Wrapper = styled(Flex)`
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 150px;
`

const Header = styled(S.StyledHeading)`
  font-size: 20px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
    min-height: auto;
  }
`

const BgWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const StyledSunburst = styled(SunburstSvg)`
  height: 350%;
  width: 350%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 600%;
    width: 600%;
  }
`

export const KazamaTextSmall = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 30px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.65px; 
   font-weight: 400;
`

export const KazamaTextBig = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 2.00px; 
   font-weight: 400;
`

export const ImageWrapper = styled(Image)`
  z-index: 4;
  margin-bottom: 75px;
  margin-right: 75px;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const PoolsContainer = styled(Card)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-85px);

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-285px);
  }
`

const SenshiTopContainer = styled(KazamaFrontCard)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-110px);
  background: transparent;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-234px);
  }
`

const LotteryHistoryContainer = styled(KazamaFrontCard)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-110px);
  background: transparent;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-400px);
  }
`

const KazamaCurrentRound = styled(KazamaFrontCard)`
  padding: 0px 0px 0px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-187px);
  background: transparent;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-425px);
  }
`

const ControlContainer = styled(Card)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-187px);
  margin-bottom: 15px;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-285px);
  }
`

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const StyledBuyTicketButton = styled(BuyTicketsButton)<{ disabled: boolean }>`
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabled : 'linear-gradient(180deg, #7645d9 0%, #452a7a 100%)'};
  width: 200px;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 240px;
  }
`

const ButtonWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-4deg);
`

const TicketSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-4deg);
`

const PrizeText = styled.div`
    font-family: Rubik;
    font-weight: 900;
    text-transform: uppercase;
    color: #fe617c;
    font-size: 5rem;
    line-height: 5.25rem;
`

const Container = styled.div`
  width: 100%;
  background-image: linear-gradient(#241f2e,#241f2e);
  border-radius: 7px;
  margin: 0px 0px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  margin-bottom: 20px;
`

const HeaderWrapper = styled.div`
    border-radius: 7px;
    background-image: linear-gradient(#241f2e,#241f2e);
    margin-bottom: 20px;
`

export const WrapperContainer = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0;
  gap: 1em;

  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

const BoxWrappers = styled.div`
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 16px 32px;
`

const StyledCardHeader = styled(CardHeader)`
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const HeaderText = styled(S.StyledHeading)`
  font-size: 20px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    min-height: auto;
  }
`

const HEADING_ONE_LINE_HEIGHT = 27

const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()
  const {
    currentRound: { status, endTime },
    isTransitioning,
  } = useLottery()
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  return (
    <>
        <PageMeta />  
      <LotteryPage>
        <HeaderWrapper>
      <div style={{background: 'url("/images/sunburst_2.svg") no-repeat bottom', padding: "15px 0px", backgroundSize: "cover", position: "relative"}}>
        {/* <Timer /> */}
      </div>
      </HeaderWrapper>

      <WrapperContainer>

      <HistoryTable />
        {/* <Container>
          <StyledCardHeader>
            Header
          </StyledCardHeader>
          <BoxWrappers>
             <TicketsBox roundId={KazamaCurrentRound} /> 
            </BoxWrappers>
        </Container> */}



            <CurrentPrizes />
            <CurrentPrizes />



      </WrapperContainer>
        {/* <RecentWinningBalls /> */}
         {/* <CurrentRoundRow />  */}
        {/* <LotteryHistoryContainer>

      </LotteryHistoryContainer> */}
      {/* <NextDrawCard />  */}
       {/* <CurrentRoundRow />  */}

      <Flex flexDirection="column">
      <Flex>
        <Container>
          <BoxWrappers>
            <NextDrawDate />
            <CurrentRoundTickets />
            </BoxWrappers>
        </Container>
        </Flex>
</Flex>
      </LotteryPage>
    </>
  )
}

export default Lottery
