import { useMemo, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card, Skeleton, Heading, CardHeader, CardFooter } from '@kazamaswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useAllTokenData } from 'state/info/hooks'
import { TokenData } from 'state/info/types'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import { useTranslation } from '@kazamaswap/localization'

const StyledCardHeader = styled(CardHeader)`
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
  background-image: linear-gradient(#1B1A23,#292734);
  border-radius: 15px 15px 0 0;
`


const CardWrapper = styled(NextLinkFromReactRouter)`
  display: inline-block;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const StyledCardFooter = styled(CardFooter)`
  z-index: 2;
  background: none;
  border-bottom: 2px ${({ theme }) => theme.colors.cardBorder} solid;
  border-radius: 0px 0px 15px 15px;
`

const TopMoverCard = styled(Box)`
margin-bottom: 14px;
height: 125px;
overflow: hidden;
display: grid;
-webkit-box-align: stretch;
align-items: stretch;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 20px;
border: 1px solid ${({ theme }) => theme.colors.cardBorder};
border-radius: 15px;
padding: 16px;
background: #292734;
`

export const ScrollableRow = styled.div`
margin-bottom: 14px;
height: 125px;
overflow: hidden;
display: grid;
-webkit-box-align: stretch;
align-items: stretch;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 15px;
`

const CellInner = styled.div`
  padding: 16px 0px;
  padding-left: 16px;
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  padding-right: 8px;
`

const TokenLogoCell = styled(CellInner)`
  width: 10px;
  & > h2 {
    font-size: 16px;
  }
`

const TokenCell = styled(CellInner)`
  width: 180px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 220px;
  }
`

const ActionCell = styled(CellInner)`
  width: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 80px;
  }
`

const StyledTr = styled.tr`
  padding: 0px 16px;
  cursor: pointer;
  max-width: 100%;
  &:not(:last-child) {
    border-bottom: 1px solid #1B1A23;
  }
  &:hover {
    background-color: #252431;
    overflow: hidden;
  }
`

const Container = styled.div`
  width: 100%;
  background-image: linear-gradient(#292734,#292734);
  border-radius: 16px;
  margin: 10px 5px 5px 10px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom: 3px solid ${({ theme }) => theme.colors.cardBorder};
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  border-top: 1px solid #1B1A23;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;
  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
`

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
  return (
    <>
    <StyledTr>
    <td key='token-logo'>
      <TokenLogoCell>
      <Box width="32px" height="32px">
              {/* wrapped in a box because of alignment issues between img and svg */}
              <CurrencyLogo address={tokenData.address} size="32px" />
            </Box>
      </TokenLogoCell>
    </td>
    <td key='change-id'>
            <TokenCell>
            <Box ml="16px">
              <Text>{tokenData.name}</Text>
              <Flex alignItems="center">
                <Text fontSize="14px" mr="6px" lineHeight="16px">
                  ${formatAmount(tokenData.volumeUSD)}
                </Text>
                <Percent fontSize="14px" value={tokenData.volumeUSDChange} />
              </Flex>
            </Box>
            </TokenCell>
          </td>
          </StyledTr>
          </>
  )
}

const TopVolumeMovers: React.FC<React.PropsWithChildren> = () => {
  const allTokens = useAllTokenData()
  const { t } = useTranslation()

  const topPriceIncrease = useMemo(() => {
    return Object.values(allTokens)
      .sort(({ data: a }, { data: b }) => {
        // eslint-disable-next-line no-nested-ternary
        return a && b ? (Math.abs(a?.volumeUSDChange) > Math.abs(b?.volumeUSDChange) ? -1 : 1) : -1
      })
      .slice(0, Math.min(5, Object.values(allTokens).length))
  }, [allTokens])

  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (increaseRef.current) {
        if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
          moveLeftRef.current = false
        } else if (increaseRef.current.scrollLeft === 0) {
          moveLeftRef.current = true
        }
        increaseRef.current.scrollTo(
          moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
          0,
        )
      }
    }, 30)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  if (topPriceIncrease.length === 0 || !topPriceIncrease.some((entry) => entry.data)) {
    return null
  }

  return (
    <><Container id="lotteries-table">
                  <StyledCardHeader>
<Heading>
  Top Volume Movers
</Heading>
      </StyledCardHeader>
      <TableContainer id="table-container">
        <TableWrapper>
          <StyledTable>
            <TableBody>
            {topPriceIncrease.map((entry) => entry.data ? <DataCard key={`top-card-token-${entry.data?.address}`} tokenData={entry.data} /> : null
        )}
            </TableBody>
          </StyledTable>
        </TableWrapper>
      </TableContainer>
    </Container></>
  )
}

export default TopVolumeMovers
