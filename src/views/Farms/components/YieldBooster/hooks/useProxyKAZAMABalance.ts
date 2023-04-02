import { useWeb3React } from '@kazamaswap/wagmi'
import { useSWRContract } from 'hooks/useSWRContract'
import { getKazamaContract } from 'utils/contractHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { useBKazamaProxyContractAddress } from 'views/Farms/hooks/useBKazamaProxyContractAddress'
import BigNumber from 'bignumber.js'

const useProxyKAZAMABalance = () => {
  const { account } = useWeb3React()
  const { proxyAddress } = useBKazamaProxyContractAddress(account)
  const kazamaContract = getKazamaContract()

  const { data, mutate } = useSWRContract([kazamaContract, 'balanceOf', [proxyAddress]])

  return {
    refreshProxyKazamaBalance: mutate,
    proxyKazamaBalance: data ? getBalanceNumber(new BigNumber(data.toString())) : 0,
  }
}

export default useProxyKAZAMABalance
