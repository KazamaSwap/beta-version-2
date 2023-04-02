import { ChainId } from '@kazamaswap/sdk'
import { useWeb3React } from '@kazamaswap/wagmi'
import { FetchStatus } from 'config/constants/types'
import useSWRImmutable from 'swr/immutable'
import { getAddress } from 'utils/addressHelpers'
import { getActivePools } from 'utils/calls'
import { bscRpcProvider } from 'utils/providers'
import { bscTestRpcProvider } from 'utils/testnetProvider'
import { getVotingPower } from '../helpers'

// Change bscTestRpcProvider to bscRpcProvider to switch to the binance main net

interface State {
  kazamaBalance?: number
  kazamaVaultBalance?: number
  kazamaPoolBalance?: number
  poolsBalance?: number
  kazamaBnbLpBalance?: number
  total: number
  lockedKazamaBalance?: number
  lockedEndTime?: number
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean; isError: boolean } => {
  const { account } = useWeb3React()
  const { data, status, error } = useSWRImmutable(
    account && isActive ? [account, block, 'votingPower'] : null,
    async () => {
      const blockNumber = block || (await bscTestRpcProvider.getBlockNumber())
      const eligiblePools = await getActivePools(blockNumber)
      const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress, ChainId.BSC_TESTNET))
      const {
        kazamaBalance,
        kazamaBnbLpBalance,
        kazamaPoolBalance,
        total,
        poolsBalance,
        kazamaVaultBalance,
        lockedKazamaBalance,
        lockedEndTime,
      } = await getVotingPower(account, poolAddresses, blockNumber)
      return {
        kazamaBalance,
        kazamaBnbLpBalance,
        kazamaPoolBalance,
        poolsBalance,
        kazamaVaultBalance,
        total,
        lockedKazamaBalance,
        lockedEndTime,
      }
    },
  )
  if (error) console.error(error)

  return { ...data, isLoading: status !== FetchStatus.Fetched, isError: status === FetchStatus.Failed }
}

export default useGetVotingPower
