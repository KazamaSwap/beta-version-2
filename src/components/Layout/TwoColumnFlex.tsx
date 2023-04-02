import { Flex, FlexProps } from '@kazamaswap/uikit'
import styled from 'styled-components'

const TwoColumnFlex = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  & > * {
    min-width: 280px;
    max-width: 48.7%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
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

export default TwoColumnFlex
