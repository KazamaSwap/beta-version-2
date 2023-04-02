import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@kazamaswap/uikit'
import SubNav from 'components/Menu/SubNav'
import Footer from 'components/Menu/Footer'
import { PageMeta } from 'components/Layout/Page'
import Container from 'components/Layout/Container'


const StyledPage = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px;
  padding-bottom: 0;
  min-height: calc(100vh - 64px);
  margin-top: 64px;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    min-height: calc(75vh - 64px);
    margin-bottom: 75px;
  }
`

const LiquidityPage: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    hideFooterOnDesktop?: boolean
  }
> = ({
  children,
  hideFooterOnDesktop = false,
  ...props
}) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>
        {children}
        <Flex flexGrow={1} />
      </StyledPage>
    </>
  )
}

export default LiquidityPage
