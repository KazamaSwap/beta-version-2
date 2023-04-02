// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import { useCallback, useState, useMemo, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { formatDistanceToNowStrict } from 'date-fns'
import { bscTestnetTokens } from '@kazamaswap/tokens'
import {
  IconButton,
  LotteryBallsIcon,
  Text,
  Flex,
  Box,
  Radio,
  Skeleton,
  LinkExternal,
  ArrowForwardIcon,
  ArrowBackIcon,
  RocketIcon,
  HotIcon,
  TransactionHistoryIcon,
  Button
} from '@kazamaswap/uikit'
import { formatAmount } from 'utils/formatInfoNumbers'
import { CurrencyLogo } from 'components/Logo'
import { getBlockExploreLink } from 'utils'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import truncateHash from 'utils/truncateHash'
import { TransactionType } from 'state/info/types'
import { ITEMS_PER_KAZAMA_TABLE_PAGE } from 'config/constants/info'
import { useTranslation } from '@kazamaswap/localization'
import { useFetchTxs } from 'hooks/useClient'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import ProfileCell from 'views/Nft/market/components/ProfileCell'
import { useLastUpdated } from '@kazamaswap/hooks'

const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
`

const Pagination = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 16px;
  margin: 33.5px 0px 3px;
`

const TitleText = styled(Text)`
    color: #F4EEFF;
    font-weight: 600;
    line-height: 1.5;
    font-size: 17px;

`

const TitleBox = styled.div`
align-items: center;
background-clip: padding-box;

background-image: linear-gradient(to right, #292334 , #31293d);
border: 1px solid transparent;
border-radius: 15px;
display: flex;
padding: 6px 1rem;
position: relative;
margin-top: 3px;
margin-bottom: 3px;
`

const SeperatorLine = styled.div`
background: #332b40;
flex: 1 0 0;
height: 1px;
margin: 0 0 0 0;
`

const TableWrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;
  gap: 10px;
  background-color: #292334;
  border-radius: 7px;
  border-spacing: 10px 0px;
`

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  :hover {
    cursor: pointer;
  }
`

const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`

const Wrapper = styled.div`
  width: 100%;
`

const ResponsiveTopGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 1fr 0.8fr repeat(3, 1fr);
  padding: 0 24px;
  margin-bottom: 10px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 1fr repeat(3, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`

const IconWrapper = styled.div`
display: inline-block;
border-radius: 50%;
box-shadow: 0 0 2px #888;
padding: 0.5em 0.6em;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  row-gap: 1ch;
  background: #292334;
  border-radius: 5px;
  height: 55px;
  margin-bottom: 7px;
  align-items: center;
  grid-template-columns: 1fr 0.8fr repeat(3, 1fr);
  padding: 0 24px;
  &:hover {
    background: rgba(44, 38, 57, 0.897);
  }
  @media screen and (max-width: 940px) {
    grid-template-columns: 1fr repeat(3, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`

