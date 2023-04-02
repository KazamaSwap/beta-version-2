import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { BIG_ZERO } from 'utils/bigNumber';
import { getBalanceNumber } from 'utils/formatBalance';
import { latinise } from 'utils/latinise';

import { Box, Button, ChevronUpIcon, RowType, Text } from '@kazamaswap/uikit';

import { getDisplayApr } from '../getDisplayApr';
import { DesktopColumnSchema, FarmWithStakedValue } from '../types';
import ProxyFarmContainer from '../YieldBooster/components/ProxyFarmContainer';
import Row, { RowProps } from './Row';

export interface ITableProps {
  farms: FarmWithStakedValue[]
  userDataReady: boolean
  kazamaPrice: BigNumber
  sortColumn?: string
}

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 1fr 0.8fr repeat(4, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 1fr repeat(4, 1fr);
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

const Container = styled.div`
  width: 100%;
  background: #141824;
  border-radius: 5px;
  margin: 0px 0px;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
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

export const KazamaHeaderText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 3.00px; 
   font-weight: 400;
   margin-bottom: 48px;
`

export const KazamaText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 28px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 2.00px; 
   font-weight: 400;
`

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const TableContainer = styled.div`
  position: relative;
`

const ResponsiveTopGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 1fr 0.8fr repeat(3, 1fr);
  padding: 0 24px;
  border-bottom: 1px solid rgba(0,0,0,0.35);
  padding-top: 15px;
  padding-bottom: 15px;
  @media screen and (max-width: 94 0px) {
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

const FarmTable: React.FC<React.PropsWithChildren<ITableProps>> = ({ farms, kazamaPrice, userDataReady }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { query } = useRouter()

  const columns = useMemo(
    () =>
      DesktopColumnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      })),
    [],
  )

  const getFarmEarnings = (farm) => {
    let earnings = BIG_ZERO
    const existingEarnings = new BigNumber(farm.userData.earnings)

    if (farm.boosted) {
      const proxyEarnings = new BigNumber(farm.userData?.proxy?.earnings)

      earnings = proxyEarnings.gt(0) ? proxyEarnings : existingEarnings
    } else {
      earnings = existingEarnings
    }

    return getBalanceNumber(earnings)
  }

  const generateRow = (farm) => {
    const { token, quoteToken } = farm
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split('  ')[0].toUpperCase().replace('KAZAMA', 'KAZAMA')
    const lowercaseQuery = latinise(typeof query?.search === 'string' ? query.search.toLowerCase() : '')
    const initialActivity = latinise(lpLabel?.toLowerCase()) === lowercaseQuery

    const row: RowProps = {
      apr: {
        value: getDisplayApr(farm.apr, farm.lpRewardsApr),
        pid: farm.pid,
        multiplier: farm.multiplier,
        lpLabel,
        lpSymbol: farm.lpSymbol,
        tokenAddress,
        quoteTokenAddress,
        kazamaPrice,
        lpRewardsApr: farm.lpRewardsApr,
        originalValue: farm.apr,
      },
      farm: {
        label: lpLabel,
        pid: farm.pid,
        token: farm.token,
        quoteToken: farm.quoteToken,
      },
      earned: {
        earnings: getFarmEarnings(farm),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm?.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      type: farm.isCommunity ? 'community' : 'core',
      details: farm,
      initialActivity,
    }

    return row
  }

  const rowData = farms.map((farm) => generateRow(farm))

  const generateSortedRow = (row) => {
    // @ts-ignore
    const newRow: RowProps = {}
    columns.forEach((column) => {
      if (!(column.name in row)) {
        throw new Error(`Invalid row data, ${column.name} not found`)
      }
      newRow[column.name] = row[column.name]
    })
    newRow.initialActivity = row.initialActivity
    return newRow
  }

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const sortedRows = rowData.map(generateSortedRow)

  return (
    <Container id="farms-table">
              <ResponsiveTopGrid>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
           Yield Pool
          </Text>
          {/* <Box
          >
            {('Kazama Amount')}
          </Box> */}
          <Box
          >
           Kazama Earned
          </Box>
          {/* <Box
      color="secondary"
      fontSize="12px"
      bold
      onClick={() => handleSort(SORT_FIELD.to)}
      textTransform="uppercase"
    >
      {t('To')} {arrow(SORT_FIELD.to)}
    </Box> */}
          <Box
          >
            APR
          </Box>
          <Box
          >
            TLV
          </Box>
          <Box
          >
            Multiplier
          </Box>
        </ResponsiveTopGrid>
      <TableContainer id="table-container">
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {sortedRows.map((row) => {
                return row?.details?.boosted ? (
                  <ProxyFarmContainer key={`table-row-${row.farm.pid}`} farm={row.details}>
                    <Row {...row} userDataReady={userDataReady} />
                  </ProxyFarmContainer>
                ) : (
                  <Row {...row} userDataReady={userDataReady} key={`table-row-${row.farm.pid}`} />
                )
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>
      </TableContainer>
    </Container>
  )
}

export default FarmTable
