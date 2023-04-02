import { useBNBBusdPrice } from 'hooks/useBUSDPrice';
import styled from 'styled-components';

import { useTranslation } from '@kazamaswap/localization';
import { Box, Button, CardBody, Flex, Text } from '@kazamaswap/uikit';

import { kazamaSenshisAddress } from '../../constants';
import { useGetLowestPriceFromNft } from '../../hooks/useGetLowestPrice';
import NFTMedia from '../NFTMedia';
import LocationTag from './LocationTag';
import PreviewImage from './PreviewImage';
import { CostLabel, LowestPriceMetaRow, MetaRow } from './styles';
import { CollectibleCardProps } from './types';

const BuyNftButton = styled(Button)`
box-shadow: rgb(255 176 25 / 40%) 0px 0px 10px, rgb(255 255 255 / 20%) 0px 1px 0px inset, rgb(0 0 0 / 15%) 0px -3px 0px inset, rgb(255 135 25) 0px 0px 12px inset;
height: 40px;
border-radius: 7px;
`

const CollectibleCardBody: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
}) => {
  const { t } = useTranslation()
  const { name } = nft
  const bnbBusdPrice = useBNBBusdPrice()
  const isKazamaSenshi = nft.collectionAddress?.toLowerCase() === kazamaSenshisAddress.toLowerCase()
  const { isFetching, lowestPrice } = useGetLowestPriceFromNft(nft)

  return (
    <CardBody p="8px">
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.collectionName && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.collectionName}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <Text as="h4" fontWeight="600" mb="8px">
        {name}
      </Text>
      <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
        {isKazamaSenshi && (
          <LowestPriceMetaRow lowestPrice={lowestPrice} isFetching={isFetching} bnbBusdPrice={bnbBusdPrice} />
        )}
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
          </MetaRow>
        )}
                    {/* <BuyNftButton width="100%" variant="warning" mb="5px">
                    <CostLabel cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
                    </BuyNftButton> */}
      </Box>
    </CardBody>
  )
}

export default CollectibleCardBody
