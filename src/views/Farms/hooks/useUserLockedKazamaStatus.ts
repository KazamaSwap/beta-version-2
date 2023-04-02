import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedKazamaVault, VaultKey } from 'state/types'

export const useUserLockedKazamaStatus = () => {
  const vaultPool = useVaultPoolByKey(VaultKey.KazamaVault) as DeserializedLockedKazamaVault

  return {
    isLoading: vaultPool?.userData?.isLoading,
    locked: Boolean(vaultPool?.userData?.locked),
    lockedEnd: vaultPool?.userData?.lockEndTime,
  }
}
