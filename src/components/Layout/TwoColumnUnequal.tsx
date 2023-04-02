import { Flex, FlexProps } from '@kazamaswap/uikit'
import styled from 'styled-components'

const TwoColumnUnequal = styled.div`
  float: left;
  .left {
    width: 25%;
  }
  
  .right {
    width: 75%;
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

export default TwoColumnUnequal
