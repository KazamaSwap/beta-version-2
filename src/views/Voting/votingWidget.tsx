import { Flex } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { WidgetProposals } from './components/Proposals/Widget'

const VotingWidget = () => {
  return (
    <>
      <Flex flexDirection="column" minHeight="calc(100vh - 64px)">
          <WidgetProposals />
      </Flex>
    </>
  )
}

export default VotingWidget
