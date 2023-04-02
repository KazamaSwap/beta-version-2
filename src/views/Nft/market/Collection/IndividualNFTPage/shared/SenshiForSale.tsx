// eslint-disable-next-line import/no-unresolved
import 'swiper/css/bundle';

import Trans from 'components/Trans';
import shuffle from 'lodash/shuffle';
import { ReactNode, useMemo, useState } from 'react';
import { getMarketDataForTokenIds, getNftsFromCollectionApi } from 'state/nftMarket/helpers';
import { NftToken } from 'state/nftMarket/types';
import styled from 'styled-components';
import SwiperCore, { Autoplay } from 'swiper';
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/react';
import useSWRImmutable from 'swr/immutable';
import { isAddress } from 'utils';
import ImgSlideBox from 'views/Home/components/ImgSlideBox';

import {
    ArrowBackIcon, ArrowForwardIcon, Box, Flex, IconButton, Link, ShoppingCartIcon, Text,
    useMatchBreakpoints
} from '@kazamaswap/uikit';

import { CollectibleLinkSaleCard } from '../../../components/CollectibleCard';
import { kazamaSenshisAddress } from '../../../constants';
import useAllKazamaSenshiNfts from '../../../hooks/useAllKazamaSenshiNfts';

const INITIAL_SLIDE = 1

const SwiperCircle = styled.div<{ isActive }>`
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.textDisabled)};
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 50%;
  cursor: pointer;
`

const StyledSwiper = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    .swiper-wrapper {
      max-height: 390px;
    }
  }
`

const Pagination = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 16px;
  margin: 33.5px 0px 3px;
`

const TitleText = styled(Text)`
    color: #F4EEFF;
    font-weight: 600;
    line-height: 1.5;
    font-size: 17px;

`

const ViewCollection = styled(Link)`
    color: rgb(247, 148, 24);
    font-weight: 600;
    line-height: 1.5;
    font-size: 15px;
`

const TitleBox = styled.div`
align-items: center;
background-clip: padding-box;

background-image: linear-gradient(to right, #292334 , #31293d);
border: 1px solid transparent;
border-radius: 15px;
display: flex;
padding: 6px 1rem;
position: relative;
margin-top: 3px;
margin-bottom: 3px;
`

const SeperatorLine = styled.div`
background: #332b40;
flex: 1 0 0;
height: 1px;
margin: 0 0 0 0;
`

interface SenshiForSale {
  collectionAddress: string
  currentTokenName?: string
  title?: ReactNode
}

