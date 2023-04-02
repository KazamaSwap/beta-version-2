import Balance from 'components/Balance';
import { NextLinkFromReactRouter as ReactRouterLink } from 'components/NextLink';
import distributorAbi from 'config/abi/distributor.json';
import kazamaAbi from 'config/abi/kazama.json';
import { DISTRIBUTOR, FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import { useEffect, useMemo, useState } from 'react';
import { usePriceKazamaBusd } from 'state/farms/hooks';
import { Achievement, LotteryRound, Profile } from 'state/types';
import styled from 'styled-components';
import useSWR from 'swr';
import { getBlockExploreLink } from 'utils';
import { formatBigNumber, formatNumber, formatNumberExact } from 'utils/formatBalance';
import { multicallv2 } from 'utils/multicall';
import truncateHash from 'utils/truncateHash';
import ProfileCreation from 'views/ProfileCreation';

import { BigNumber } from '@ethersproject/bignumber';
import { useTranslation } from '@kazamaswap/localization';
import { bscTestnetTokens, bscTokens } from '@kazamaswap/tokens';
import {
    BscScanIcon, Button, Card, CardBody, Flex, IconButton, Link, Skeleton, Text,
    useMatchBreakpoints, useModal
} from '@kazamaswap/uikit';
import { useWeb3React } from '@kazamaswap/wagmi';

import BannerHeader from '../../Nft/market/components/BannerHeader';
import AvatarImage from '../../Nft/market/components/BannerHeader/AvatarImage';
import MarketPageTitle from '../../Nft/market/components/MarketPageTitle';
import StatBox, { StatBoxItem } from '../../Nft/market/components/StatBox';
import EditProfileAvatar from './EditProfileAvatar';
import EditProfileModal from './EditProfileModal';

const OutputText = styled(Balance)`
color: #c4bdd2;
    font-weight: 400;
    line-height: 1.5;
    font-size: 14px;
`

const PrintText = styled(Text)`
    line-height: 1.5;
`

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
`

const TopHeader = styled.div`
background: #111923;
border-radius: 10px;
padding: 20px;
display: flex;
justify-content: space-between;
`

interface HeaderProps {
  accountPath: string
  profile: Profile
  achievements: Achievement[]
  nftCollected: number
  isAchievementsLoading: boolean
  isNftLoading: boolean
  isProfileLoading: boolean
  onSuccess?: () => void
}



const profileUserHoldings = BigNumber.from('0')

// Account and profile passed down as the profile could be used to render _other_ users' profiles.
const ProfileHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  accountPath,
  profile,
  achievements,
  nftCollected,
  isAchievementsLoading,
  isNftLoading,
  isProfileLoading,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const profileAddress = accountPath
  const [shouldShowRoundDetail, setShouldShowRoundDetail] = useState(false)
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState<LotteryRound>(null)
  const [selectedLotteryId, setSelectedLotteryId] = useState<string>(null)
  const {
    data: { kazamaSupply, burnedBalance, circulatingSupply, foreverLockedKazama, combinedKazamaDestroyed, userShares, pendingRewards, totalRewards, totalShares, rewardsPerShare } = {
      kazamaSupply: 0,
      burnedBalance: 0,
      circulatingSupply: 0,
      foreverLockedKazama: 0,
      combinedKazamaDestroyed: 0,
      liquidityLocked: 0,
      userShares: 0,
      pendingRewards: 0,
      totalRewards: 0,
      totalShares: 0,
      rewardsPerShare: 0,
    },
  } = useSWR(
    loadData ? ['kazamaDataRow'] : null,
    async () => {
      const totalSupplyCall = { address: bscTestnetTokens.kazama.address, name: 'totalSupply' }
      const burnedTokenCall = { address: bscTestnetTokens.kazama.address, name: 'balanceOf', params: [profileAddress], }
      const rewardsPerShareCall = { address: DISTRIBUTOR, name: 'dividendsPerShare' }
      const userSharesCall = { address: DISTRIBUTOR, name: 'shares', params: [account] }
      const totalSharesCall = { address: DISTRIBUTOR, name: 'totalShares' }
      const pendingRewardsCall = { address: DISTRIBUTOR, name: 'getUnpaidEarnings', params: [account] }
      const totalRewardsCall = { address: DISTRIBUTOR, name: 'totalDistributed' }
      const AllTimeBurnedCall = { address: bscTestnetTokens.kazama.address, name: 'AllTimeBurned', }

      const KazamaLiquidityBurnedCall = { address : bscTestnetTokens.kazamalp.address, name: 'balanceOf', params: ['0x000000000000000000000000000000000000dEaD'], }

      const [tokenDataResultRaw, distributorData] = await Promise.all([
        multicallv2({
          abi: kazamaAbi,calls: [totalSupplyCall, burnedTokenCall, AllTimeBurnedCall, KazamaLiquidityBurnedCall],
        options:
         {requireSuccess: false,},
        }),
        multicallv2({
          abi: distributorAbi,
          calls: [userSharesCall, pendingRewardsCall, totalRewardsCall, totalSharesCall, rewardsPerShareCall],
          options: {
            requireSuccess: false,
          },
        })
      ])
      const [totalSupply, burned, AllTimeBurned, KazamaLiquidityBurned] = tokenDataResultRaw.flat()
      const [userShares, totalExcluded, totalRealised, pendingRewards, totalRewards, totalShares, rewardsPerShare] = distributorData.flat()
      const totalBurned = profileUserHoldings.add(burned.add(AllTimeBurned))
      const circulating = totalSupply.sub(totalBurned)
      const foreverLocked = profileUserHoldings.add(burned)
      const combined = totalBurned.add(foreverLocked)

      return {
        kazamaSupply: totalSupply && burned ? +formatBigNumber(totalSupply) : 0,
        burnedBalance: burned ? +formatBigNumber(totalBurned) : 0,
        circulatingSupply: circulating ? +formatBigNumber(circulating) : 0,
        foreverLockedKazama: burned ? +formatBigNumber(foreverLocked) : 0,
        combinedKazamaDestroyed: burned ? +formatBigNumber(combined) : 0,
        userShares: userShares ? +formatBigNumber(userShares) : 0,
        pendingRewards: pendingRewards ? +formatBigNumber(pendingRewards) : 0,
        totalRewards: totalRewards ? +formatBigNumber(totalRewards) : 0,
        totalShares: totalShares ? +formatBigNumber(totalShares) : 0,
        rewardsPerShare: rewardsPerShare ? +formatBigNumber(rewardsPerShare) : 0
      }
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  const kazamaPriceBusd = usePriceKazamaBusd()
  const mcap = kazamaPriceBusd.times(circulatingSupply)
  const burnedValue = kazamaPriceBusd.times(burnedBalance)
  const mcapString = formatNumberExact(mcap.toNumber())
  const valueString = formatNumber(burnedValue.toNumber())
  const kazamaLockedValue = kazamaPriceBusd.times(foreverLockedKazama)
  const kazamaLockedString = formatNumber(kazamaLockedValue.toNumber())
  const totalDestroyedUsd = kazamaPriceBusd.times(combinedKazamaDestroyed)
  const totalDestroyedUsdString = formatNumber(totalDestroyedUsd.toNumber())

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  const [onEditProfileModal] = useModal(
    <EditProfileModal
      onSuccess={() => {
        if (onSuccess) {
          onSuccess()
        }
      }}
    />,
    false,
  )

  const isConnectedAccount = account?.toLowerCase() === accountPath?.toLowerCase()
  const numNftCollected = !isNftLoading ? (nftCollected ? formatNumber(nftCollected, 0, 0) : '-') : null
  const numPoints = !isProfileLoading ? (profile?.points ? formatNumber(profile.points, 0, 0) : '-') : null
  const [onPresentCreateProfileModal] =  useModal(<ProfileCreation />)
  const numAchievements = !isAchievementsLoading
    ? achievements?.length
      ? formatNumber(achievements.length, 0, 0)
      : '-'
    : null

  const avatarImage = profile?.nft?.image?.thumbnail || '/images/nfts/no-profile-md.png'
  const profileUsername = profile?.username
  const hasProfile = !!profile

  const bannerImage = '/images/teams/no-team-banner.png'

  const avatar = useMemo(() => {
    const getIconButtons = () => {
      return (
        // TODO: Share functionality once user profiles routed by ID
        null
      )
    }

    const getImage = () => {
      return (
        <>
          {hasProfile && accountPath && isConnectedAccount ? (
            <EditProfileAvatar
              src={avatarImage}
              alt={t('User profile picture')}
              onSuccess={() => {
                if (onSuccess) {
                  onSuccess()
                }
              }}
            />
          ) : (
            <AvatarImage src={avatarImage} alt={t('User profile picture')} />
          )}
        </>
      )
    }
    return (
      <>
        {getImage()}
        {getIconButtons()}
      </>
    )
  }, [accountPath, avatarImage, isConnectedAccount, onSuccess, hasProfile, t])

  const title = useMemo(() => {
    if (profileUsername) {
      return `@${truncateHash(profileUsername)}`
    }

    if (accountPath) {
      return truncateHash(accountPath, 5, 3)
    }

    return null
  }, [profileUsername, accountPath])

  const description = useMemo(() => {
    const getActivateButton = () => {
      if (!profile) {
        return (
            <Button width="fit-content" onClick={onPresentCreateProfileModal} mt="16px">{t('Activate Profile')}</Button>
        )
      }
      return (
        <Button width="fit-content" mt="16px" onClick={onEditProfileModal}>
          {t('Reactivate Profile')}
        </Button>
      )
    }

    return (
      <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
        {accountPath && profile?.username && (
          <Link href={getBlockExploreLink(accountPath, 'address')} external bold color="primary">
            {truncateHash(accountPath)}
          </Link>
        )}
        {accountPath && isConnectedAccount && (!profile || !profile?.nft) && getActivateButton()}
      </Flex>
    )
  }, [accountPath, isConnectedAccount, onEditProfileModal, profile, t])

  return (
    <>
      <TopHeader>
        <Flex flexDirection="row">
        <Flex>
          {avatar}
        </Flex>
        <Flex ml="20px">
          <Flex flexDirection="column">
            <Flex>
            <MarketPageTitle title={title}/>
  
            </Flex>
            <Flex>
            {title}
            </Flex>
          </Flex>
        </Flex>
        </Flex>

      </TopHeader>
      {/* <MarketPageTitle pb="48px" title={title} description={description}>
        <StatBox>
          <StatBoxItem title={t('NFT Collected')} stat={numNftCollected} />
          <StatBoxItem title={t('Points')} stat={numPoints} />
          <StatBoxItem title={t('Achievements')} stat={numAchievements} />
        </StatBox>
        {kazamaSupply ? (
          null
        ) : (
          <>
            <div ref={observerRef} />
          </>
        )}
  {foreverLockedKazama ? (
          <OutputText decimals={0} lineHeight="1.1" fontSize="14px" unit=" KAZAMA" value={foreverLockedKazama} />
        ) : (
          <OutputText decimals={0} lineHeight="1.1" fontSize="14px" value={0} />
        )}
          {kazamaLockedValue ? (
          <PrintText color="text">{t('$%totalUsdLocked%', { totalUsdLocked: kazamaLockedString })}</PrintText>
        ) : (
          <PrintText color="warning">$0.00</PrintText>
        )}
      </MarketPageTitle> */}
    </>
  )
}

export default ProfileHeader
