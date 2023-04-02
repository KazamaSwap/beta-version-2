import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { provider } from 'utils/wagmi'
import { Contract } from '@ethersproject/contracts'
import poolsConfig from 'config/constants/pools'
import { PoolCategory } from 'config/constants/types'
import { KAZAMA } from '@kazamaswap/tokens'

// Addresses
import {
  getAddress,
  getBusdDistributorAddress,
  getKazamaProfileAddress,
  getKazamaSenshisAddress,
  getSenshiFactoryAddress,
  getSenshiSpecialAddress,
  getLotteryV2Address,
  getSenshiMasterAddress,
  getSenshiMasterV1Address,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddressEaster,
  getEasterNftAddress,
  getKazamaVaultAddress,
  getMulticallAddress,
  getSenshiSpecialKazamaVaultAddress,
  getSenshiSpecialPredictionAddress,
  getSenshiSpecialLotteryAddress,
  getFarmAuctionAddress,
  getAnniversaryAchievement,
  getNftMarketAddress,
  getNftSaleAddress,
  getKazamaSquadAddress,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMobox,
  getTradingCompetitionAddressMoD,
  getSenshiSpecialXmasAddress,
  getIKazamaAddress,
  getPotteryDrawAddress,
  getZapAddress,
  getKazamaFlexibleSideVaultAddress,
  getPredictionsV1Address,
  getBKazamaFarmBoosterAddress,
  getBKazamaFarmBoosterProxyFactoryAddress,
} from 'utils/addressHelpers'

// ABI
import distributorAbi from 'config/abi/distributor.json'
import profileABI from 'config/abi/kazamaProfile.json'
import kazamaSenshisAbi from 'config/abi/kazamaSenshis.json'
import senshiFactoryAbi from 'config/abi/senshiFactory.json'
import senshiSpecialAbi from 'config/abi/senshiSpecial.json'
import claimGameAbi from 'config/abi/claimGame.json'
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import kazamaAbi from 'config/abi/kazama.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import senshiMaster from 'config/abi/senshimaster.json'
import senshiMasterV1 from 'config/abi/senshimasterV1.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import tradingCompetitionEasterAbi from 'config/abi/tradingCompetitionEaster.json'
import tradingCompetitionFanTokenAbi from 'config/abi/tradingCompetitionFanToken.json'
import tradingCompetitionMoboxAbi from 'config/abi/tradingCompetitionMobox.json'
import tradingCompetitionMoDAbi from 'config/abi/tradingCompetitionMoD.json'
import easterNftAbi from 'config/abi/easterNft.json'
import kazamaVaultV2Abi from 'config/abi/kazamaVaultV2.json'
import kazamaFlexibleSideVaultV2Abi from 'config/abi/kazamaFlexibleSideVaultV2.json'
import predictionsAbi from 'config/abi/predictions.json'
import predictionsV1Abi from 'config/abi/predictionsV1.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import senshiSpecialKazamaVaultAbi from 'config/abi/senshiSpecialKazamaVault.json'
import senshiSpecialPredictionAbi from 'config/abi/senshiSpecialPrediction.json'
import senshiSpecialLotteryAbi from 'config/abi/senshiSpecialLottery.json'
import senshiSpecialXmasAbi from 'config/abi/senshiSpecialXmas.json'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import anniversaryAchievementAbi from 'config/abi/anniversaryAchievement.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import nftSaleAbi from 'config/abi/nftSale.json'
import kazamaSquadAbi from 'config/abi/kazamaSquad.json'
import erc721CollectionAbi from 'config/abi/erc721collection.json'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import potteryDrawAbi from 'config/abi/potteryDrawAbi.json'
import zapAbi from 'config/abi/zap.json'
import iKazamaAbi from 'config/abi/iKazama.json'
import ifoV3Abi from 'config/abi/ifoV3.json'
import kazamaPredictionsAbi from 'config/abi/kazamaPredictions.json'
import bKazamaFarmBoosterAbi from 'config/abi/bKazamaFarmBooster.json'
import bKazamaFarmBoosterProxyFactoryAbi from 'config/abi/bKazamaFarmBoosterProxyFactory.json'
import bKazamaProxyAbi from 'config/abi/bKazamaProxy.json'

