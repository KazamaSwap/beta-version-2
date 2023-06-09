import { useRef } from 'react'
import { Button, ChevronUpIcon } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { DeserializedPool } from 'state/types'
import PoolRow, { VaultPoolRow } from './PoolRow'

interface PoolsTableProps {
  pools: DeserializedPool[]
  account: string
  urlSearch?: string
}

const StyledTable = styled.div`
  border-radius: 15px;
  scroll-margin-top: 64px;

  background: #21202B;
  > div:not(:last-child) {
    border-bottom: 2px solid #1B1A23;
  }
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const StyledTableBorder = styled.div`
  border-radius: 15px;
  background-color: #1B1A23;
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const PoolsTable: React.FC<React.PropsWithChildren<PoolsTableProps>> = ({ pools, account, urlSearch }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }


  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {pools.map((pool) =>
          pool.vaultKey ? (
            <VaultPoolRow
              initialActivity={urlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
              key={pool.vaultKey}
              vaultKey={pool.vaultKey}
              account={account}
            />
          ) : (
            <PoolRow
              initialActivity={urlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
              key={pool.sousId}
              sousId={pool.sousId}
              account={account}
            />
          ),
        )}
                      <ScrollButtonContainer>
          <Button onClick={scrollToTop}>
            Go To Pools
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
