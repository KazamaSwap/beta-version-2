import { useState, useEffect } from 'react'
import { Flex } from '@kazamaswap/uikit'
import Page from 'components/Layout/Page'
import { useGetCollection } from 'state/nftMarket/hooks'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import PageLoader from 'components/Loader/PageLoader'
import { useGetCollectionDistributionPB } from 'views/Nft/market/hooks/useGetCollectionDistribution'
import MainKazamaSenshiCard from './MainKazamaSenshiCard'
import PropertiesCard from '../shared/PropertiesCard'
import DetailsCard from '../shared/DetailsCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
import ForSaleTableCard from './ForSaleTableCard'
import { kazamaSenshisAddress } from '../../../constants'
import { TwoColumnsContainer } from '../shared/styles'
import { useKazamaSenshiCheapestNft } from '../../../hooks/useKazamaSenshiCheapestNfts'
import ManageNftsCard from '../shared/ManageNFTsCard'

interface IndividualKazamaSenshiPageProps {
  senshiId: string
}

const IndividualKazamaSenshiPage = (props: IndividualKazamaSenshiPageProps) => {
  const collection = useGetCollection(kazamaSenshisAddress)

  if (!collection) {
    return <PageLoader />
  }

  return <IndividualKazamaSenshiPageBase {...props} />
}

const IndividualKazamaSenshiPageBase: React.FC<React.PropsWithChildren<IndividualKazamaSenshiPageProps>> = ({
  senshiId,
}) => {
  const collection = useGetCollection(kazamaSenshisAddress)
  const totalSenshiCount = Number(collection?.totalSupply)
  const [nothingForSaleSenshi, setNothingForSaleSenshi] = useState<NftToken>(null)
  const [nftMetadata, setNftMetadata] = useState<ApiResponseCollectionTokens>(null)
  const {
    data: cheapestSenshi,
    isFetched: isFetchedCheapestSenshi,
    refresh: refreshCheapestNft,
  } = useKazamaSenshiCheapestNft(senshiId, nftMetadata)

  const { data: distributionData, isFetching: isFetchingDistribution } = useGetCollectionDistributionPB()

  useEffect(() => {
    const fetchNftMetadata = async () => {
      const metadata = await getNftsFromCollectionApi(kazamaSenshisAddress)
      setNftMetadata(metadata)
    }

    if (!nftMetadata) {
      fetchNftMetadata()
    }
  }, [nftMetadata])

  useEffect(() => {
    const fetchBasicSenshiData = async () => {
      setNothingForSaleSenshi({
        // In this case tokenId doesn't matter, this token can't be bought
        tokenId: nftMetadata.data[senshiId].name,
        name: nftMetadata.data[senshiId].name,
        description: nftMetadata.data[senshiId].description,
        collectionName: nftMetadata.data[senshiId].collection.name,
        collectionAddress: kazamaSenshisAddress,
        image: nftMetadata.data[senshiId].image,
        attributes: [
          {
            traitType: 'senshiId',
            value: senshiId,
            displayType: null,
          },
        ],
      })
    }

    // If senshi id has no listings on the market - get basic senshi info
    if (isFetchedCheapestSenshi && !cheapestSenshi && nftMetadata && nftMetadata.data) {
      fetchBasicSenshiData()
    }
  }, [cheapestSenshi, isFetchedCheapestSenshi, nftMetadata, senshiId])

  if (!cheapestSenshi && !nothingForSaleSenshi) {
    // TODO redirect to nft market page if collection or senshi id does not exist (came here from some bad url)
    // That would require tracking loading states and stuff...

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }

  const getSenshiIdCount = () => {
    if (distributionData && !isFetchingDistribution) {
      return distributionData[senshiId].tokenCount
    }
    return null
  }

  const getSenshiIdRarity = () => {
    if (distributionData && !isFetchingDistribution) {
      return (distributionData[senshiId].tokenCount / totalSenshiCount) * 100
    }
    return null
  }

  const properties = cheapestSenshi?.attributes || nothingForSaleSenshi?.attributes

  const propertyRarity = { senshiId: getSenshiIdRarity() }

  return (
    <Page>
      <MainKazamaSenshiCard
        cheapestNft={cheapestSenshi}
        nothingForSaleSenshi={nothingForSaleSenshi}
        onSuccessSale={refreshCheapestNft}
      />
      <TwoColumnsContainer flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <ManageNftsCard
            collection={collection}
            tokenId={senshiId}
            lowestPrice={cheapestSenshi?.marketData?.currentAskPrice}
          />
          <PropertiesCard properties={properties} rarity={propertyRarity} />
          <DetailsCard
            contractAddress={kazamaSenshisAddress}
            ipfsJson={cheapestSenshi?.marketData?.metadataUrl}
            rarity={propertyRarity?.senshiId}
            count={getSenshiIdCount()}
          />
        </Flex>
        <ForSaleTableCard senshiId={senshiId} nftMetadata={nftMetadata} onSuccessSale={refreshCheapestNft} />
      </TwoColumnsContainer>
      <MoreFromThisCollection
        collectionAddress={kazamaSenshisAddress}
        currentTokenName={cheapestSenshi?.name || nothingForSaleSenshi?.name}
      />
    </Page>
  )
}

export default IndividualKazamaSenshiPage
