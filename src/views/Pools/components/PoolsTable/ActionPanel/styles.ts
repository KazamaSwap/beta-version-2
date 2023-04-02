import styled from 'styled-components'
import { Flex } from '@kazamaswap/uikit'

export const ActionContainer = styled(Flex)`
  flex-direction: column;
  padding: 16px;
  border: 2px solid #1B1A23;
  border-radius: 16px;
  margin-bottom: 16px;
  background-image: linear-gradient(#1B1A23, #292734);

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
  }
}

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 32px;
    margin-right: 0;
  }
`

ActionContainer.defaultProps = {
  flex: 1,
}

export const RowActionContainer = styled(ActionContainer)`
  flex-direction: row;
`

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
`

export const ActionContent = styled(Flex)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

ActionContent.defaultProps = {
  mt: '8px',
}
