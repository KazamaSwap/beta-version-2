import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled from 'styled-components'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@kazamaswap/wagmi'
import { Heading, Flex, Image, Text, Link, Card, KazamaFrontCard, Button, TableCard } from '@kazamaswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from '@kazamaswap/localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import PoolsPage from 'components/Layout/PoolsPage'
import SunburstSvg from 'components/Sunburst/SunburstSvg'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { DeserializedPool, DeserializedPoolVault, VaultKey, DeserializedPoolLockedVault } from 'state/types'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import Loading from 'components/Loading'
import { useInitialBlock } from 'state/block/hooks'
import { BSC_BLOCK_TIME } from 'config'
import ScrollToTopButton from 'components/ScrollToTopButton/ScrollToTopButtonV2'
import Container from 'components/Layout/Container'
import CompositeImage from 'views/Swap/CompositeImage'
import PoolCard from './components/PoolCard'
import VaultWidget from './components/KazamaVaultCard/VaultWidget'
import PoolTabButtons from './components/PoolTabButtons'
import WidgetTable from './components/WidgetTable/PoolsTable'
import { getKazamaVaultEarnings } from './helpers'

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

const PoolsWidget: React.FC<React.PropsWithChildren> = () => {
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
          <VaultWidget key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )

  const tableLayout = <WidgetTable urlSearch={normalizedUrlSearch} pools={chosenPools} account={account} />
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
        <PageMeta />
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
        <div ref={observerRef} />
    </>
  )
}

export default PoolsWidget
