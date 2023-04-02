import senshimasterABI from 'config/abi/senshimaster.json'
import chunk from 'lodash/chunk'
import BigNumber from 'bignumber.js'
import { multicallv2 } from 'utils/multicall'
import { getBscChainId } from 'state/farms/getBscChainId'
import { BIG_ZERO } from 'utils/bigNumber'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { SerializedFarmConfig } from '../../config/constants/types'
import { SerializedFarm } from '../types'
import { getSenshiMasterAddress } from '../../utils/addressHelpers'

export const fetchSenshiMasterFarmPoolLength = async (chainId: number) => {
  try {
    const [poolLength] = await multicallv2({
      abi: senshimasterABI,
      calls: [
        {
          name: 'poolLength',
          address: getSenshiMasterAddress(chainId),
        },
      ],
      chainId,
    })

    return new BigNumber(poolLength).toNumber()
  } catch (error) {
    console.error('Fetch SenshiMaster Farm Pool Length Error: ', error)
    return BIG_ZERO.toNumber()
  }
}

const senshiMasterFarmCalls = async (farm: SerializedFarm) => {
  const { pid, bscPid, quoteToken } = farm
  const isBscNetwork = verifyBscNetwork(quoteToken.chainId)
  const multiCallChainId = isBscNetwork ? quoteToken.chainId : await getBscChainId(quoteToken.chainId)
  const senshiMasterAddress = getSenshiMasterAddress(multiCallChainId)
  const senshiMasterPid = isBscNetwork ? pid : bscPid

  return senshiMasterPid || senshiMasterPid === 0
    ? [
        {
          address: senshiMasterAddress,
          name: 'poolInfo',
          params: [senshiMasterPid],
        },
        {
          address: senshiMasterAddress,
          name: 'totalRegularAllocPoint',
        },
      ]
    : [null, null]
}

export const fetchSenshiMasterData = async (farms: SerializedFarmConfig[], chainId: number): Promise<any[]> => {
  const senshiMasterCalls = await Promise.all(farms.map((farm) => senshiMasterFarmCalls(farm)))
  const chunkSize = senshiMasterCalls.flat().length / farms.length
  const senshiMasterAggregatedCalls = senshiMasterCalls
    .filter((senshiMasterCall) => senshiMasterCall[0] !== null && senshiMasterCall[1] !== null)
    .flat()

  const isBscNetwork = verifyBscNetwork(chainId)
  const multiCallChainId = isBscNetwork ? chainId : await getBscChainId(chainId)
  const senshiMasterMultiCallResult = await multicallv2({
    abi: senshimasterABI,
    calls: senshiMasterAggregatedCalls,
    chainId: multiCallChainId,
  })
  const senshiMasterChunkedResultRaw = chunk(senshiMasterMultiCallResult, chunkSize)

  let senshiMasterChunkedResultCounter = 0
  return senshiMasterCalls.map((senshiMasterCall) => {
    if (senshiMasterCall[0] === null && senshiMasterCall[1] === null) {
      return [null, null]
    }
    const data = senshiMasterChunkedResultRaw[senshiMasterChunkedResultCounter]
    senshiMasterChunkedResultCounter++
    return data
  })
}
