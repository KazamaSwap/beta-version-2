import { Flex, FlexProps } from '@kazamaswap/uikit'
import styled from 'styled-components'

const ThreeColumnFlex = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    max-width: 32%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 16px;
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 100%;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`

export interface FlexGapProps extends FlexProps {
  gap?: string
  rowGap?: string
  columnGap?: string
}

export const FlexGap = styled(Flex)<FlexGapProps>`
  gap: ${({ gap }) => gap};
  row-gap: ${({ rowGap }) => rowGap};
  column-gap: ${({ columnGap }) => columnGap};
`

export default ThreeColumnFlex
