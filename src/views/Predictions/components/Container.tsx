import { memo } from 'react'
import styled from 'styled-components'

const Container = styled.div`

  @media only screen and (max-width: 575px) and (min-height: 740px) {
    height: calc(100vh - 150px);
    margin-top: 64px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    height: calc(100vh - 100px);
  }
  overflow: hidden;
`

export default memo(Container)
