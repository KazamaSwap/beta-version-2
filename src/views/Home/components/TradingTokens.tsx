import { useEffect, useState } from "react";
import { Box, Flex, Grid, LinkExternal, Text } from '@kazamaswap/uikit'
import { useFetchTokens } from 'hooks/useClient'
import useInterval from 'hooks/useInterval'
import styled from 'styled-components'
import Balance from 'components/Balance'

const TokensLayout = styled.div`
  display: flex;
  background: #25202F;
  border-top: 1px solid #1B1A23;
  border-bottom: 1px solid #1B1A23;
  flex-direction: column;
  align-content: center;
`
const TitleLayout = styled.div`
  display: flex;
  font-size: 16px;
  min-width: 170px;
  align-items: center;
  width: 100%;
`
const TokenGrid = styled.div`
  display: grid;
  grid-gap: 10px 8px;
  margin: 15px 0px 15px 0px;
  padding: 0px 16px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
    grid-template-columns: repeat(3, auto);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 15px;
    grid-template-columns: repeat(8, auto);
`





const TradingTokens = () => {
  const tokensData = useFetchTokens()
  const [from, setFrom] = useState(true)
  setTimeout(() => {
    setFrom(!from)
  }, 1000 * 10)
  return (
    <TokensLayout>
      {/* <TitleLayout>
        <Text textAlign="center" style={{width: "100%"}} mt={3}>Trending Tokens</Text>
      </TitleLayout> */}
      <TokenGrid>
        {
          tokensData.map((token, index) => {
            if (from && index < 6 || !from && index > 7)
              return (
                <a href={`/swap?outputCurrency=${token.contractAddress}`}>
                  <Flex width={145}>
                    <img src={token.logoUrl} alt="" width={45} style={{height: "45px"}} />
                    <Flex flexDirection="column" style={{marginLeft: "10px", width: "100%"}}>
                      <Flex justifyContent="space-between">
                        <Text>{token.tokenTicker}</Text>
                        <Balance ml="5px" decimals={2} value={Number(token.percentChange)} color={Number(token.percentChange) > 0 ? "#31D0AA" : "#F79418"} unit="%"/>
                      </Flex>
                      <Balance decimals={6} value={Number(token.tokenPrice)} prefix="$" />
                    </Flex>
                  </Flex>
                </a>
              )
              return (
                <></>
              )
          })
        }
      </TokenGrid>
    </TokensLayout>
  )
}

export default TradingTokens
