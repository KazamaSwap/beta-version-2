import { Activity, NftToken, TokenIdWithCollectionAddress } from 'state/nftMarket/types'
import { getNftsFromCollectionApi, getNftsFromDifferentCollectionsApi } from 'state/nftMarket/helpers'
import uniqBy from 'lodash/uniqBy'
import { kazamaSenshisAddress } from '../../constants'

export const fetchActivityNftMetadata = async (activities: Activity[]): Promise<NftToken[]> => {
  const hasKSCollections = activities.some(
    (activity) => activity.nft.collection.id.toLowerCase() === kazamaSenshisAddress.toLowerCase(),
  )

  const activityNftTokenIds = uniqBy(
    activities
      .filter((activity) => activity.nft.collection.id.toLowerCase() !== kazamaSenshisAddress.toLowerCase())
      .map((activity): TokenIdWithCollectionAddress => {
        return { tokenId: activity.nft.tokenId, collectionAddress: activity.nft.collection.id }
      }),
    (tokenWithCollectionAddress) =>
      `${tokenWithCollectionAddress.tokenId}#${tokenWithCollectionAddress.collectionAddress}`,
  )

  const [senshisMetadata, nfts] = await Promise.all([
    hasKSCollections ? getNftsFromCollectionApi(kazamaSenshisAddress) : Promise.resolve(null),
    getNftsFromDifferentCollectionsApi(activityNftTokenIds),
  ])

  const pbNfts = senshisMetadata
    ? activities
        .filter((activity) => activity.nft.collection.id.toLowerCase() === kazamaSenshisAddress.toLowerCase())
        .map((activity) => {
          const { name: collectionName } = senshisMetadata.data[activity.nft.otherId].collection
          return {
            ...senshisMetadata.data[activity.nft.otherId],
            tokenId: activity.nft.tokenId,
            attributes: [{ traitType: 'senshiId', value: activity.nft.otherId }],
            collectionAddress: activity.nft.collection.id,
            collectionName,
          }
        })
    : []

  return nfts.concat(pbNfts)
}
