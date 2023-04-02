import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { Flex, Heading, Card, Box } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import Page from 'components/Layout/Page'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import {
  useAllPoolData,
  useAllTokenData,
  useProtocolChartData,
  useProtocolData,
  useProtocolTransactions,
} from 'state/info/hooks'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import ScrollToTopButton from 'components/ScrollToTopButton/ScrollToTopButtonV2'
import HoverableChart from '../components/InfoCharts/HoverableChart'
import InfoNav from '../components/InfoNav'

export const ChartCardsContainer = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0;
  gap: 1em;

  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

export const Wrapper = styled(Box)`
box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 1300px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    flex-wrap: wrap;
`

const TopNavWrapper = styled.div`
box-sizing: border-box;
    margin: 0px 0px 20px;
    min-width: 0px;
    display: flex;
    width: 100%;
    max-width: 1300px;
    height: fit-content;
    padding: 20px;
    background: #25202F;
    border-radius: 10px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    flex-flow: row wrap;
`

const InfoBox = styled.div`
box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    display: flex;
    max-width: 100%;
    min-height: 402px;
    height: 100%;
    background: #25202F;
    border-radius: 10px;
    gap: 20px; 
    padding: 20px;
    flex: 1 0 40%;
    flex-wrap: wrap;
`

const Overview: React.FC<React.PropsWithChildren> = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const [protocolData] = useProtocolData()
  const [chartData] = useProtocolChartData()
  const [transactions] = useProtocolTransactions()

  const currentDate = useMemo(
    () => new Date().toLocaleString(locale, { month: 'short', year: 'numeric', day: 'numeric' }),
    [locale],
  )

  const allTokens = useAllTokenData()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])

  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)
  }, [allPoolData])

  const somePoolsAreLoading = useMemo(() => {
    return Object.values(allPoolData).some((pool) => !pool.data)
  }, [allPoolData])

  return (
    <>
    <Page>
    {createPortal(<ScrollToTopButton />, document.body)}
    <Wrapper>
        <TopNavWrapper>
          <InfoNav />
        </TopNavWrapper>
       <InfoBox>
        Shit
       </InfoBox>
       <InfoBox>
        <ChartCardsContainer>
            <HoverableChart
              chartData={chartData}
              protocolData={protocolData}
              currentDate={currentDate}
              valueProperty="liquidityUSD"
              title={t('Liquidity')}
              ChartComponent={LineChart} />
              </ChartCardsContainer>
                        </InfoBox>
              </Wrapper>
        <Heading scale="lg" mt="40px" mb="16px">
          {t('Top Tokens')}
        </Heading>
        <TokenTable tokenDatas={formattedTokens} />
        <Heading scale="lg" mt="40px" mb="16px">
          {t('Top Pools')}
        </Heading>
        <PoolTable poolDatas={poolDatas} loading={somePoolsAreLoading} />
        <Heading scale="lg" mt="40px" mb="16px">
          {t('Transactions')}
        </Heading>
        <TransactionTable transactions={transactions} />
      </Page>
      </>
  )
}

export default Overview
