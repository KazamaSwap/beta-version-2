import { ChainId } from '@kazamaswap/sdk'
import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'
import { VaultKey } from 'state/types'

export const getAddress = (address: Address, chainId?: number): string => {
  return address[chainId] ? address[chainId] : address[ChainId.BSC_TESTNET]
}

export const getSenshiMasterAddress = (chainId?: number) => {
  return getAddress(addresses.senshiMaster, chainId)
}
export const getSenshiMasterV1Address = () => {
  return getAddress(addresses.senshiMasterV1)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses.multiCall, chainId)
}
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2)
}
export const getKazamaProfileAddress = () => {
  return getAddress(addresses.kazamaProfile)
}
export const getKazamaSenshisAddress = () => {
  return getAddress(addresses.kazamaSenshis)
}
export const getBusdDistributorAddress = () => {
  return getAddress(addresses.busdDistributor)
}
export const getClaimGameAddress = () => {
  return getAddress(addresses.busdDistributor)
}
export const getSenshiFactoryAddress = () => {
  return getAddress(addresses.senshiFactory)
}
export const getPredictionsV1Address = () => {
  return getAddress(addresses.predictionsV1)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getSenshiSpecialAddress = () => {
  return getAddress(addresses.senshiSpecial)
}
export const getTradingCompetitionAddressEaster = () => {
  return getAddress(addresses.tradingCompetitionEaster)
}
export const getTradingCompetitionAddressFanToken = () => {
  return getAddress(addresses.tradingCompetitionFanToken)
}

export const getTradingCompetitionAddressMobox = () => {
  return getAddress(addresses.tradingCompetitionMobox)
}

export const getTradingCompetitionAddressMoD = () => {
  return getAddress(addresses.tradingCompetitionMoD)
}

export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}

export const getVaultPoolAddress = (vaultKey: VaultKey) => {
  if (!vaultKey) {
    return null
  }
  return getAddress(addresses[vaultKey])
}

export const getKazamaVaultAddress = () => {
  return getAddress(addresses.kazamaVault)
}

export const getKazamaFlexibleSideVaultAddress = () => {
  return getAddress(addresses.kazamaFlexibleSideVault)
}

export const getSenshiSpecialKazamaVaultAddress = () => {
  return getAddress(addresses.senshiSpecialKazamaVault)
}
export const getSenshiSpecialPredictionAddress = () => {
  return getAddress(addresses.senshiSpecialPrediction)
}
export const getSenshiSpecialLotteryAddress = () => {
  return getAddress(addresses.senshiSpecialLottery)
}
export const getSenshiSpecialXmasAddress = () => {
  return getAddress(addresses.senshiSpecialXmas)
}
export const getFarmAuctionAddress = () => {
  return getAddress(addresses.farmAuction)
}
export const getAnniversaryAchievement = () => {
  return getAddress(addresses.AnniversaryAchievement)
}

export const getNftMarketAddress = () => {
  return getAddress(addresses.nftMarket)
}
export const getNftSaleAddress = () => {
  return getAddress(addresses.nftSale)
}
export const getKazamaSquadAddress = () => {
  return getAddress(addresses.kazamaSquad)
}
export const getPotteryDrawAddress = () => {
  return getAddress(addresses.potteryDraw)
}

export const getZapAddress = () => {
  return getAddress(addresses.zap)
}
export const getIKazamaAddress = () => {
  return getAddress(addresses.iKazama)
}

export const getBKazamaFarmBoosterAddress = () => {
  return getAddress(addresses.bKazamaFarmBooster)
}

export const getBKazamaFarmBoosterProxyFactoryAddress = () => {
  return getAddress(addresses.bKazamaFarmBoosterProxyFactory)
}
