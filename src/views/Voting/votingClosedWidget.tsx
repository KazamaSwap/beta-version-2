import { Flex } from '@kazamaswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import styled from 'styled-components'
import Footer from './components/Footer'
import Hero from './components/Hero'
import { WidgetFinished } from './components/Proposals/closedWidget'

const Chrome = styled.div`
  flex: none;
`

const Content = styled.div`
  flex: 1;
  height: 100%;
`

const VotingClosedWidget = () => {
  return (
    <>
      <Flex flexDirection="column" minHeight="calc(100vh - 64px)">
        <Content>
          <WidgetFinished />
        </Content>
      </Flex>
    </>
  )
}

export default VotingClosedWidget
