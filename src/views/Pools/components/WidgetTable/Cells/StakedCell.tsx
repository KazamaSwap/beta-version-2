import { Box, Flex, Skeleton, Text, useMatchBreakpoints } from '@kazamaswap/uikit'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from '@kazamaswap/localization'

import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedPoolLockedVault } from 'state/types'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface StakedCellProps {
  pool: DeserializedPool
  account: string
}

const StyledCell = styled(BaseCell)``

const StakedCell: React.FC<React.PropsWithChildren<StakedCellProps>> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  // vault
  const vaultData = useVaultPoolByKey(pool.vaultKey)
  const {
    userData: {
      userShares,
      balance: { kazamaAsBigNumber, kazamaAsNumberBalance },
      isLoading,
    },
  } = vaultData
  const hasSharesStaked = userShares.gt(0)
  const isVaultWithShares = pool.vaultKey && hasSharesStaked

  // pool
  const { stakingTokenPrice, stakingToken, userData } = pool
  const stakedAutoDollarValue = getBalanceNumber(kazamaAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const labelText = `${pool.stakingToken.symbol} ${
    pool.vaultKey === VaultKey.KazamaVault && (vaultData as DeserializedPoolLockedVault).userData.locked
      ? t('Locked')
      : t('Staked')
  }`

  const hasStaked = account && (stakedBalance.gt(0) || isVaultWithShares)

  const userDataLoading = pool.vaultKey ? isLoading : !pool.userDataLoaded

  return (
    <StyledCell
      role="cell"
      flex={
        pool.vaultKey === VaultKey.KazamaFlexibleSideVault
          ? '1 0 162px'
          : pool.vaultKey === VaultKey.KazamaVault && !hasStaked
          ? '1 0 120px'
          : '2 0 100px'
      }
    >
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {userDataLoading && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={hasStaked ? 'text' : 'text'}
                  decimals={hasStaked ? 2 : 2}
                  value={
                    hasStaked
                      ? pool.vaultKey
                        ? Number.isNaN(kazamaAsNumberBalance)
                          ? 0
                          : kazamaAsNumberBalance
                        : stakedTokenBalance
                      : 0
                  }
                />
                {hasStaked ? (
                  <Balance
                    display="inline"
                    fontSize="13px"
                    color="success"
                    decimals={2}
                    prefix="~"
                    value={pool.vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
                    unit=" USD"
                  />
                ) : (
                  <Text mt="4px" fontSize="12px" color="success">
                    0 USD
                  </Text>
                )}
              </Box>
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default StakedCell
