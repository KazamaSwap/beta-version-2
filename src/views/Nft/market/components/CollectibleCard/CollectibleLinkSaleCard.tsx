import { NextLinkFromReactRouter } from 'components/NextLink';
import { useBNBBusdPrice } from 'hooks/useBUSDPrice';
import styled from 'styled-components';

import { Text } from '@kazamaswap/uikit';

import { kazamaSenshisAddress, nftsBaseUrl } from '../../constants';
import CardBodySale from './CardBodySale';
import { StyledCollectibleCard } from './CostlabelBUSD';
import { CollectibleCardProps } from './types';

const NftTitleBox = styled.div`
display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
`

const CollectionTitleBox = styled.div`
display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
`

const NftTitle = styled(Text)`
color: #FFFFFF;
font-weight: 400;
font-size: 14px;
padding-top: 16px;
padding-left: 16px;
`

const CollectibleLinkCard: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  ...props
}) => {
  let Color;
  const { name } = nft
  const bnbBusdPrice = useBNBBusdPrice()
  const urlId = nft.collectionAddress.toLowerCase() === kazamaSenshisAddress.toLowerCase() ? nft.attributes[0].value : nft.tokenId
  if (name === "Ignis Senshi") {
    Color = "rgb(247,148,24)"
  }
  return (
    <StyledCollectibleCard {...props}>
      <NftTitleBox>
      <Text as="h4" fontWeight="600" pl="16px" pt="16px" color={Color}>
        {name}
      </Text>
      </NftTitleBox>
      <CollectionTitleBox>
      {nft?.collectionName && (
  <Text fontSize="12px" color="#c4bdd2" pl="16px">
    {nft?.collectionName}
  </Text>
)}
      </CollectionTitleBox>
      {/* <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${urlId}`}> */}
        <CardBodySale nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      {/* </NextLinkFromReactRouter> */}
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