// Types
import type {
  ChainlinkOracle,
  FarmAuction,
  Predictions,
  AnniversaryAchievement,
  IfoV1,
  IfoV2,
  Erc20,
  Erc721,
  Kazama,
  SenshiFactory,
  KazamaSenshis,
  KazamaProfile,
  LotteryV2,
  Senshimaster,
  SenshimasterV1,
  SousChef,
  SousChefV2,
  SenshiSpecial,
  LpToken,
  ClaimRefund,
  ClaimGame,
  TradingCompetitionEaster,
  TradingCompetitionFanToken,
  EasterNft,
  Multicall,
  SenshiSpecialKazamaVault,
  SenshiSpecialPrediction,
  SenshiSpecialLottery,
  NftMarket,
  NftSale,
  KazamaSquad,
  Erc721collection,
  PointCenterIfo,
  KazamaVaultV2,
  KazamaFlexibleSideVaultV2,
  TradingCompetitionMobox,
  IKazama,
  TradingCompetitionMoD,
  PotteryVaultAbi,
  PotteryDrawAbi,
  Zap,
  PredictionsV1,
  BKazamaFarmBooster,
  BKazamaFarmBoosterProxyFactory,
  BKazamaProxy,
} from 'config/abi/types'
import { ChainId } from '@kazamaswap/sdk'
import { DISTRIBUTOR, CLAIM_GAME } from 'config/constants'

export const getContract = ({
  abi,
  address,
  chainId = ChainId.BSC_TESTNET,
  signer,
}: {
  abi: any
  address: string
  chainId?: ChainId
  signer?: Signer | Provider
}) => {
  const signerOrProvider = signer ?? provider({ chainId })
  return new Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: bep20Abi, address, signer }) as Erc20
}
export const getErc721Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: erc721Abi, address, signer }) as Erc721
}
export const getLpContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: lpTokenAbi, address, signer }) as LpToken
}
export const getIfoV1Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV1Abi, address, signer }) as IfoV1
}
export const getIfoV2Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV2Abi, address, signer }) as IfoV2
}
export const getIfoV3Contract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: ifoV3Abi, address, signer })
}
export const getSouschefContract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract({ abi, address: getAddress(config.contractAddress), signer }) as SousChef
}
export const getSouschefV2Contract = (id: number, signer?: Signer | Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract({ abi: sousChefV2, address: getAddress(config.contractAddress), signer }) as SousChefV2
}

export const getPointCenterIfoContract = (signer?: Signer | Provider) => {
  return getContract({ abi: pointCenterIfo, address: getPointCenterIfoAddress(), signer }) as PointCenterIfo
}

export const getBusdDistributorContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: distributorAbi, address: DISTRIBUTOR, signer })
}

export const getClaimGameContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: claimGameAbi, address: CLAIM_GAME, signer })
}

export const getKazamaContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({
    abi: kazamaAbi,
    address: chainId ? KAZAMA[chainId].address : KAZAMA[ChainId.BSC_TESTNET].address,
    signer,
  }) as Kazama
}
export const getProfileContract = (signer?: Signer | Provider) => {
  return getContract({ abi: profileABI, address: getKazamaProfileAddress(), signer }) as KazamaProfile
}
export const getKazamaSenshisContract = (signer?: Signer | Provider) => {
  return getContract({ abi: kazamaSenshisAbi, address: getKazamaSenshisAddress(), signer }) as KazamaSenshis
}
export const getSenshiFactoryContract = (signer?: Signer | Provider) => {
  return getContract({ abi: senshiFactoryAbi, address: getSenshiFactoryAddress(), signer }) as SenshiFactory
}
export const getSenshiSpecialContract = (signer?: Signer | Provider) => {
  return getContract({ abi: senshiSpecialAbi, address: getSenshiSpecialAddress(), signer }) as SenshiSpecial
}
export const getLotteryV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: lotteryV2Abi, address: getLotteryV2Address(), signer }) as LotteryV2
}
export const getSenshimasterContract = (signer?: Signer | Provider, chainId?: number) => {
  return getContract({ abi: senshiMaster, address: getSenshiMasterAddress(chainId), signer }) as Senshimaster
}
export const getSenshimasterV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: senshiMasterV1, address: getSenshiMasterV1Address(), signer }) as SenshimasterV1
}
export const getClaimRefundContract = (signer?: Signer | Provider) => {
  return getContract({ abi: claimRefundAbi, address: getClaimRefundAddress(), signer }) as ClaimRefund
}
export const getTradingCompetitionContractEaster = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionEasterAbi,
    address: getTradingCompetitionAddressEaster(),
    signer,
  }) as TradingCompetitionEaster
}

export const getTradingCompetitionContractFanToken = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionFanTokenAbi,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  }) as TradingCompetitionFanToken
}
export const getTradingCompetitionContractMobox = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionMoboxAbi,
    address: getTradingCompetitionAddressMobox(),
    signer,
  }) as TradingCompetitionMobox
}

export const getTradingCompetitionContractMoD = (signer?: Signer | Provider) => {
  return getContract({
    abi: tradingCompetitionMoDAbi,
    address: getTradingCompetitionAddressMoD(),
    signer,
  }) as TradingCompetitionMoD
}

