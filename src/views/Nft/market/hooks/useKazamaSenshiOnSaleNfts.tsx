import { useEffect, useState, useRef } from 'react'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getKazamaSenshisAttributesField,
  combineApiAndSgResponseToNftToken,
  getNftsUpdatedMarketData,
} from 'state/nftMarket/helpers'
import useSWRInfinite from 'swr/infinite'
import { FetchStatus } from 'config/constants/types'
import { formatBigNumber } from 'utils/formatBalance'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { kazamaSenshisAddress } from '../constants'

const fetchMarketDataNfts = async (
  senshiId: string,
  nftMetadata: ApiResponseCollectionTokens,
  direction: 'asc' | 'desc',
  page: number,
  itemsPerPage: number,
): Promise<{ newNfts: NftToken[]; isPageLast: boolean }> => {
  const whereClause = {
    collection: kazamaSenshisAddress.toLowerCase(),
    otherId: senshiId,
    isTradable: true,
  }
  const nftsMarket = await getNftsMarketData(
    whereClause,
    itemsPerPage,
    'currentAskPrice',
    direction,
    page * itemsPerPage,
  )

  const moreTokensWithRequestedSenshiId = nftsMarket.map((marketData) => {
    const apiMetadata = getMetadataWithFallback(nftMetadata.data, marketData.otherId)
    const attributes = getKazamaSenshisAttributesField(marketData.otherId)
    return combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
  })
  return { newNfts: moreTokensWithRequestedSenshiId, isPageLast: moreTokensWithRequestedSenshiId.length < itemsPerPage }
}

export const useKazamaSenshiOnSaleNfts = (
  senshiId: string,
  nftMetadata: ApiResponseCollectionTokens,
  itemsPerPage: number,
) => {
  const isLastPage = useRef(false)
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc' as const)

  useEffect(() => {
    isLastPage.current = false
  }, [direction])

  const {
    data: nfts,
    status,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (!nftMetadata) return null
      if (pageIndex !== 0 && previousPageData && !previousPageData.length) return null
      return [senshiId, direction, pageIndex, 'kazamaSenshiOnSaleNfts']
    },
    async (id, sortDirection, page) => {
      const { newNfts, isPageLast } = await fetchMarketDataNfts(id, nftMetadata, sortDirection, page, itemsPerPage)
      isLastPage.current = isPageLast
      const nftsMarketTokenIds = newNfts.map((marketData) => marketData.tokenId)
      const updatedMarketData = await getNftsUpdatedMarketData(kazamaSenshisAddress.toLowerCase(), nftsMarketTokenIds)
      if (!updatedMarketData) return newNfts

      return updatedMarketData
        .sort((askInfoA, askInfoB) => {
          return askInfoA.currentAskPrice.gt(askInfoB.currentAskPrice)
            ? 1 * (sortDirection === 'desc' ? -1 : 1)
            : askInfoA.currentAskPrice.eq(askInfoB.currentAskPrice)
            ? 0
            : -1 * (sortDirection === 'desc' ? -1 : 1)
        })
        .map(({ tokenId, currentSeller, currentAskPrice }) => {
          const nftData = newNfts.find((marketData) => marketData.tokenId === tokenId)
          const isTradable = currentSeller.toLowerCase() !== NOT_ON_SALE_SELLER
          return {
            ...nftData,
            marketData: {
              ...nftData.marketData,
              isTradable,
              currentSeller: isTradable ? currentSeller.toLowerCase() : nftData.marketData.currentSeller,
              currentAskPrice: isTradable ? formatBigNumber(currentAskPrice) : nftData.marketData.currentAskPrice,
            },
          }
        })
    },
    {
      refreshInterval: 10000,
      revalidateAll: true,
    },
  )

  return {
    nfts,
    refresh: mutate,
    isFetchingNfts: status !== FetchStatus.Fetched,
    page: size,
    setPage: setSize,
    direction,
    setDirection,
    isLastPage: isLastPage.current,
    isValidating,
  }
}