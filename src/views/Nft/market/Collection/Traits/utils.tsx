import { ApiResponseCollectionTokens } from 'state/nftMarket/types'

type sortBuilder = {
  data: ApiResponseCollectionTokens
  raritySort: string
}

export const sortSenshisByRarityBuilder =
  ({ raritySort, data }: sortBuilder) =>
  (senshiIdA, senshiIdB) => {
    const senshiCountA = data.attributesDistribution[senshiIdA] ?? 0
    const senshiCountB = data.attributesDistribution[senshiIdB] ?? 0

    return raritySort === 'asc' ? senshiCountA - senshiCountB : senshiCountB - senshiCountA
  }
