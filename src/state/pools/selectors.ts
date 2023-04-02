import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformVault } from './helpers'
import { initialPoolVaultState } from './index'
import { getVaultPosition, VaultPosition } from '../../utils/kazamaPool'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState
const selectIfo = (state: State) => state.pools.ifo
const selectIfoUserCredit = (state: State) => state.pools.ifo.credit ?? BIG_ZERO

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool), userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.KazamaVault),
    makeVaultPoolByKey(VaultKey.KazamaFlexibleSideVault),
  ],
  (poolsWithUserDataLoading, deserializedLockedKazamaVault, deserializedFlexibleSideKazamaVault) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    const kazamaPool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    const withoutKazamaPool = pools.filter((pool) => pool.sousId !== 0)

    const kazamaAutoVault = {
      ...kazamaPool,
      ...deserializedLockedKazamaVault,
      vaultKey: VaultKey.KazamaVault,
      userData: { ...kazamaPool.userData, ...deserializedLockedKazamaVault.userData },
    }

    const lockedVaultPosition = getVaultPosition(deserializedLockedKazamaVault.userData)
    const hasFlexibleSideSharesStaked = deserializedFlexibleSideKazamaVault.userData.userShares.gt(0)

    const kazamaAutoFlexibleSideVault =
      lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked
        ? [
            {
              ...kazamaPool,
              ...deserializedFlexibleSideKazamaVault,
              vaultKey: VaultKey.KazamaFlexibleSideVault,
              userData: { ...kazamaPool.userData, ...deserializedFlexibleSideKazamaVault.userData },
            },
          ]
        : []

    return { pools: [kazamaAutoVault, ...kazamaAutoFlexibleSideVault, ...withoutKazamaPool], userDataLoaded }
  },
)

export const makeVaultPoolWithKeySelector = (vaultKey) =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find((p) => p.vaultKey === vaultKey))

export const ifoCreditSelector = createSelector([selectIfoUserCredit], (ifoUserCredit) => {
  return new BigNumber(ifoUserCredit)
})

export const ifoCeilingSelector = createSelector([selectIfo], (ifoData) => {
  return new BigNumber(ifoData.ceiling)
})
