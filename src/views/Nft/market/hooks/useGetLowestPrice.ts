import { FetchStatus } from 'config/constants/types'
import { getNftsMarketData, getNftsUpdatedMarketData } from 'state/nftMarket/helpers'
import { formatBigNumber } from 'utils/formatBalance'
import { NftToken } from 'state/nftMarket/types'
import useSWR from 'swr'
import { kazamaSenshisAddress } from '../constants'

export interface LowestNftPrice {
  isFetching: boolean
  lowestPrice: number
}

const getSenshiIdFromNft = (nft: NftToken): string => {
  const senshiId = nft.attributes?.find((attr) => attr.traitType === 'senshiId')?.value
  return senshiId ? senshiId.toString() : null
}

export const getLowestUpdatedToken = async (collectionAddress: string, nftsMarketTokenIds: string[]) => {
  const updatedMarketData = await getNftsUpdatedMarketData(collectionAddress.toLowerCase(), nftsMarketTokenIds)

  if (!updatedMarketData) return null

  return updatedMarketData
    .filter((tokenUpdatedPrice) => {
      return tokenUpdatedPrice && tokenUpdatedPrice.currentAskPrice.gt(0) && tokenUpdatedPrice.isTradable
    })
    .sort((askInfoA, askInfoB) => {
      return askInfoA.currentAskPrice.gt(askInfoB.currentAskPrice)
        ? 1
        : askInfoA.currentAskPrice.eq(askInfoB.currentAskPrice)
        ? 0
        : -1
    })[0]
}

export const useGetLowestPriceFromSenshiId = (senshiId?: string): LowestNftPrice => {
  const { data, status } = useSWR(senshiId ? ['senshiLowestPrice', senshiId] : null, async () => {
    const response = await getNftsMarketData({ otherId: senshiId, isTradable: true }, 100, 'currentAskPrice', 'asc')

    if (!response.length) return null

    const nftsMarketTokenIds = response.map((marketData) => marketData.tokenId)
    const lowestPriceUpdatedSenshi = await getLowestUpdatedToken(kazamaSenshisAddress.toLowerCase(), nftsMarketTokenIds)

    if (lowestPriceUpdatedSenshi) {
      return parseFloat(formatBigNumber(lowestPriceUpdatedSenshi.currentAskPrice))
    }
    return null
  })

  return { isFetching: status !== FetchStatus.Fetched, lowestPrice: data }
}

export const useGetLowestPriceFromNft = (nft: NftToken): LowestNftPrice => {
  const isKazamaSenshi = nft.collectionAddress?.toLowerCase() === kazamaSenshisAddress.toLowerCase()

  const senshiIdAttr = isKazamaSenshi && getSenshiIdFromNft(nft)

  return useGetLowestPriceFromSenshiId(senshiIdAttr)
}
