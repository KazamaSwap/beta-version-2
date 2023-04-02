import { Flex, Text } from '@kazamaswap/uikit'
import { useWeb3React } from '@kazamaswap/wagmi'
import { useTranslation } from '@kazamaswap/localization'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { getKazamaVaultEarnings } from 'views/Pools/helpers'
import RecentKazamaProfitBalance from './RecentKazamaProfitBalance'

const RecentKazamaProfitCountdownRow = ({ pool }: { pool: DeserializedPool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const kazamaPriceBusd = usePriceKazamaBusd()
  const { hasAutoEarnings, autoKazamaToDisplay } = getKazamaVaultEarnings(
    account,
    userData.kazamaAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    kazamaPriceBusd.toNumber(),
    pool.vaultKey === VaultKey.KazamaVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee.plus(
          (userData as DeserializedLockedVaultUser).currentOverdueFee,
        )
      : null,
  )

  if (!(userData.userShares.gt(0) && account)) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent KAZAMA profit')}:`}</Text>
      {hasAutoEarnings && <RecentKazamaProfitBalance kazamaToDisplay={autoKazamaToDisplay} pool={pool} account={account} />}
    </Flex>
  )
}

export default RecentKazamaProfitCountdownRow
