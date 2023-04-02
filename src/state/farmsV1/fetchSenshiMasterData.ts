import senshimasterABIV1 from 'config/abi/senshimasterV1.json'
import chunk from 'lodash/chunk'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarmConfig } from '../../config/constants/types'
import { SerializedFarm } from '../types'
import { getSenshiMasterV1Address } from '../../utils/addressHelpers'
import { getSenshimasterV1Contract } from '../../utils/contractHelpers'

const senshiMasterAddress = getSenshiMasterV1Address()
const senshiMasterContract = getSenshimasterV1Contract()

export const fetchSenshiMasterFarmPoolLength = async () => {
  const poolLength = await senshiMasterContract.poolLength()
  return poolLength
}

const senshiMasterFarmCalls = (farm: SerializedFarm) => {
  const { v1pid } = farm
  return v1pid || v1pid === 0
    ? [
        {
          address: senshiMasterAddress,
          name: 'poolInfo',
          params: [v1pid],
        },
        {
          address: senshiMasterAddress,
          name: 'totalAllocPoint',
        },
      ]
    : [null, null]
}

export const fetchSenshiMasterData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const senshiMasterCalls = farms.map((farm) => senshiMasterFarmCalls(farm))
  const chunkSize = senshiMasterCalls.flat().length / farms.length
  const senshiMasterAggregatedCalls = senshiMasterCalls
    .filter((senshiMasterCall) => senshiMasterCall[0] !== null && senshiMasterCall[1] !== null)
    .flat()
  const senshiMasterMultiCallResult = await multicallv2({ abi: senshimasterABIV1, calls: senshiMasterAggregatedCalls })
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
