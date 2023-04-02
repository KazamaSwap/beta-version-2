import { useBNBBusdPrice } from 'hooks/useBUSDPrice';
import styled from 'styled-components';

import { useTranslation } from '@kazamaswap/localization';
import { Box, Button, CardBody, Flex, Text, useModal } from '@kazamaswap/uikit';

import { kazamaSenshisAddress } from '../../constants';
import { useGetLowestPriceFromNft } from '../../hooks/useGetLowestPrice';
import BuyModal from '../BuySellModals/BuyModal';
import NFTMedia from '../NFTMedia';
import { CostLabelBNB, CostLabelBUSD, LowestPriceMetaRow, MetaRow } from './CostlabelBUSD';
import LocationTag from './LocationTag';
import PreviewImage from './PreviewImage';
import { CollectibleCardProps } from './types';

const BuyNftButton = styled(Button)`
box-shadow: rgb(255 176 25 / 40%) 0px 0px 10px, rgb(255 255 255 / 20%) 0px 1px 0px inset, rgb(0 0 0 / 15%) 0px -3px 0px inset, rgb(255 135 25) 0px 0px 12px inset;
height: 40px;
border-radius: 7px;
margin-top: 10px;
`

const NftBox = styled(CardBody)`
width: 226px;
`

const CollectibleCardBodySale: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
}) => {
  const { t } = useTranslation()
  const { name } = nft
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const bnbBusdPrice = useBNBBusdPrice()
  const isKazamaSenshi = nft.collectionAddress?.toLowerCase() === kazamaSenshisAddress.toLowerCase()
  const { isFetching, lowestPrice } = useGetLowestPriceFromNft(nft)

  return (
    <NftBox p="16px">
      <NFTMedia as={PreviewImage} nft={nft} height={225} width={225} mb="8px" borderRadius="8px" />
      {/* <Flex alignItems="center" justifyContent="space-between">
        {nft?.collectionName && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.collectionName}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <Text as="h4" fontWeight="600" mb="8px">
        {name}
      </Text> */}
      <Box pt="6px">
        {isKazamaSenshi && (
          <LowestPriceMetaRow lowestPrice={lowestPrice} isFetching={isFetching} bnbBusdPrice={bnbBusdPrice} />
        )}
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your Price') : t('Asking Price')}>
            <CostLabelBUSD cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
          </MetaRow>
        )}
                     <BuyNftButton onClick={onPresentBuyModal} width="100%" variant="warning" mb="5px">
                    <CostLabelBNB cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
                    </BuyNftButton>
      </Box>
    </NftBox>
  )
}

export default CollectibleCardBodySale
