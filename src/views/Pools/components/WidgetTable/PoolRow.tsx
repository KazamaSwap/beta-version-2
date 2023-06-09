import { memo } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@kazamaswap/uikit'
import { usePool, useDeserializedPoolByVaultKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'

import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import AutoAprCell from './Cells/AutoAprCell'
import StakedCell from './Cells/StakedCell'
import ExpandRow from './ExpandRow'

const StyledRow = styled.div`
  display: flex;
  cursor: pointer;
  &:hover {
    background-color: #252431;
    overflow: hidden;
  }
`

export const VaultPoolRow: React.FC<
  React.PropsWithChildren<{ vaultKey: VaultKey; account: string; initialActivity?: boolean }>
> = memo(({ vaultKey, account, initialActivity }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const pool = useDeserializedPoolByVaultKey(vaultKey)

  return (
    <StyledRow>
      <NameCell pool={pool} />
      <AutoAprCell pool={pool} />
      {isLargerScreen && <TotalStakedCell pool={pool} />}
      </StyledRow>
  )
})

const PoolRow: React.FC<React.PropsWithChildren<{ sousId: number; account: string; initialActivity?: boolean }>> = ({
  sousId,
  account,
  initialActivity,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const { pool } = usePool(sousId)

  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} />
      {isLargerScreen && <TotalStakedCell pool={pool} />}
      <AprCell pool={pool} />
      {isDesktop && <EndsInCell pool={pool} />}
    </ExpandRow>
  )
}

export default memo(PoolRow)
