import { useState, useEffect } from 'react'
import {
  getAllKazamaSenshisLowestPrice,
  getAllKazamaSenshisRecentUpdatedAt,
  getNftsFromCollectionApi,
} from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import { kazamaSenshisAddress } from '../constants'

// If collection is KazamaSenshis - gets all available senshis, otherwise - null
const useAllKazamaSenshiNfts = (collectionAddress: string) => {
  const [allKazamaSenshiNfts, setAllKazamaSenshiNfts] = useState<NftToken[]>(null)

  const isKSCollection = collectionAddress === kazamaSenshisAddress

  useEffect(() => {
    const fetchKazamaSenshis = async () => {
      // In order to not define special TS type just for KazamaSenshis display we're hacking a little bit into NftToken type.
      // On this page we just want to display all senshis with their lowest prices and updates on the market
      // Since some senshis might not be on the market at all, we don't refer to the redux nfts state (which stores NftToken with actual token ids)
      // We merely request from API all available senshi ids with their metadata and query subgraph for lowest price and latest updates.
      const response = await getNftsFromCollectionApi(kazamaSenshisAddress)
      if (!response) return
      const { data } = response
      const senshiIds = Object.keys(data)
      const [lowestPrices, latestUpdates] = await Promise.all([
        getAllKazamaSenshisLowestPrice(senshiIds),
        getAllKazamaSenshisRecentUpdatedAt(senshiIds),
      ])
      const allSenshis: NftToken[] = senshiIds.map((senshiId) => {
        return {
          // tokenId here is just a dummy one to satisfy TS. TokenID does not play any role in gird display below
          tokenId: data[senshiId].name,
          name: data[senshiId].name,
          description: data[senshiId].description,
          collectionAddress: kazamaSenshisAddress,
          collectionName: data[senshiId].collection.name,
          image: data[senshiId].image,
          attributes: [
            {
              traitType: 'senshiId',
              value: senshiId,
              displayType: null,
            },
          ],
          meta: {
            currentAskPrice: lowestPrices[senshiId],
            updatedAt: latestUpdates[senshiId],
          },
        }
      })
      setAllKazamaSenshiNfts(allSenshis)
    }
    if (isKSCollection && !allKazamaSenshiNfts) {
      fetchKazamaSenshis()
    }
  }, [isKSCollection, allKazamaSenshiNfts])

  return allKazamaSenshiNfts
}

export default useAllKazamaSenshiNfts