const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
`

const CellWrapper = styled(Box)`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
`

const CellWrapperKazama = styled(Box)`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
`

const SORT_FIELD = {
  amount: 'value',
  timestamp: 'blockTimestamp',
  sender: 'fromAddress',
  hash: 'transactionHash',
  to: 'toAddress',
}

interface Transaction {
  type: string
  transactionHash: string
  fromAddress: string
  toAddress: string
  value: number
  blockTimestamp: string
}

const TableLoader: React.FC<React.PropsWithChildren> = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const DataRow: React.FC<React.PropsWithChildren<{ transaction: Transaction }>> = ({ transaction }) => {
  const { t } = useTranslation()
  const kazamaPriceBusd = usePriceKazamaBusd()
  const BURN_ADDRESS = '0x0000000000000000000000000000000000000000'
  let textColor
  if (transaction.type === 'Purchased Kazama') {
    textColor = 'rgb(49, 208, 170)'
  } else if (transaction.type === 'Sold Kazama') {
    textColor = '#FF5958'
  } else if (transaction.type === 'Burned Kazama') {
    textColor = '#F79418'
  }
  const timestampAsMs = parseFloat(transaction.blockTimestamp) * 1000
  const localeTimestamp = new Date(timestampAsMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
  const txAmount = new BigNumber(transaction.value)
  const date = Date.parse(transaction.blockTimestamp)

  if (transaction.fromAddress === BURN_ADDRESS) {
    // @ts-ignore
    transaction.type = 'Burn'
  }
    // @ts-ignore
  if (transaction.type === 'Buy') {
    transaction.fromAddress = transaction.toAddress
  }

  return (
    <ResponsiveGrid>
      {/* <LinkExternal href={getBlockExploreLink(transaction.transactionHash, 'transaction')}> */}
      <CellWrapper>
        <ProfileCell accountAddress={transaction.fromAddress} />
      </CellWrapper>
      <CellWrapper>
      {/* <CurrencyLogo currency={bscTestnetTokens.kazama} style={{ marginRight: 8, marginLeft: 5, borderRadius: '50%', width: '32px' ,height: '32px' }} /> */}
      <Text fontSize="15px">
          {getBalanceAmount(txAmount).toFixed(2)}
        </Text>
        <Balance
          fontSize="13px"
          color={textColor}
          prefix="$"
          value={getBalanceNumber(txAmount.times(kazamaPriceBusd))}
          decimals={2}
        />
      </CellWrapper>
      <Text fontSize="15px" color={textColor}>
         {/* {eventIcon()}  */}
         {transaction.type}
        {/* <span style={{paddingLeft: "16px", fontSize: "14px"}}>{truncateHash(transaction.transactionHash)}</span> */}
      </Text>
      {/* </LinkExternal> */}


{/* 
      <CellWrapper>
        <Text>-</Text>
      </CellWrapper> */}

      <LinkExternal color="text" fontSize="15px" href={getBlockExploreLink(transaction.transactionHash, 'address')}>
        {truncateHash(transaction.transactionHash)}
      </LinkExternal>
      <Text fontSize="15px">{new Date(date).toUTCString()}</Text>
    </ResponsiveGrid>
  )
}

const TxTable = () => {
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const transactions = useFetchTxs()
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const { lastUpdated, setLastUpdated: refreshTxTable } = useLastUpdated()
  useEffect(() => {
    const interval = setInterval(() => {
       refreshTxTable();
      },60*75);
      return () => clearInterval(interval);
    }, []);

  const sortedTransactions = useMemo(() => {
    const toBeAbsList = [SORT_FIELD.amount]
    return transactions
      ? transactions
          .slice()
          .sort((a, b) => {
            if (a && b) {
              const firstField = a[sortField as keyof Transaction]
              const secondField = b[sortField as keyof Transaction]
              const [first, second] = toBeAbsList.includes(sortField)
                ? [Math.abs(firstField as number), Math.abs(secondField as number)]
                : [firstField, secondField]
              return first > second ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(ITEMS_PER_KAZAMA_TABLE_PAGE * (page - 1), page * ITEMS_PER_KAZAMA_TABLE_PAGE)
      : []
  }, [transactions, page, sortField, sortDirection])

  // Update maxPage based on amount of items & applied filtering
  useEffect(() => {
    if (transactions) {
      const filteredTransactions = transactions
      if (filteredTransactions.length % ITEMS_PER_KAZAMA_TABLE_PAGE === 0) {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_KAZAMA_TABLE_PAGE))
      } else {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_KAZAMA_TABLE_PAGE) + 1)
      }
    }
  }, [transactions, lastUpdated])


  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  // useEffect(() => {
  //
  //  }, [transactions]);

  return (
    <><Pagination>
      <Flex alignItems="center" justifyContent="left" mr="auto">
      <TransactionHistoryIcon width="18px" mr="7px" />
        <TitleText>Kazama Activity</TitleText>
      </Flex>
      <SeperatorLine />

      <Flex alignItems="center" justifyContent="right">
      <Arrow
                onClick={() => {
                  setPage(page === 1 ? page : page - 1)
                } }
                  >
        <IconButton color={page === 1 ? 'textDisabled' : 'primary'} mr="10px">
          <ArrowBackIcon />
        </IconButton>
        </Arrow>
        <Arrow
                onClick={() => {
                  setPage(page === maxPage ? page : page + 1)
                } }
                  >
        <IconButton color={page === maxPage ? 'textDisabled' : 'primary'}>
          <ArrowForwardIcon />
        </IconButton>
        </Arrow>
      </Flex>

    </Pagination>
    <Wrapper>
        <ResponsiveTopGrid>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('From Account')}
          </Text>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amount)}
            textTransform="uppercase"
          >
            {t('Kazama Amount')} {arrow(SORT_FIELD.amount)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.sender)}
            textTransform="uppercase"
          >
            {t('Event')} {arrow(SORT_FIELD.sender)}
          </ClickableColumnHeader>
          {/* <ClickableColumnHeader
      color="secondary"
      fontSize="12px"
      bold
      onClick={() => handleSort(SORT_FIELD.to)}
      textTransform="uppercase"
    >
      {t('To')} {arrow(SORT_FIELD.to)}
    </ClickableColumnHeader> */}
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.hash)}
            textTransform="uppercase"
          >
            {t('Transaction')} {arrow(SORT_FIELD.hash)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.timestamp)}
            textTransform="uppercase"
          >
            {t('Time')} {arrow(SORT_FIELD.timestamp)}
          </ClickableColumnHeader>
        </ResponsiveTopGrid>

        {transactions.length > 1 ? (
          <>
            {sortedTransactions.map((transaction, index) => {
              if (transaction) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Fragment key={index}>
                    <DataRow transaction={transaction} />

                  </Fragment>
                )
              }
              return null
            })}
            {sortedTransactions.length === 0 ? (
              <Flex justifyContent="center">
                <Text>{t('No Transactions')}</Text>
              </Flex>
            ) : undefined}
          </>
        ) : (
          <>
            <TableLoader />
            {/* spacer */}
            <Box />
          </>
        )}

      </Wrapper></>
  )
}

export default TxTable