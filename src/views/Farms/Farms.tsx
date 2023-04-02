import { useEffect, useCallback, useState, useMemo, useRef, createContext } from 'react'
import { createPortal } from 'react-dom'
import BigNumber from 'bignumber.js'
import { ChainId } from '@kazamaswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useWeb3React } from '@kazamaswap/wagmi'
import { Image, Heading, Toggle, Text, Button, ArrowForwardIcon, Flex, Link, Box, Card, KazamaFrontCard, CardTables, SearchIcon, ChevronDownIcon } from '@kazamaswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import PageSection from 'components/PageSection'
import Page, { PageMeta } from 'components/Layout/Page'
import PoolsPage from 'components/Layout/PoolsPage'
import SunburstSvg from 'components/Sunburst/SunburstSvg'
import { useFarms, usePollFarmsWithUserData, usePriceKazamaBusd } from 'state/farms/hooks'
import { useKazamaVaultUserData } from 'state/pools/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm } from 'state/types'
import { useTranslation } from '@kazamaswap/localization'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { latinise } from 'utils/latinise'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import PageHeader from 'components/PageHeader'
import FarmInput from 'components/SearchInput/FarmInput'
import SelectFarm, { OptionProps } from 'components/Select/SelectFarm'
import Loading from 'components/Loading'
import ToggleView from 'components/ToggleView/ToggleView'
import ScrollToTopButton from 'components/ScrollToTopButton/ScrollToTopButtonV2'
import Table from './components/FarmTable/FarmTable'
import FarmTabButtons from './components/FarmTabButtons'
import { FarmWithStakedValue } from './components/types'
import { BKazamaBoosterCard } from './components/BKazamaBoosterCard'

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
const FarmContainer = styled(CardTables)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  background: rgba(0, 0, 0, 0.35);
  margin-bottom: 15px;
  z-index: 1;
`

const ControlContainer = styled(Card)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  background: #141824;
  margin-bottom: 15px;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
  }
`

const FarmFlexWrapper = styled(Flex)`
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: nowrap;
  }
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

const FarmH1 = styled(Heading)`
  font-size: 32px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
    margin-bottom: 24px;
  }
`
const FarmH2 = styled(Heading)`
  font-size: 16px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    margin-bottom: 18px;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
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

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
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

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const BgWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const TopFarmHeader = styled.div`
box-sizing: border-box;
margin: 0px;
min-width: 0px;
display: flex;
position: relative;
width: 100%;
margin-top: 65px;
background-image: url(https://rollbit.com/static/media/banner-welcome.2c365efcff25a405dcff.jpg);
background-position: center;
background-repeat: no-repeat;
background-attachment: fixed;
background-size: cover;
border-radius: 7px;
height: 300px;
`

const TopFarmInner = styled.div`
position: relative;
flex-direction: column;
align-self: center;
max-width: 500px;
min-width: 300px;
width: 100%;
padding: 0px 10px;
`

const ControlsBox = styled.div`
display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    margin-top: 20px;
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const StyledSunburst = styled(SunburstSvg)`
  height: 350%;
  width: 350%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 600%;
    width: 600%;
  }
`

export const ImageWrapper = styled(Image)`
  z-index: 4;
  margin-bottom: 75px;
  margin-right: 75px;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
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

const PolyBorder = styled.div`
filter: drop-shadow(1px 0px 0px #1B1A23)
drop-shadow(-1px 0px 0px #1B1A23)
drop-shadow(0px 0px 0px #1B1A23)
drop-shadow(0px -1px 0px #1B1A23)
drop-shadow(1px 0px 0px #1B1A23)
drop-shadow(-1px -1px 0px #1B1A23)
drop-shadow(-1px 2px 0px #1B1A23)
drop-shadow(1px -1px 0px #1B1A23);
`

const PolyShadow = styled.div`
  filter: drop-shadow(0 15px 30px rgba(32, 28, 41, 0.938));
`

const NUMBER_OF_FARMS_VISIBLE = 12

