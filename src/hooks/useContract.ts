import {
  Kazama,
  KazamaFlexibleSideVaultV2,
  KazamaVaultV2,
  Erc20,
  Erc20Bytes32,
  Erc721collection,
  Multicall,
  Weth,
  Zap,
} from 'config/abi/types'
import zapAbi from 'config/abi/zap.json'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useProviderOrSigner } from 'hooks/useProviderOrSigner'
import { useMemo } from 'react'
import { getMulticallAddress, getPredictionsV1Address, getZapAddress } from 'utils/addressHelpers'
import {
  getAnniversaryAchievementContract,
  getBKazamaFarmBoosterContract,
  getBKazamaFarmBoosterProxyFactoryContract,
  getBKazamaProxyContract,
  getBep20Contract,
  getBusdDistributorContract,
  getClaimGameContract,
  getSenshiFactoryContract,
  getSenshiSpecialKazamaVaultContract,
  getSenshiSpecialContract,
  getSenshiSpecialLotteryContract,
  getSenshiSpecialPredictionContract,
  getSenshiSpecialXmasContract,
  getKazamaContract,
  getKazamaFlexibleSideVaultV2Contract,
  getKazamaPredictionsContract,
  getKazamaVaultV2Contract,
  getChainlinkOracleContract,
  getClaimRefundContract,
  getEasterNftContract,
  getErc721CollectionContract,
  getErc721Contract,
  getFarmAuctionContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getIfoV3Contract,
  getLotteryV2Contract,
  getSenshimasterContract,
  getSenshimasterV1Contract,
  getNftMarketContract,
  getNftSaleContract,
  getKazamaSenshisContract,
  getKazamaSquadContract,
  getPointCenterIfoContract,
  getPotteryDrawContract,
  getPotteryVaultContract,
  getPredictionsContract,
  getPredictionsV1Contract,
  getProfileContract,
  getSouschefContract,
  getTradingCompetitionContractEaster,
  getTradingCompetitionContractFanToken,
  getTradingCompetitionContractMobox,
  getTradingCompetitionContractMoD,
} from 'utils/contractHelpers'
import { useSigner } from 'wagmi'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { WNATIVE } from '@kazamaswap/sdk'
import { ERC20_BYTES32_ABI } from '../config/abi/erc20'
import ERC20_ABI from '../config/abi/erc20.json'
import IPancakePairABI from '../config/abi/IPancakePair.json'
import multiCallAbi from '../config/abi/Multicall.json'
import WETH_ABI from '../config/abi/weth.json'
import { getContract } from '../utils'

import { IPancakePair } from '../config/abi/types/IPancakePair'
import { VaultKey } from '../state/types'
import { useActiveChainId } from './useActiveChainId'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const { data: signer } = useSigner()
  return useMemo(() => getIfoV1Contract(address, signer), [address, signer])
}

export const useIfoV2Contract = (address: string) => {
  const { data: signer } = useSigner()
  return useMemo(() => getIfoV2Contract(address, signer), [address, signer])
}

export const useIfoV3Contract = (address: string) => {
  const { data: signer } = useSigner()
  return useMemo(() => getIfoV3Contract(address, signer), [address, signer])
}

export const useBusdDistributorContract = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBusdDistributorContract(providerOrSigner, chainId), [providerOrSigner, chainId])
}

export const useClaimGameContract = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getClaimGameContract(providerOrSigner, chainId), [providerOrSigner, chainId])
}

export const useERC20 = (address: string, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBep20Contract(address, providerOrSigner), [address, providerOrSigner])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getErc721Contract(address, providerOrSigner), [address, providerOrSigner])
}

export const useKazama = (): { reader: Kazama; signer: Kazama } => {
  const providerOrSigner = useProviderOrSigner()
  return useMemo(
    () => ({
      reader: getKazamaContract(null),
      signer: getKazamaContract(providerOrSigner),
    }),
    [providerOrSigner],
  )
}

export const useKazamaBurn = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getKazamaContract(providerOrSigner, chainId), [providerOrSigner, chainId])
}

export const useSenshiFactory = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSenshiFactoryContract(signer), [signer])
}

export const useKazamaSenshis = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getKazamaSenshisContract(signer), [signer])
}

export const useProfileContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getProfileContract(providerOrSigner), [providerOrSigner])
}

export const useLotteryV2Contract = () => {
  const providerOrSigner = useProviderOrSigner()
  return useMemo(() => getLotteryV2Contract(providerOrSigner), [providerOrSigner])
}

export const useSenshimaster = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getSenshimasterContract(providerOrSigner, chainId), [providerOrSigner, chainId])
}

export const useSenshimasterV1 = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSenshimasterV1Contract(signer), [signer])
}

export const useSousChef = (id) => {
  const { data: signer } = useSigner()
  return useMemo(() => getSouschefContract(id, signer), [id, signer])
}

export const usePointCenterIfoContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getPointCenterIfoContract(signer), [signer])
}

