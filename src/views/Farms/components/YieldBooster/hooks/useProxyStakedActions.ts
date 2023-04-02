import { useWeb3React } from '@kazamaswap/wagmi'
import { useBKazamaProxyContract } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useGasPrice } from 'state/user/hooks'
import { harvestFarm, stakeFarm, unstakeFarm } from 'utils/calls/farms'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useBKazamaProxyContractAddress } from 'views/Farms/hooks/useBKazamaProxyContractAddress'
import { useApproveBoostProxyFarm } from '../../../hooks/useApproveFarm'
import useProxyKAZAMABalance from './useProxyKAZAMABalance'

export default function useProxyStakedActions(pid, lpContract) {
  const { account } = useWeb3React()
  const { chainId } = useActiveWeb3React()
  const { proxyAddress } = useBKazamaProxyContractAddress(account)
  const bKazamaProxy = useBKazamaProxyContract(proxyAddress)
  const dispatch = useAppDispatch()
  const gasPrice = useGasPrice()
  const { proxyKazamaBalance, refreshProxyKazamaBalance } = useProxyKAZAMABalance()

  const onDone = useCallback(() => {
    refreshProxyKazamaBalance()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId, proxyAddress }))
  }, [account, proxyAddress, chainId, pid, dispatch, refreshProxyKazamaBalance])

  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)

  const onStake = useCallback((value) => stakeFarm(bKazamaProxy, pid, value, gasPrice), [bKazamaProxy, pid, gasPrice])

  const onUnstake = useCallback((value) => unstakeFarm(bKazamaProxy, pid, value, gasPrice), [bKazamaProxy, pid, gasPrice])

  const onReward = useCallback(() => harvestFarm(bKazamaProxy, pid, gasPrice), [bKazamaProxy, pid, gasPrice])

  return {
    onStake,
    onUnstake,
    onReward,
    onApprove,
    onDone,
    proxyKazamaBalance,
  }
}
