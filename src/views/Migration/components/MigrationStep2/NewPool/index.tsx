import React, { useEffect, useMemo } from 'react'
import { useWeb3React } from '@kazamaswap/wagmi'
import { useKazamaVault, usePoolsWithVault } from 'state/pools/hooks'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { useAppDispatch } from 'state'
import {
  fetchKazamaPoolUserDataAsync,
  fetchKazamaVaultFees,
  fetchKazamaVaultPublicData,
  fetchKazamaVaultUserData,
  fetchKazamaPoolPublicDataAsync,
  fetchKazamaFlexibleSideVaultPublicData,
  fetchKazamaFlexibleSideVaultUserData,
  fetchKazamaFlexibleSideVaultFees,
} from 'state/pools'
import { batch } from 'react-redux'
import PoolsTable from './PoolTable'

const NewPool: React.FC<React.PropsWithChildren> = () => {
  const { account } = useWeb3React()
  const { pools } = usePoolsWithVault()
  const kazamaVault = useKazamaVault()

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter((pool) => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  )

  const userDataReady: boolean = !account || (!!account && !kazamaVault.userData?.isLoading)

  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchKazamaVaultPublicData())
      dispatch(fetchKazamaFlexibleSideVaultPublicData())
      dispatch(fetchKazamaPoolPublicDataAsync())
      if (account) {
        dispatch(fetchKazamaVaultUserData({ account }))
        dispatch(fetchKazamaFlexibleSideVaultUserData({ account }))
        dispatch(fetchKazamaPoolUserDataAsync(account))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchKazamaVaultFees())
      dispatch(fetchKazamaFlexibleSideVaultFees())
    })
  }, [dispatch])

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
