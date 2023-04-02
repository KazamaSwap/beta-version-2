import BigNumber from 'bignumber.js';
import Container from 'components/Layout/Container';
import FlexLayout from 'components/Layout/Flex';
import { PageMeta } from 'components/Layout/Page';
import PoolsPage from 'components/Layout/PoolsPage';
import Loading from 'components/Loading';
import { NextLinkFromReactRouter } from 'components/NextLink';
import PageSection from 'components/PageSection';
import ScrollToTopButton from 'components/ScrollToTopButton/ScrollToTopButtonV2';
import SearchInput from 'components/SearchInput';
import Select, { OptionProps } from 'components/Select/Select';
import SunburstSvg from 'components/Sunburst/SunburstSvg';
import { BSC_BLOCK_TIME } from 'config';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import orderBy from 'lodash/orderBy';
import partition from 'lodash/partition';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useInitialBlock } from 'state/block/hooks';
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks';
import {
    DeserializedPool, DeserializedPoolLockedVault, DeserializedPoolVault, VaultKey
} from 'state/types';
import { ViewMode } from 'state/user/actions';
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks';
import styled from 'styled-components';
import { latinise } from 'utils/latinise';
import TopSliderBar from 'views/Home/components/TopSliderBar';
import CompositeImage from 'views/Swap/CompositeImage';

import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useTranslation } from '@kazamaswap/localization';
import {
    Button, Card, Flex, Heading, Image, KazamaFrontCard, Link, TableCard, Text
} from '@kazamaswap/uikit';
import { useWeb3React } from '@kazamaswap/wagmi';

import KazamaVaultCard from './components/KazamaVaultCard';
import PoolCard from './components/PoolCard';
import PoolsTable from './components/PoolsTable/PoolsTable';
import PoolTabButtons from './components/PoolTabButtons';
import { getKazamaVaultEarnings } from './helpers';

const TopLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  top: 0;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const topLeftImage = {
  path: '/images/home/KazamaMoon/',
  attributes: [
    { src: '1-left', alt: 'Kazama Moon' },
  ],
}

const MoonWrapper = styled(Container)`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    visibility: visible;
  }
`

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const Wrapper = styled(Flex)`
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 150px;
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const BgWrapper = styled.div`
background: url(https://ibb.co/C0c2yYN) no-repeat center center fixed; 
-webkit-background-size: cover;
-moz-background-size: cover;
-o-background-size: cover;
background-size: cover;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const StyledSunburst = styled(SunburstSvg)`
  height: 350%;
  width: 350%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 600%;
    width: 600%;
  }
`

export const KazamaTextSmall = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 30px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.65px; 
   font-weight: 400;
`

export const KazamaTextBig = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 2.00px; 
   font-weight: 400;
`

export const ImageWrapper = styled(Image)`
  z-index: 4;
  margin-bottom: 75px;
  margin-right: 75px;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const PoolsContainer = styled(TableCard)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-85px);

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-285px);
  }
`

const SenshiTopContainer = styled(KazamaFrontCard)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-110px);
  background: transparent;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-207px);
  }
`
const ControlContainer = styled(Card)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-187px);
  background: #1B1A23;
  margin-bottom: 15px;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-285px);
  }
`

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const NUMBER_OF_POOLS_VISIBLE = 12

const sortPools = (account: string, sortOption: string, pools: DeserializedPool[], poolsToSort: DeserializedPool[]) => {
  switch (sortOption) {
    case 'apr':
      // Ternary is needed to prevent pools without APR (like MIX) getting top spot
      return orderBy(poolsToSort, (pool: DeserializedPool) => (pool.apr ? pool.apr : 0), 'desc')
    case 'earned':
      return orderBy(
        poolsToSort,
        (pool: DeserializedPool) => {
          if (!pool.userData || !pool.earningTokenPrice) {
            return 0
          }

          if (pool.vaultKey) {
            const { userData, pricePerFullShare } = pool as DeserializedPoolVault
            if (!userData || !userData.userShares) {
              return 0
            }
            return getKazamaVaultEarnings(
              account,
              userData.kazamaAtLastUserAction,
              userData.userShares,
              pricePerFullShare,
              pool.earningTokenPrice,
              pool.vaultKey === VaultKey.KazamaVault
                ? (pool as DeserializedPoolLockedVault).userData.currentPerformanceFee.plus(
                    (pool as DeserializedPoolLockedVault).userData.currentOverdueFee,
                  )
                : null,
            ).autoUsdToDisplay
          }
          return pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
        },
        'desc',
      )
    case 'totalStaked': {
      return orderBy(
        poolsToSort,
        (pool: DeserializedPool) => {
          let totalStaked = Number.NaN
          if (pool.vaultKey) {
            const vault = pool as DeserializedPoolVault
            if (pool.stakingTokenPrice && vault.totalKazamaInVault.isFinite()) {
              totalStaked =
                +formatUnits(EthersBigNumber.from(vault.totalKazamaInVault.toString()), pool.stakingToken.decimals) *
                pool.stakingTokenPrice
            }
          } else if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice) {
            totalStaked =
              +formatUnits(EthersBigNumber.from(pool.totalStaked.toString()), pool.stakingToken.decimals) *
              pool.stakingTokenPrice
          }
          return Number.isFinite(totalStaked) ? totalStaked : 0
        },
        'desc',
      )
    }
    case 'latest':
      return orderBy(poolsToSort, (pool: DeserializedPool) => Number(pool.sousId), 'desc')
    default:
      return poolsToSort
  }
}

