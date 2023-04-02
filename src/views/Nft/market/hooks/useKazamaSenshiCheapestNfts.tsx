import { useWeb3React } from '@kazamaswap/wagmi'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import useSWR from 'swr'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getKazamaSenshisAttributesField,
  combineApiAndSgResponseToNftToken,
} from 'state/nftMarket/helpers'
import { FAST_INTERVAL } from 'config/constants'
import { FetchStatus } from 'config/constants/types'
import { formatBigNumber } from 'utils/formatBalance'
import { kazamaSenshisAddress } from '../constants'
import { getLowestUpdatedToken } from './useGetLowestPrice'

type WhereClause = Record<string, string | number | boolean | string[]>

const fetchCheapestSenshi = async (
  whereClause: WhereClause = {},
  nftMetadata: ApiResponseCollectionTokens,
): Promise<NftToken> => {
  const nftsMarket = await getNftsMarketData(whereClause, 100, 'currentAskPrice', 'asc')

  if (!nftsMarket.length) return null

  const nftsMarketTokenIds = nftsMarket.map((marketData) => marketData.tokenId)
  const lowestPriceUpdatedSenshi = await getLowestUpdatedToken(kazamaSenshisAddress.toLowerCase(), nftsMarketTokenIds)

  const cheapestSenshiOfAccount = nftsMarket
    .filter((marketData) => marketData.tokenId === lowestPriceUpdatedSenshi?.tokenId)
    .map((marketData) => {
      const apiMetadata = getMetadataWithFallback(nftMetadata.data, marketData.otherId)
      const attributes = getKazamaSenshisAttributesField(marketData.otherId)
      const senshiToken = combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
      const updatedPrice = formatBigNumber(lowestPriceUpdatedSenshi.currentAskPrice)
      return {
        ...senshiToken,
        marketData: { ...senshiToken.marketData, ...lowestPriceUpdatedSenshi, currentAskPrice: updatedPrice },
      }
    })
  return cheapestSenshiOfAccount.length > 0 ? cheapestSenshiOfAccount[0] : null
}

export const useKazamaSenshiCheapestNft = (senshiId: string, nftMetadata: ApiResponseCollectionTokens) => {
  const { account } = useWeb3React()
  const { data, status, mutate } = useSWR(
    nftMetadata && senshiId ? ['cheapestSenshi', senshiId, account] : null,
    async () => {
      const allCheapestSenshiClause = {
        collection: kazamaSenshisAddress.toLowerCase(),
        otherId: senshiId,
        isTradable: true,
      }
      if (!account) {
        return fetchCheapestSenshi(allCheapestSenshiClause, nftMetadata)
      }

      const cheapestSenshiOtherSellersClause = {
        collection: kazamaSenshisAddress.toLowerCase(),
        currentSeller_not: account.toLowerCase(),
        otherId: senshiId,
        isTradable: true,
      }
      const cheapestSenshiOtherSellers = await fetchCheapestSenshi(cheapestSenshiOtherSellersClause, nftMetadata)
      return cheapestSenshiOtherSellers ?? fetchCheapestSenshi(allCheapestSenshiClause, nftMetadata)
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return {
    data,
    isFetched: [FetchStatus.Failed, FetchStatus.Fetched].includes(status),
    refresh: mutate,
  }
}
