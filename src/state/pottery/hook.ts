import { useWeb3React } from '@kazamaswap/wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchKazamaVaultPublicData, fetchKazamaVaultUserData } from 'state/pools'
import { fetchLastVaultAddressAsync, fetchPublicPotteryDataAsync, fetchPotteryUserDataAsync } from './index'
import { potterDataSelector } from './selectors'
import { State } from '../types'

export const usePotteryFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const potteryVaultAddress = useLatestVaultAddress()

  useFastRefreshEffect(() => {
    dispatch(fetchLastVaultAddressAsync())

    if (potteryVaultAddress) {
      batch(() => {
        dispatch(fetchKazamaVaultPublicData())
        dispatch(fetchPublicPotteryDataAsync())
        if (account) {
          dispatch(fetchPotteryUserDataAsync(account))
          dispatch(fetchKazamaVaultUserData({ account }))
        }
      })
    }
  }, [potteryVaultAddress, account, dispatch])
}

export const usePotteryData = () => {
  return useSelector(potterDataSelector)
}

export const useLatestVaultAddress = () => {
  return useSelector((state: State) => state.pottery.lastVaultAddress)
}