export const useSenshiSpecialContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSenshiSpecialContract(signer), [signer])
}

export const useClaimRefundContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getClaimRefundContract(signer), [signer])
}

export const useTradingCompetitionContractEaster = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getTradingCompetitionContractEaster(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractFanToken = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getTradingCompetitionContractFanToken(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractMobox = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getTradingCompetitionContractMobox(providerOrSigner), [providerOrSigner])
}

export const useTradingCompetitionContractMoD = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getTradingCompetitionContractMoD(providerOrSigner), [providerOrSigner])
}

export const useEasterNftContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getEasterNftContract(signer), [signer])
}

export const useVaultPoolContract = (vaultKey: VaultKey): KazamaVaultV2 | KazamaFlexibleSideVaultV2 => {
  const { data: signer } = useSigner()
  return useMemo(() => {
    if (vaultKey === VaultKey.KazamaVault) {
      return getKazamaVaultV2Contract(signer)
    }
    if (vaultKey === VaultKey.KazamaFlexibleSideVault) {
      return getKazamaFlexibleSideVaultV2Contract(signer)
    }
    return null
  }, [signer, vaultKey])
}

export const useKazamaVaultContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getKazamaVaultV2Contract(providerOrSigner), [providerOrSigner])
}

export const usePredictionsContract = (address: string, tokenSymbol: string) => {
  const { data: signer } = useSigner()
  return useMemo(() => {
    if (address === getPredictionsV1Address()) {
      return getPredictionsV1Contract(signer)
    }
    const getPredContract = tokenSymbol === 'KAZAMA' ? getKazamaPredictionsContract : getPredictionsContract

    return getPredContract(address, signer)
  }, [address, tokenSymbol, signer])
}

export const useChainlinkOracleContract = (address, withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getChainlinkOracleContract(address, providerOrSigner), [providerOrSigner, address])
}

export const useSpecialSenshiKazamaVaultContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSenshiSpecialKazamaVaultContract(signer), [signer])
}

export const useSpecialSenshiPredictionContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSenshiSpecialPredictionContract(signer), [signer])
}

export const useSenshiSpecialLotteryContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSenshiSpecialLotteryContract(signer), [signer])
}

export const useSenshiSpecialXmasContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getSenshiSpecialXmasContract(signer), [signer])
}

export const useAnniversaryAchievementContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getAnniversaryAchievementContract(signer), [signer])
}

export const useNftSaleContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getNftSaleContract(signer), [signer])
}

export const useKazamaSquadContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getKazamaSquadContract(signer), [signer])
}

export const useFarmAuctionContract = (withSignerIfPossible = true) => {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getFarmAuctionContract(providerOrSigner), [providerOrSigner])
}

export const useNftMarketContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getNftMarketContract(signer), [signer])
}

export const useErc721CollectionContract = (
  collectionAddress: string,
): { reader: Erc721collection; signer: Erc721collection } => {
  const { data: signer } = useSigner()
  return useMemo(
    () => ({
      reader: getErc721CollectionContract(null, collectionAddress),
      signer: getErc721CollectionContract(signer, collectionAddress),
    }),
    [signer, collectionAddress],
  )
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { provider } = useActiveWeb3React()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible) ?? provider

  const canReturnContract = useMemo(() => address && ABI && providerOrSigner, [address, ABI, providerOrSigner])

  return useMemo(() => {
    if (!canReturnContract) return null
    try {
      return getContract(address, ABI, providerOrSigner)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, providerOrSigner, canReturnContract]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWNativeContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract<Weth>(chainId ? WNATIVE[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract<Erc20Bytes32>(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): IPancakePair | null {
  return useContract(pairAddress, IPancakePairABI, withSignerIfPossible)
}

export function useMulticallContract() {
  const { chainId } = useActiveWeb3React()
  return useContract<Multicall>(getMulticallAddress(chainId), multiCallAbi, false)
}

export const usePotterytVaultContract = (address) => {
  const { data: signer } = useSigner()
  return useMemo(() => getPotteryVaultContract(address, signer), [address, signer])
}

export const usePotterytDrawContract = () => {
  const { data: signer } = useSigner()
  return useMemo(() => getPotteryDrawContract(signer), [signer])
}

export function useZapContract(withSignerIfPossible = true) {
  return useContract<Zap>(getZapAddress(), zapAbi, withSignerIfPossible)
}

export function useBKazamaFarmBoosterContract(withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBKazamaFarmBoosterContract(providerOrSigner), [providerOrSigner])
}

export function useBKazamaFarmBoosterProxyFactoryContract(withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(() => getBKazamaFarmBoosterProxyFactoryContract(providerOrSigner), [providerOrSigner])
}

export function useBKazamaProxyContract(proxyContractAddress: string, withSignerIfPossible = true) {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)
  return useMemo(
    () => proxyContractAddress && getBKazamaProxyContract(proxyContractAddress, providerOrSigner),
    [providerOrSigner, proxyContractAddress],
  )
}