const POOL_START_BLOCK_THRESHOLD = (60 / BSC_BLOCK_TIME) * 4

const Pools: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePoolsWithVault()
  const [stakedOnly, setStakedOnly] = useUserPoolStakedOnly()
  const [viewMode, setViewMode] = useUserPoolsViewMode()
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const normalizedUrlSearch = useMemo(
    () => (typeof router?.query?.search === 'string' ? router.query.search : ''),
    [router.query],
  )
  const [_searchQuery, setSearchQuery] = useState('')
  const searchQuery = normalizedUrlSearch && !_searchQuery ? normalizedUrlSearch : _searchQuery
  const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const initialBlock = useInitialBlock()

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const openPoolsWithStartBlockFilter = useMemo(
    () =>
      openPools.filter((pool) =>
        initialBlock > 0 && pool.startBlock
          ? Number(pool.startBlock) < initialBlock + POOL_START_BLOCK_THRESHOLD
          : true,
      ),
    [initialBlock, openPools],
  )
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.vaultKey) {
          const vault = pool as DeserializedPoolVault
          return vault.userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useCallback(() => {
    return openPoolsWithStartBlockFilter.filter((pool) => {
      if (pool.vaultKey) {
        const vault = pool as DeserializedPoolVault
        return vault.userData.userShares.gt(0)
      }
      return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
    })
  }, [openPoolsWithStartBlockFilter])
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePoolsPageFetch()

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
        if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        }
        return poolsCurrentlyVisible
      })
    }
  }, [isIntersecting])
  const showFinishedPools = router.pathname.includes('history')

  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value),
    [],
  )

  const handleSortOptionChange = useCallback((option: OptionProps) => setSortOption(option.value), [])

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools() : openPoolsWithStartBlockFilter
  }

  chosenPools = useMemo(() => {
    const sortedPools = sortPools(account, sortOption, pools, chosenPools).slice(0, numberOfPoolsVisible)

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      return sortedPools.filter((pool) => latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery))
    }
    return sortedPools
  }, [account, sortOption, pools, chosenPools, numberOfPoolsVisible, searchQuery])
  chosenPoolsLength.current = chosenPools.length

  const cardLayout = (
    <CardLayout>
      {chosenPools.map((pool) =>
        pool.vaultKey ? (
          <KazamaVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )

  const tableLayout = <PoolsTable urlSearch={normalizedUrlSearch} pools={chosenPools} account={account} />
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
        <PageMeta />
        <div>
        <div style={{background: 'linear-gradient(180deg,#25202F,rgba(34,33,39,0)), url("/images/casino-bg.png") no-repeat bottom', marginTop: "64px", padding: "50px 0px", backgroundSize: "cover",  position: "relative"}}>
        <TopSliderBar />
           <div className='slider-graphic slider-graphic-1' />
           <div className='slider-graphic slider-graphic-2' />
           <div className='slider-graphic slider-graphic-3' /> 
          <div className='slider-graphic slider-graphic-4' />
        </div>
      </div>
      <PoolsPage>
      <SenshiTopContainer>
      <Flex
        alignItems="center"
        width={['100%', '100%', '100%']}
        justifyContent={['center', 'center', 'center', 'flex-end']}
      >
        {/* <BubbleWrapper>
          <Button id="clickExchangeHelp" as="a" external href="#" variant="primary">
            <KazamaTextButton>
            {t('Need help?')}
            </KazamaTextButton>
          </Button>
          <Svg viewBox="0 0 16 16">
            <path d="M0 16V0C0 0 3 1 6 1C9 1 16 -2 16 3.5C16 10.5 7.5 16 0 16Z" />
          </Svg>
        </BubbleWrapper> */}
        <ImageWrapper src="/images/kazama_helper.png" alt="Get some help" width={130} height={128} /> 
      </Flex>
      </SenshiTopContainer>
      <ControlContainer>
        <PoolControls>
        <NextLinkFromReactRouter to="#" prefetch={false}>
            <Button>
                <KazamaTextButton>
                  {t('Apply for a Pool')}
                  </KazamaTextButton>
              </Button>
            </NextLinkFromReactRouter>
           <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <FilterContainer>
          <LabelWrapper style={{ marginLeft: 16 }}>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('User Status')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('All Pools'),
                      value: 'openPools',
                    },
                    {
                      label: t('Only Staked'),
                      value: 'stakedOnly',
                    },
                  ]}
                  onOptionChange={handleSortOptionChange}
                />
              </ControlStretch>
            </LabelWrapper>
          <LabelWrapper style={{ marginLeft: 16 }}>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Pool Status')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Live Pools'),
                      value: 'openPools',
                    },
                    {
                      label: t('Finished Pools'),
                      value: 'finishedPools',
                    },
                  ]}
                  onOptionChange={handleSortOptionChange}
                />
              </ControlStretch>
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                    {
                      label: t('Latest'),
                      value: 'latest',
                    },
                  ]}
                  onOptionChange={handleSortOptionChange}
                />
              </ControlStretch>
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search Pools')}
              </Text>
              <SearchInput initialValue={searchQuery} onChange={handleChangeSearchQuery} placeholder="Enter name .." />
            </LabelWrapper>
          </FilterContainer>
        </PoolControls>
        </ControlContainer>
        <PoolsContainer>
        {showFinishedPools && (
          <FinishedTextContainer />
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
        <div ref={observerRef} />
        </PoolsContainer>
      </PoolsPage>
      {createPortal(<ScrollToTopButton />, document.body)}
    </>
  )
}

export default Pools
