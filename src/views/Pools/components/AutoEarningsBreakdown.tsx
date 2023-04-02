import { Text } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { differenceInHours } from 'date-fns'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { getKazamaVaultEarnings } from '../helpers'

interface AutoEarningsBreakdownProps {
  pool: DeserializedPool
  account: string
}

const AutoEarningsBreakdown: React.FC<React.PropsWithChildren<AutoEarningsBreakdownProps>> = ({ pool, account }) => {
  const { t } = useTranslation()

  const { earningTokenPrice } = pool
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const { autoKazamaToDisplay, autoUsdToDisplay } = getKazamaVaultEarnings(
    account,
    userData.kazamaAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    earningTokenPrice,
    pool.vaultKey === VaultKey.KazamaVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee
          .plus((userData as DeserializedLockedVaultUser).currentOverdueFee)
          .plus((userData as DeserializedLockedVaultUser).userBoostedShare)
      : null,
  )

  const lastActionInMs = userData.lastUserActionTime ? parseInt(userData.lastUserActionTime) * 1000 : 0
  const hourDiffSinceLastAction = differenceInHours(Date.now(), lastActionInMs)
  const earnedKazamaPerHour = hourDiffSinceLastAction ? autoKazamaToDisplay / hourDiffSinceLastAction : 0
  const earnedUsdPerHour = hourDiffSinceLastAction ? autoUsdToDisplay / hourDiffSinceLastAction : 0

  return (
    <>
      <Text bold>
        {autoKazamaToDisplay.toFixed(2)}
        {' KAZAMA'}
      </Text>
      <Text bold color="success">~ ${autoUsdToDisplay.toFixed(9)}</Text>
      <Text>{t('Earned since your last action')}:</Text>
      <Text color="warning">{new Date(lastActionInMs).toLocaleString()}</Text>
      {hourDiffSinceLastAction ? (
        <>
          <Text>{t('Your average per hour')}:</Text>
          <Text bold>{t('KAZAMA / %amount%', { amount: earnedKazamaPerHour.toFixed(2) })}</Text>
          <Text bold>{t('USD / $%amount%', { amount: earnedUsdPerHour.toFixed(2) })}</Text>
        </>
      ) : null}
    </>
  )
}

export default AutoEarningsBreakdown
