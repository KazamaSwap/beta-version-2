// eslint-disable-next-line import/no-unresolved
import 'swiper/css/bundle';

import ProfileNFT from 'components/Layout/ProfileNFT';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks';
import styled from 'styled-components';
import SwiperCore, { Autoplay } from 'swiper';
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/react';
import { isAddress } from 'utils';

import { useTranslation } from '@kazamaswap/localization';
import { Box, Flex, Modal, Text, useMatchBreakpoints } from '@kazamaswap/uikit';

import NoNftsImage from '../Nft/market/components/Activity/NoNftsImage';
import MarketPageHeader from '../Nft/market/components/MarketPageHeader';
import { useNftsForAddress } from '../Nft/market/hooks/useNftsForAddress';
import ProfileHeader from './components/ProfileHeader';
import TabMenu from './components/TabMenu';

const StyledModal = styled(Modal)`
  max-width: 400px;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 400px;
    max-width: 400px;
  }
`

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

const TabMenuWrapper = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);

  ${({ theme }) => theme.mediaQueries.sm} {
    left: auto;
    transform: none;
  }
`

const NftProfile: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const accountAddress = useRouter().query.accountAddress as string
  const { t } = useTranslation()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const { isMobile, isMd, isLg } = useMatchBreakpoints()
  const invalidAddress = !accountAddress || isAddress(accountAddress) === false
  const {
    profile,
    isValidating: isProfileValidating,
    isFetching: isProfileFetching,
    refresh: refreshProfile,
  } = useProfileForAddress(accountAddress, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })
  const { achievements, isFetching: isAchievementsFetching } = useAchievementsForAddress(accountAddress)
  const {
    nfts: userNfts,
    isLoading: isNftLoading,
    refresh: refreshUserNfts,
  } = useNftsForAddress(accountAddress, profile, isProfileValidating)

  const onSuccess = useCallback(async () => {
    await refreshProfile()
    refreshUserNfts()
  }, [refreshProfile, refreshUserNfts])

  let slidesPerView = 7
  let maxPageIndex = 3

  if (isMd) {
    slidesPerView = 1
    maxPageIndex = 6
  }

  if (isLg) {
    slidesPerView = 1
    maxPageIndex = 4
  }

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

  if (invalidAddress) {
    return (
      <>
        <MarketPageHeader position="relative" mt="64px">
          <ProfileHeader
            accountPath={accountAddress}
            profile={null}
            achievements={null}
            nftCollected={null}
            isAchievementsLoading={false}
            isNftLoading={false}
            isProfileLoading={false}
          />
        </MarketPageHeader>
        <ProfileNFT style={{ minHeight: 'auto' }}>
          <Flex p="24px" flexDirection="column" alignItems="center">
            <NoNftsImage />
            <Text textAlign="center" maxWidth="420px" pt="8px" bold>
              {t('Please enter a valid address, or connect your wallet to view your profile')}
            </Text>
          </Flex>
        </ProfileNFT>
      </>
    )
  }

  return (
    <>
      <MarketPageHeader position="relative" mt="64px">
        <ProfileHeader
          accountPath={accountAddress}
          profile={profile}
          achievements={achievements}
          nftCollected={userNfts.length}
          isProfileLoading={isProfileFetching}
          isNftLoading={isNftLoading}
          isAchievementsLoading={isAchievementsFetching}
          onSuccess={onSuccess}
        />
      </MarketPageHeader>
      <ProfileNFT>{children}</ProfileNFT>
    </>
  )
}

export const NftProfileLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <NftProfile>{children}</NftProfile>
}

export default NftProfile
