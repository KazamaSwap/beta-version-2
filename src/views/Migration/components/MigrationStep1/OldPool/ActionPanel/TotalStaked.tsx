import React, { useMemo } from 'react'
import { Flex, Text } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@kazamaswap/localization'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { DeserializedPool } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'

const Containter = styled(Flex)`
  margin-top: 12px;
  padding: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0px;
    padding: 0 12px;
  }
`

interface TotalStakedProps {
  pool: DeserializedPool
  totalKazamaInVault: BigNumber
  kazamaInVaults: BigNumber
}

const TotalStaked: React.FC<React.PropsWithChildren<TotalStakedProps>> = ({ pool, totalKazamaInVault, kazamaInVaults }) => {
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
    <Containter justifyContent="space-between">
      <Text>{t('Total staked')}</Text>
      <Flex height="20px" alignItems="center">
        <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
      </Flex>
    </Containter>
  )
}

export default TotalStaked
