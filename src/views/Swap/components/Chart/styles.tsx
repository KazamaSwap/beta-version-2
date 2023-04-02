import { Box } from '@kazamaswap/uikit'
import styled from 'styled-components'

export const StyledPriceChart = styled(Box)<{
  $isDark: boolean
  $isExpanded: boolean
  $isFullWidthContainer?: boolean
}>`
  border: none;
  border-radius: 14px;
  width: 100%;
  padding-top: 36px;
  border-bottom: 2px solid #1B1A23;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 8px;
    background: #141824;
    border: ${({ theme }) => `0px solid ${theme.colors.cardBorder}`};
    border-radius: ${({ $isExpanded }) => ($isExpanded ? '0' : '14px')};

    height: ${({ $isExpanded }) => ($isExpanded ? 'calc(100vh - 100px)' : '516px')};
    border-bottom: 2px solid rgba(0, 0, 0, 0.35);
  }
`

StyledPriceChart.defaultProps = {
  height: '70%',
}
