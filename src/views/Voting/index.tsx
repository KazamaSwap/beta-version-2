import { PageMeta } from 'components/Layout/Page';
import styled from 'styled-components';
import TopSliderBar from 'views/Home/components/TopSliderBar';

import { Flex } from '@kazamaswap/uikit';

import Footer from './components/Footer';
import Hero from './components/Hero';
import { Proposals } from './components/Proposals';

const Chrome = styled.div`
  flex: none;
`

const Content = styled.div`
  flex: 1;
  height: 100%;
`

const Voting = () => {
  return (
    <>
      <PageMeta />
      <div>
        <div style={{background: 'linear-gradient(180deg,#25202F,rgba(34,33,39,0)), url("/images/casino-bg.png") no-repeat bottom', marginTop: "64px", padding: "50px 0px", backgroundSize: "cover",  position: "relative"}}>
        <TopSliderBar />
           <div className='slider-graphic slider-graphic-1' />
           <div className='slider-graphic slider-graphic-2' />
           <div className='slider-graphic slider-graphic-3' /> 
          <div className='slider-graphic slider-graphic-4' />
        </div>
      </div>
      <Flex flexDirection="column" minHeight="calc(100vh - 64px)">
        <Chrome>
          <Hero />
        </Chrome>
        <Content>
          <Proposals />
        </Content>
        <Chrome>
          <Footer />
        </Chrome>
      </Flex>
    </>
  )
}

export default Voting