const SenshiForSale: React.FC<React.PropsWithChildren<SenshiForSale>> = ({
  collectionAddress,
  currentTokenName = '',
  title = <Trans>More from this collection</Trans>,
}) => {
  const [swiperRef, setSwiperRef] = useState<SwiperCore>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const { isMobile, isMd, isLg } = useMatchBreakpoints()
  const allKazamaSenshiNfts = useAllKazamaSenshiNfts(collectionAddress)

  const isKSCollection = isAddress(collectionAddress) === kazamaSenshisAddress
  const checkSummedCollectionAddress = isAddress(collectionAddress) || collectionAddress

  const { data: collectionNfts } = useSWRImmutable<NftToken[]>(
    !isKSCollection && checkSummedCollectionAddress
      ? ['nft', 'moreFromCollection', checkSummedCollectionAddress]
      : null,
    async () => {
      try {
        const nfts = await getNftsFromCollectionApi(collectionAddress, 100, 1)

        if (!nfts?.data) {
          return []
        }

        const tokenIds = Object.values(nfts.data).map((nft) => nft.tokenId)
        const nftsMarket = await getMarketDataForTokenIds(collectionAddress, tokenIds)

        return tokenIds.map((id) => {
          const apiMetadata = nfts.data[id]
          const marketData = nftsMarket.find((nft) => nft.tokenId === id)

          return {
            tokenId: id,
            name: apiMetadata.name,
            description: apiMetadata.description,
            collectionName: apiMetadata.collection.name,
            collectionAddress,
            image: apiMetadata.image,
            attributes: apiMetadata.attributes,
            marketData,
          }
        })
      } catch (error) {
        console.error(`Failed to fetch collection NFTs for ${collectionAddress}`, error)
        return []
      }
    },
  )

  let nftsToShow = useMemo(() => {
    return shuffle(
      allKazamaSenshiNfts
        ? allKazamaSenshiNfts.filter((nft) => nft.name !== currentTokenName)
        : collectionNfts?.filter((nft) => nft.name !== currentTokenName && nft.marketData?.isTradable),
    )
  }, [allKazamaSenshiNfts, collectionNfts, currentTokenName])

  if (!nftsToShow || nftsToShow.length === 0) {
    return null
  }

  let slidesPerView = 5
  let maxPageIndex = 15

  if (isMd) {
    slidesPerView = 5
    maxPageIndex = 15
  }

  if (isLg) {
    slidesPerView = 1
    maxPageIndex = 15
  }

  if (isKSCollection) {
    // KazamaSenshis should display 1 card per senshi id
    nftsToShow = nftsToShow.reduce((nftArray, current) => {
      const senshiId = current.attributes[0].value
      if (!nftArray.find((nft) => nft.attributes[0].value === senshiId)) {
        nftArray.push(current)
      }
      return nftArray
    }, [])
  }
  nftsToShow = nftsToShow.slice(0, 12)

  const nextSlide = () => {
    if (activeIndex < maxPageIndex - 1) {
      setActiveIndex((index) => index + 1)
      swiperRef.slideNext()
    }
  }

  const previousSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((index) => index - 1)
      swiperRef.slidePrev()
    }
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index / slidesPerView)
    swiperRef.slideTo(index)
  }

  const updateActiveIndex = ({ activeIndex: newActiveIndex }) => {
    if (newActiveIndex !== undefined) setActiveIndex(Math.ceil(newActiveIndex / slidesPerView))
  }

  return (
    <Box pt="56px">

        <Pagination>
        <Flex alignItems="center" justifyContent="left" mr="auto">
          <ShoppingCartIcon width="18px" />
         <TitleText>Marketplace</TitleText>
         {/* <Flex ml="10px">
         <ViewCollection href="/nfts/collections/0x7899562ea30623E04cDAAB016D55bfD533505a56">
           View Collection
            </ViewCollection>
         </Flex> */}
        </Flex>
        <SeperatorLine />
        <Flex alignItems="center" justifyContent="right">
            <IconButton variant="primary" onClick={previousSlide} mr="10px">
              <ArrowBackIcon />
            </IconButton>
            <IconButton variant="text" onClick={nextSlide}>
              <ArrowForwardIcon />
            </IconButton>
          </Flex>
          </Pagination>
          
      {isMobile ? (
        <StyledSwiper>
          <Swiper spaceBetween={1} slidesPerView={1}>
            {nftsToShow.map((nft) => (
              <SwiperSlide key={nft.tokenId} className="senshi-swiper">
                <CollectibleLinkSaleCard nft={nft} />
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledSwiper>
      ) : (
        <StyledSwiper>
          <Swiper className="senshi-swiper"
            onSwiper={setSwiperRef}
            onActiveIndexChange={updateActiveIndex}
            spaceBetween={0}
            loop
            slidesPerView={slidesPerView}
            slidesPerGroup={slidesPerView}
            initialSlide={INITIAL_SLIDE}
            autoplay={{delay: 5000, disableOnInteraction: true}}
            modules={[Autoplay]}
          >
            {nftsToShow.map((nft) => (
              <SwiperSlide key={nft.tokenId}>
                <CollectibleLinkSaleCard
                  nft={nft}
                  currentAskPrice={isKSCollection ? null : parseFloat(nft?.marketData?.currentAskPrice)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledSwiper>
      )}
    </Box>
  )
}

export default SenshiForSale