export const getEasterNftContract = (signer?: Signer | Provider) => {
  return getContract({ abi: easterNftAbi, address: getEasterNftAddress(), signer }) as EasterNft
}
export const getKazamaVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: kazamaVaultV2Abi, address: getKazamaVaultAddress(), signer }) as KazamaVaultV2
}

export const getKazamaFlexibleSideVaultV2Contract = (signer?: Signer | Provider) => {
  return getContract({
    abi: kazamaFlexibleSideVaultV2Abi,
    address: getKazamaFlexibleSideVaultAddress(),
    signer,
  }) as KazamaFlexibleSideVaultV2
}

export const getPredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: predictionsAbi, address, signer }) as Predictions
}

export const getPredictionsV1Contract = (signer?: Signer | Provider) => {
  return getContract({ abi: predictionsV1Abi, address: getPredictionsV1Address(), signer }) as PredictionsV1
}

export const getKazamaPredictionsContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: kazamaPredictionsAbi, address, signer }) as Predictions
}

export const getChainlinkOracleContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: chainlinkOracleAbi, address, signer }) as ChainlinkOracle
}
export const getMulticallContract = (chainId: ChainId) => {
  return getContract({ abi: MultiCallAbi, address: getMulticallAddress(chainId), chainId }) as Multicall
}
export const getSenshiSpecialKazamaVaultContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: senshiSpecialKazamaVaultAbi,
    address: getSenshiSpecialKazamaVaultAddress(),
    signer,
  }) as SenshiSpecialKazamaVault
}
export const getSenshiSpecialPredictionContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: senshiSpecialPredictionAbi,
    address: getSenshiSpecialPredictionAddress(),
    signer,
  }) as SenshiSpecialPrediction
}
export const getSenshiSpecialLotteryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: senshiSpecialLotteryAbi,
    address: getSenshiSpecialLotteryAddress(),
    signer,
  }) as SenshiSpecialLottery
}
export const getSenshiSpecialXmasContract = (signer?: Signer | Provider) => {
  return getContract({ abi: senshiSpecialXmasAbi, address: getSenshiSpecialXmasAddress(), signer })
}
export const getFarmAuctionContract = (signer?: Signer | Provider) => {
  return getContract({ abi: farmAuctionAbi, address: getFarmAuctionAddress(), signer }) as unknown as FarmAuction
}
export const getAnniversaryAchievementContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: anniversaryAchievementAbi,
    address: getAnniversaryAchievement(),
    signer,
  }) as AnniversaryAchievement
}

export const getNftMarketContract = (signer?: Signer | Provider) => {
  return getContract({ abi: nftMarketAbi, address: getNftMarketAddress(), signer }) as NftMarket
}
export const getNftSaleContract = (signer?: Signer | Provider) => {
  return getContract({ abi: nftSaleAbi, address: getNftSaleAddress(), signer }) as NftSale
}
export const getKazamaSquadContract = (signer?: Signer | Provider) => {
  return getContract({ abi: kazamaSquadAbi, address: getKazamaSquadAddress(), signer }) as KazamaSquad
}
export const getErc721CollectionContract = (signer?: Signer | Provider, address?: string) => {
  return getContract({ abi: erc721CollectionAbi, address, signer }) as Erc721collection
}

export const getPotteryVaultContract = (address: string, signer?: Signer | Provider) => {
  return getContract({ abi: potteryVaultAbi, address, signer }) as PotteryVaultAbi
}

export const getPotteryDrawContract = (signer?: Signer | Provider) => {
  return getContract({ abi: potteryDrawAbi, address: getPotteryDrawAddress(), signer }) as PotteryDrawAbi
}

export const getZapContract = (signer?: Signer | Provider) => {
  return getContract({ abi: zapAbi, address: getZapAddress(), signer }) as Zap
}

export const getIfoCreditAddressContract = (signer?: Signer | Provider) => {
  return getContract({ abi: iKazamaAbi, address: getIKazamaAddress(), signer }) as IKazama
}

export const getBKazamaFarmBoosterContract = (signer?: Signer | Provider) => {
  return getContract({ abi: bKazamaFarmBoosterAbi, address: getBKazamaFarmBoosterAddress(), signer }) as BKazamaFarmBooster
}

export const getBKazamaFarmBoosterProxyFactoryContract = (signer?: Signer | Provider) => {
  return getContract({
    abi: bKazamaFarmBoosterProxyFactoryAbi,
    address: getBKazamaFarmBoosterProxyFactoryAddress(),
    signer,
  }) as BKazamaFarmBoosterProxyFactory
}

export const getBKazamaProxyContract = (proxyContractAddress: string, signer?: Signer | Provider) => {
  return getContract({ abi: bKazamaProxyAbi, address: proxyContractAddress, signer }) as BKazamaProxy
}
