import { Box, Flex, Card, KazamaFrontCard } from '@kazamaswap/uikit'
import styled from 'styled-components'

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 0px;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    ${({ $isChartExpanded }) => ($isChartExpanded ? 'padding: 0 120px' : 'padding: 0 0 0 20px')};
  }
`

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 410px;
  max-width: 42rem;
`
