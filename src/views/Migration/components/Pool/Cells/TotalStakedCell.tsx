import React, { useMemo } from 'react'
import { Flex, Text, Skeleton } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@kazamaswap/localization'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { DeserializedPool } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'

interface TotalStakedCellProps {
  pool: DeserializedPool
  totalKazamaInVault: BigNumber
  kazamaInVaults: BigNumber
}

const StyledCell = styled(BaseCell)`
  display: none;
  flex: 2 0 100px;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const TotalStakedCell: React.FC<React.PropsWithChildren<TotalStakedCellProps>> = ({
  pool,
  totalKazamaInVault,
  kazamaInVaults,
}) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked, vaultKey } = pool

  const isManualKazamaPool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalKazamaInVault, stakingToken.decimals)
    }
    if (isManualKazamaPool) {
      const manualKazamaTotalMinusAutoVault = new BigNumber(totalStaked).minus(kazamaInVaults)
      return getBalanceNumber(manualKazamaTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalKazamaInVault, isManualKazamaPool, totalStaked, stakingToken.decimals, kazamaInVaults])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        <Flex height="20px" alignItems="center">
          {totalKazamaInVault && totalKazamaInVault.gte(0) ? (
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
