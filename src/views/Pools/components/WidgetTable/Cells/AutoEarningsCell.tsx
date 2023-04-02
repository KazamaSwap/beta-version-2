import styled from 'styled-components'
import { Skeleton, Text, useTooltip, HelpIcon, Flex, Box, useMatchBreakpoints } from '@kazamaswap/uikit'
import { DeserializedPool, VaultKey, DeserializedPoolLockedVault } from 'state/types'
import Balance from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from '@kazamaswap/localization'
import { getKazamaVaultEarnings } from 'views/Pools/helpers'
import BaseCell, { CellContent } from './BaseCell'
import AutoEarningsBreakdown from '../../AutoEarningsBreakdown'

interface AutoEarningsCellProps {
  pool: DeserializedPool
  account: string
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const HelpIconWrapper = styled.div`
  align-self: center;
`

const AutoEarningsCell: React.FC<React.PropsWithChildren<AutoEarningsCellProps>> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { earningTokenPrice, vaultKey } = pool

  const vaultData = useVaultPoolByKey(vaultKey)
  const {
    userData: { userShares, kazamaAtLastUserAction, isLoading },
    pricePerFullShare,
  } = vaultData
  const { hasAutoEarnings, autoKazamaToDisplay, autoUsdToDisplay } = getKazamaVaultEarnings(
    account,
    kazamaAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
    vaultKey === VaultKey.KazamaVault
      ? (vaultData as DeserializedPoolLockedVault).userData.currentPerformanceFee
          .plus((vaultData as DeserializedPoolLockedVault).userData.currentOverdueFee)
          .plus((vaultData as DeserializedPoolLockedVault).userData.userBoostedShare)
      : null,
  )

  const labelText = t('Recent KAZAMA profit')
  const earningTokenBalance = autoKazamaToDisplay
  const hasEarnings = hasAutoEarnings
  const earningTokenDollarBalance = autoUsdToDisplay


  const { targetRef, tooltip, tooltipVisible } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom',
  })

  if (vaultKey === VaultKey.KazamaVault && !userShares.gt(0)) {
    return null
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {isLoading && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            {tooltipVisible && tooltip}
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={hasEarnings ? 'text' : 'text'}
                  decimals={hasEarnings ? 2 : 2}
                  value={hasEarnings ? earningTokenBalance : 0}
                />
                {hasEarnings ? (
                  <>
                    {earningTokenPrice > 0 && (
                      <Balance
                        display="inline"
                        fontSize="13px"
                        color="success"
                        decimals={10}
                        prefix="~"
                        value={earningTokenDollarBalance}
                        unit=" USD"
                      />
                    )}
                  </>
                ) : (
                  <Text mt="4px" fontSize="13px" color="success">
                    0 USD
                  </Text>
                )}
              </Box>
              {hasEarnings && !isMobile && (
                <HelpIconWrapper ref={targetRef}>
                  <HelpIcon color="textSubtle" />
                </HelpIconWrapper>
              )}
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default AutoEarningsCell