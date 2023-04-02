import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import senshimasterABI from 'config/abi/senshimaster.json'
import NoBscVaultAbi from 'config/abi/NoBscVaultAbi.json'
import multicall, { multicallv2 } from 'utils/multicall'
import { getSenshiMasterAddress } from 'utils/addressHelpers'
import { SerializedFarmConfig } from 'config/constants/types'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { getBscChainId } from 'state/farms/getBscChainId'

export const fetchFarmUserAllowances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
  proxyAddress?: string,
) => {
  const senshiMasterAddress = getSenshiMasterAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = farm.lpAddress
    return { address: lpContractAddress, name: 'allowance', params: [account, proxyAddress || senshiMasterAddress] }
  })

  const rawLpAllowances = await multicall<BigNumber[]>(erc20ABI, calls, chainId)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = farm.lpAddress
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls, chainId)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const senshiMasterAddress = getSenshiMasterAddress(chainId)
  const isBscNetwork = verifyBscNetwork(chainId)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: senshiMasterAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicallv2({
    abi: isBscNetwork ? senshimasterABI : NoBscVaultAbi,
    calls,
    chainId,
    options: { requireSuccess: false },
  })
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: SerializedFarmConfig[], chainId: number) => {
  const isBscNetwork = verifyBscNetwork(chainId)
  const multiCallChainId = isBscNetwork ? chainId : await getBscChainId(chainId)
  const senshiMasterAddress = getSenshiMasterAddress(multiCallChainId)

  const calls = farmsToFetch.map((farm) => {
    const pid = isBscNetwork ? farm.pid : farm.bscPid
    return {
      address: senshiMasterAddress,
      name: 'pendingKazama',
      params: [pid, account],
    }
  })

  const rawEarnings = await multicallv2({ abi: senshimasterABI, calls, chainId: multiCallChainId })
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
