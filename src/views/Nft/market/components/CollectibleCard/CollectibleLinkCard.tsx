import styled from 'styled-components'
import { Text } from '@kazamaswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'
import { nftsBaseUrl, kazamaSenshisAddress } from '../../constants'

const NftTitle = styled(Text)`
color: #FFFFFF;
font-weight: 400;
font-size: 14px;
padding: 10px;
`

const CollectibleLinkCard: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  ...props
}) => {
  const urlId =
    nft.collectionAddress.toLowerCase() === kazamaSenshisAddress.toLowerCase() ? nft.attributes[0].value : nft.tokenId
  return (
    <StyledCollectibleCard {...props}>
      <NftTitle>Senshi NFT</NftTitle>
      <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${urlId}`}>
        <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      </NextLinkFromReactRouter>
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
