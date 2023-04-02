import styled from 'styled-components'
import { createPortal } from 'react-dom'
import { Flex, Heading, Text, Box } from '@kazamaswap/uikit'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@kazamaswap/wagmi'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import FrontPage, { PageMeta } from 'components/Layout/FrontPage'
import { useTranslation } from '@kazamaswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
import ScrollToTopButton from 'components/ScrollToTopButton/ScrollToTopButtonV2'
import SunburstSvg from 'components/Sunburst/SunburstSvg'
import TopSliderBar from './components/TopSliderBar'

const StyledSunburst = styled(SunburstSvg)`
  height: 350%;
  width: 350%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 600%;
    width: 600%;
  }
`

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const UserBannerWrapper = styled(Container)`
  z-index: 1;
  width: 100%;
  top: 0;
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const WidgetWrapper = styled(Flex)`
justify-content: center;
  @media screen and (max-width: 600px) {
      width: 100%;
  }
`

const TwoColumnUnequal = styled.div`
  float: left;
  .left {
    width: 23%;
  }
  
  .right {
    width: 73%;
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

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
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

const Wrapper = styled(Flex)`
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 150px;
`

const TopFarmHeader = styled.div`
box-sizing: border-box;
margin: 0px;
min-width: 0px;
display: flex;
position: relative;
width: 100%;
margin-top: 65px;
background-image: url(https://rollbit.com/static/media/banner-welcome.2c365efcff25a405dcff.jpg);
background-position: center;
background-repeat: no-repeat;
background-attachment: fixed;
background-size: cover;
border-radius: 7px;
height: 300px;
`


const TopWrapper = styled(Flex)`
    align-items: center;
    background-image:
    linear-gradient(to bottom, rgba(238, 26, 121, 0.918), #2e2b3a),
    url(/images/top-bg.jpg);
    background-size: cover;
    display: flex;
    height: 22.5rem;
    justify-content: center;
    position: relative;
    overflow: hidden;
`

const IconWrapper = styled.div`
display: inline-block;
border-radius: 999px;
width: 32px;
min-width: 32px;
height: auto;
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
    background: linear-gradient(0deg, #201c29 0%,  #25202F 100%);
    width: 129.75px;
    min-width: 129.75px;
    max-width: 129.75px;
    height: 148px;
    min-height: 148px;
    max-height: 148px;
`

const TopLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  top: 0;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const TopRightImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  top: 0;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const topLeftImage = {
  path: '/images/home/KazamaToken/',
  attributes: [
    { src: 'left-1', alt: 'KazamaSenshi' },
  ],
}

const topRightImage = {
  path: '/images/home/KazamaToken/',
  attributes: [
    { src: 'right-1', alt: 'KazamaSenshi' },
  ],
}

const KazamaTokenWrapper = styled(Container)`
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

const SectionTextBox = styled(Box)`
align-items: center;
background-clip: padding-box;
background-color: #2D253C;
border: 1px solid transparent;
border-radius: 5px;
display: flex;
padding: 0.625rem 1rem;
position: relative;
`

const SectionText = styled(Text)`
color: #62557d;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25rem;
    text-shadow: 0 0 24px rgb(200 53 78 / 62%);
`

const PolyBorder = styled.div`
filter: drop-shadow(1px 0px 0px #1B1A23)
drop-shadow(-1px 0px 0px #1B1A23)
drop-shadow(0px 0px 0px #1B1A23)
drop-shadow(0px -1px 0px #1B1A23)
drop-shadow(1px 0px 0px #1B1A23)
drop-shadow(-1px -1px 0px #1B1A23)
drop-shadow(-1px 2px 0px #1B1A23)
drop-shadow(1px -1px 0px #1B1A23);
`

const PolyShadow = styled.div`
  filter: drop-shadow(0 15px 30px rgba(32, 28, 41, 0.938));
`



const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { chainId } = useActiveChainId()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  const { t } = useTranslation()

  return (
    <>
      <PageMeta />
      <PolyBorder>
       <div>
        <div style={{background: 'linear-gradient(180deg,#11141e,rgba(27, 26, 35, 0.473)), url("/images/casino-bg.png") no-repeat bottom', marginTop: "64px", padding: "0px 0px", backgroundSize: "cover",  position: "relative"}}>
        <TopSliderBar />
            <div className='slider-graphic slider-graphic-1' />
             {/* <div className='slider-graphic slider-graphic-2' />  */}
           <div className='slider-graphic slider-graphic-3' /> 
           {/* <div className='slider-graphic slider-graphic-4' />  */}
        </div>
      </div>
      </PolyBorder>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
    </>
  )
}

export default Home
