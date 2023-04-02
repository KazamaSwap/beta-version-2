import useSWR from 'swr'
import { NO_PROXY_CONTRACT } from 'config/constants'
import { useBKazamaFarmBoosterContract } from 'hooks/useContract'
import { FetchStatus } from 'config/constants/types'

export const useBKazamaProxyContractAddress = (account?: string) => {
  const bKazamaFarmBoosterContract = useBKazamaFarmBoosterContract()
  const { data, status, mutate } = useSWR(account && ['proxyAddress', account], async () =>
    bKazamaFarmBoosterContract.proxyContract(account),
  )

  return {
    proxyAddress: data,
    isLoading: status !== FetchStatus.Fetched,
    proxyCreated: data && data !== NO_PROXY_CONTRACT,
    refreshProxyAddress: mutate,
  }
}