const Farms: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname, query: urlQuery } = useRouter()
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { data: farmsLP, userDataLoaded, poolLength, regularKazamaPerBlock } = useFarms()
  const kazamaPrice = usePriceKazamaBusd()

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const [viewMode, setViewMode] = useUserFarmsViewMode()
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  useKazamaVaultUserData()

  usePollFarmsWithUserData()

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)
  const [boostedOnly, setBoostedOnly] = useState(false)

  const activeFarms = farmsLP.filter(
    (farm) => farm.pid !== 0 && farm.multiplier !== '0X' && (!poolLength || poolLength > farm.pid),
  )
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')
  const archivedFarms = farmsLP

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { kazamaRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(
              chainId,
              new BigNumber(farm.poolWeight),
              kazamaPrice,
              totalLiquidity,
              farm.lpAddress,
              regularKazamaPerBlock,
            )
          : { kazamaRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: kazamaRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [query, isActive, chainId, kazamaPrice, regularKazamaPerBlock],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        case 'latest':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.pid), 'desc')
        default:
          return farms
      }
    }

    if (isActive) {
      chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFarms = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    if (boostedOnly) {
      chosenFarms = chosenFarms.filter((f) => f.boosted)
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
    boostedOnly,
  ])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <FarmsContext.Provider value={{ chosenFarmsMemoized }}>
        <PageMeta />
      <PoolsPage>
      {/* <div>
        <div style={{background: 'linear-gradient(180deg,rgba(34, 33, 39, 0.651),rgba(37, 32, 47, 0.877),#25202F), url("/images/ks-farm-bg.jpg") no-repeat bottom', marginTop: "64px", padding: "50px 0px", backgroundSize: "cover",  position: "relative"}}>
        <TopSliderBar />
           <div className='slider-graphic slider-graphic-farm-1' />
           <div className='slider-graphic slider-graphic-3' /> 
        </div>
      </div> */}
          <ControlContainer>
            <PoolControls>
          <ViewControls>
             {/* <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
            <ToggleWrapper>
              <Toggle
                id="staked-only-farms"
                checked={stakedOnly}
                onChange={() => setStakedOnly(!stakedOnly)}
                scale="sm"
              />
              <Text> {t('Staked only')}</Text>
            </ToggleWrapper>
            <ToggleWrapper>
              <Toggle
                id="staked-only-farms"
                checked={boostedOnly}
                onChange={() => setBoostedOnly((prev) => !prev)}
                scale="sm"
              />
              <Text> {t('Booster Available')}</Text>
            </ToggleWrapper>
            <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} /> */}
          </ViewControls>
          </PoolControls>
        </ControlContainer> 

          <div style={{display: "flex", marginBottom: "20px"}}>
            <div style={{flex: "1", width: "100%", border: "1px solid #1b2031", borderRadius: "8px", paddingLeft: "11px"}}>
            <div style={{display: "flex", flexDirection: "row"}}>
              <Flex style={{textAlign: "center"}}>
                <SearchIcon width={26}/>
              </Flex>
              <Flex style={{flex: "1"}}>
              <FarmInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search by token or pair .."/>    
              </Flex>
            </div>          
            </div>
            <div style={{flex: "0 0 200px",display: "flex", border: "1px solid #1b2031", borderRadius: "8px", paddingLeft: "11px", marginLeft: "15px", alignItems: "center"}}>
            <Text> {t('Booster Available')}</Text>
            <ToggleWrapper>
              <Toggle
                id="staked-only-farms"
                checked={boostedOnly}
                onChange={() => setBoostedOnly((prev) => !prev)}
                scale="sm"
              />
            </ToggleWrapper>
            </div>
            <div style={{flex: "0 0 200px",display: "flex", border: "1px solid #1b2031", borderRadius: "8px", paddingLeft: "11px", marginLeft: "15px", alignItems: "center"}}>
            <Text> {t('Staked only')}</Text>
            <ToggleWrapper>
              <Toggle
                id="staked-only-farms"
                checked={stakedOnly}
                onChange={() => setStakedOnly(!stakedOnly)}
                scale="sm"
              />
            </ToggleWrapper>
            </div>
            <div style={{flex: "0 0 200px"}}>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <SelectFarm
                options={[
                  {
                    label: t('Hot Pools'),
                    value: 'hot',
                  },
                  {
                    label: t('Highest APR'),
                    value: 'apr',
                  },
                  {
                    label: t('Highest Multiplier'),
                    value: 'multiplier',
                  },
                  {
                    label: t('Most Earned'),
                    value: 'earned',
                  },
                  {
                    label: t('Most Liquidity'),
                    value: 'liquidity',
                  },
                  {
                    label: t('Recently Added'),
                    value: 'latest',
                  },
                ]}
                onOptionChange={handleSortOptionChange}
              />
            </LabelWrapper>              
            </div>
          </div>

        <FarmContainer>
        {isInactive && (
          <FinishedTextContainer>
            <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
              {t("Don't see the farm you are staking?")}
            </Text>
          </FinishedTextContainer>
        )}
        {viewMode === ViewMode.TABLE ? (
          <Table farms={chosenFarmsMemoized} kazamaPrice={kazamaPrice} userDataReady={userDataReady} />
        ) : (
          <FlexLayout>{children}</FlexLayout>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        <div ref={observerRef} />
        </FarmContainer>
      </PoolsPage>
      {createPortal(<ScrollToTopButton />, document.body)}
    </FarmsContext.Provider>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Farms
