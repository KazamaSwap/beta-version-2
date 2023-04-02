import { PageMeta } from 'components/Layout/Page';
import PoolsPage from 'components/Layout/PoolsPage';
import PageSection from 'components/PageSection';
import SunburstSvg from 'components/Sunburst/SunburstSvg';
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch';
import { useAccountLocalEventListener } from 'hooks/useAccountLocalEventListener';
import { useEffect, useRef } from 'react';
import { useInitialBlock } from 'state/block/hooks';
import { initializePredictions } from 'state/predictions';
import { useChartView, useIsChartPaneOpen } from 'state/predictions/hooks';
import { PredictionsChartView } from 'state/types';
import {
    useUserPredictionChainlinkChartDisclaimerShow, useUserPredictionChartDisclaimerShow
} from 'state/user/hooks';
import styled from 'styled-components';
import CompositeImage from 'views/Swap/CompositeImage';

import { Flex, Heading, Text, useMatchBreakpoints, useModal } from '@kazamaswap/uikit';
import { useWeb3React } from '@kazamaswap/wagmi';

import ChainlinkChartDisclaimer from './components/ChainlinkChartDisclaimer';
import ChartDisclaimer from './components/ChartDisclaimer';
import CollectWinningsPopup from './components/CollectWinningsPopup';
import Container from './components/Container';
import RiskDisclaimer from './components/RiskDisclaimer';
import SwiperProvider from './context/SwiperProvider';
import Desktop from './Desktop';
import usePollPredictions from './hooks/usePollPredictions';
import Mobile from './Mobile';

const TopLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  top: 0;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const topLeftImage = {
  path: '/images/home/KazamaMoon/',
  attributes: [
    { src: '1-left', alt: 'Kazama Moon' },
  ],
}

const MoonWrapper = styled(Container)`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    visibility: visible;
  }
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

const BgWrapper = styled.div`
background: url(https://ibb.co/C0c2yYN) no-repeat center center fixed; 
-webkit-background-size: cover;
-moz-background-size: cover;
-o-background-size: cover;
background-size: cover;
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

function Warnings() {
  const [showDisclaimer] = useUserPredictionChartDisclaimerShow()
  const [showChainlinkDisclaimer] = useUserPredictionChainlinkChartDisclaimerShow()
  const isChartPaneOpen = useIsChartPaneOpen()
  const chartView = useChartView()

  const [onPresentChartDisclaimer] = useModal(<ChartDisclaimer />, false)
  const [onPresentChainlinkChartDisclaimer] = useModal(<ChainlinkChartDisclaimer />, false)

  // TODO: memoize modal's handlers
  const onPresentChartDisclaimerRef = useRef(onPresentChartDisclaimer)
  const onPresentChainlinkChartDisclaimerRef = useRef(onPresentChainlinkChartDisclaimer)

  // Chart Disclaimer
  useEffect(() => {
    if (isChartPaneOpen && showDisclaimer && chartView === PredictionsChartView.TradingView) {
      onPresentChartDisclaimerRef.current()
    }
  }, [onPresentChartDisclaimerRef, isChartPaneOpen, showDisclaimer, chartView])

  // Chainlink Disclaimer
  useEffect(() => {
    if (isChartPaneOpen && showChainlinkDisclaimer && chartView === PredictionsChartView.Chainlink) {
      onPresentChainlinkChartDisclaimerRef.current()
    }
  }, [onPresentChainlinkChartDisclaimerRef, isChartPaneOpen, showChainlinkDisclaimer, chartView])

  return null
}

const Predictions = () => {
  const { isDesktop } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const dispatch = useLocalDispatch()
  const initialBlock = useInitialBlock()

  useAccountLocalEventListener()

  useEffect(() => {
    if (initialBlock > 0) {
      // Do not start initialization until the first block has been retrieved
      dispatch(initializePredictions(account))
    }
  }, [initialBlock, dispatch, account])

  usePollPredictions()
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <PageMeta />
      <Warnings />
      <RiskDisclaimer />
      <SwiperProvider>
        <Container>
          {isDesktop ? <Desktop /> : <Mobile />}
          <CollectWinningsPopup />
        </Container>
      </SwiperProvider>
    </>
  )
}

export default Predictions
