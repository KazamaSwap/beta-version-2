import Container from 'components/Layout/Container';
import TableLoader from 'components/TableLoader';
import { useBNBBusdPrice } from 'hooks/useBUSDPrice';
import useTheme from 'hooks/useTheme';
import { useEffect, useState } from 'react';
import { useAppDispatch } from 'state';
import { getCollectionActivity } from 'state/nftMarket/helpers';
import { useGetNftActivityFilters } from 'state/nftMarket/hooks';
import { Activity, Collection, NftToken } from 'state/nftMarket/types';
import styled from 'styled-components';
import { isAddress } from 'utils';

import { useLastUpdated } from '@kazamaswap/hooks';
import { useTranslation } from '@kazamaswap/localization';
import {
    ArrowBackIcon, ArrowForwardIcon, Box, Button, Flex, IconButton, Link, Table, TableCardFooter,
    Text, Th, useMatchBreakpoints
} from '@kazamaswap/uikit';

import NftActivityRow from '../components/Activity/NftActivityRow';
import NoNftsImage from '../components/Activity/NoNftsImage';
import { Arrow, PageButtons } from '../components/SenshiPaginationButtons';
import SenshiMarketFilters from './SenshiMarketFilters';
import { fetchActivityNftMetadata } from './utils/fetchActivityNftMetadata';
import { sortActivity } from './utils/sortActivity';

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

const MAX_PER_PAGE = 7

const MAX_PER_QUERY = 100

interface SenshiMarketTableProps {
  collection?: Collection
}

const SenshiMarketTable: React.FC<React.PropsWithChildren<SenshiMarketTableProps>> = ({ collection }) => {
  const dispatch = useAppDispatch()
  const { address: collectionAddress } = collection || { address: '' }
  const nftActivityFilters = useGetNftActivityFilters(collectionAddress)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [paginationData, setPaginationData] = useState<{
    activity: Activity[]
    currentPage: number
    maxPage: number
  }>({
    activity: [],
    currentPage: 1,
    maxPage: 1,
  })
  const [activitiesSlice, setActivitiesSlice] = useState<Activity[]>([])
  const [nftMetadata, setNftMetadata] = useState<NftToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [queryPage, setQueryPage] = useState(1)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  const bnbBusdPrice = useBNBBusdPrice()
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  useEffect(() => {
    const interval = setInterval(() => {
       refresh();
      },60*75);
      return () => clearInterval(interval);
    }, []);

  const nftActivityFiltersString = JSON.stringify(nftActivityFilters)

  useEffect(() => {
    const fetchCollectionActivity = async () => {
      try {
        setIsLoading(true)
        const nftActivityFiltersParsed = JSON.parse(nftActivityFiltersString)
        const collectionActivity = await getCollectionActivity(
          collectionAddress.toLowerCase(),
          nftActivityFiltersParsed,
          MAX_PER_QUERY,
        )
        const activity = sortActivity(collectionActivity)
        setPaginationData({
          activity,
          currentPage: 1,
          maxPage: Math.ceil(activity.length / MAX_PER_PAGE) || 1,
        })
        setIsLoading(false)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to fetch collection activity', error)
      }
    }

    if ((collectionAddress && isAddress(collectionAddress)) || collectionAddress === '') {
      fetchCollectionActivity()
    }
  }, [dispatch, collectionAddress, nftActivityFiltersString, lastUpdated])

  useEffect(() => {
    const fetchNftMetadata = async () => {
      const nfts = await fetchActivityNftMetadata(activitiesSlice)
      setNftMetadata(nfts)
    }

    if (activitiesSlice.length > 0) {
      fetchNftMetadata()
    }
  }, [activitiesSlice])

  useEffect(() => {
    const slice = paginationData.activity.slice(
      MAX_PER_PAGE * (paginationData.currentPage - 1),
      MAX_PER_PAGE * paginationData.currentPage,
    )
    setActivitiesSlice(slice)
  }, [paginationData])

  return (
    <><Pagination>
        <Flex alignItems="center" justifyContent="left" mr="auto">
          <TitleText>Market Activity</TitleText>
          {/* <Flex ml="10px">
            <ViewCollection href="/nfts/collections/0x7899562ea30623E04cDAAB016D55bfD533505a56">
              View Collection
            </ViewCollection>
          </Flex> */}
        </Flex>
      <SeperatorLine />
      <SenshiMarketFilters address={collection?.address || ''} nftActivityFilters={nftActivityFilters} />
      <Flex alignItems="center" justifyContent="right">
      <Arrow
                    onClick={() => {
                      if (paginationData.currentPage !== 1) {
                        setPaginationData((prevState) => ({
                          ...prevState,
                          currentPage: prevState.currentPage - 1,
                        }))
                      }
                    } }
                  >
        <IconButton variant="primary" color={paginationData.currentPage === 1 ? 'textDisabled' : 'primary'} mr="10px">
          <ArrowBackIcon />
        </IconButton>
        </Arrow>
        <Arrow
                    onClick={async () => {
                      if (paginationData.currentPage !== paginationData.maxPage) {
                        setPaginationData((prevState) => ({
                          ...prevState,
                          currentPage: prevState.currentPage + 1,
                        }))

                        if (paginationData.maxPage - paginationData.currentPage === 1 &&
                          paginationData.activity.length === MAX_PER_QUERY * queryPage) {
                          try {
                            setIsLoading(true)
                            const nftActivityFiltersParsed = JSON.parse(nftActivityFiltersString)
                            const collectionActivity = await getCollectionActivity(
                              collectionAddress.toLowerCase(),
                              nftActivityFiltersParsed,
                              MAX_PER_QUERY * (queryPage + 1)
                            )
                            const activity = sortActivity(collectionActivity)
                            setPaginationData((prevState) => {
                              return {
                                ...prevState,
                                activity,
                                maxPage: Math.ceil(activity.length / MAX_PER_PAGE) || 1,
                              }
                            })
                            setIsLoading(false)
                            setQueryPage((prevState) => prevState + 1)
                          } catch (error) {
                            console.error('Failed to fetch collection activity', error)
                          }
                        }
                      }
                    } }
                  >
        <IconButton variant="text" color={paginationData.currentPage === paginationData.maxPage ? 'textDisabled' : 'primary'}>
          <ArrowForwardIcon />
        </IconButton>
        </Arrow>
      </Flex>
    </Pagination>
    <Box py="32px">
        <Container px={[0, null, '24px']}>
          <Flex
            style={{ gap: '16px', padding: '0 16px' }}
            alignItems={[null, null, 'center']}
            flexDirection={['column', 'column', 'row']}
            flexWrap={isMd ? 'wrap' : 'nowrap'}
          >
            {/* <ActivityFilters address={collection?.address || ''} nftActivityFilters={nftActivityFilters} /> */}
             {/* <Button
              scale="sm"
              disabled={isLoading}
              onClick={() => {
                refresh()
              } }
              width={isMd && '100%'}
            >
              {t('Refresh')}
            </Button>  */}
          </Flex>
        </Container>
        <Container style={{ overflowX: 'auto' }}>
          {paginationData.activity.length === 0 &&
            nftMetadata.length === 0 &&
            activitiesSlice.length === 0 &&
            !isLoading ? (
            <Flex p="24px" flexDirection="column" alignItems="center">
              <NoNftsImage />
              <Text pt="8px" bold>
                {t('No NFT market history found')}
              </Text>
            </Flex>
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th textAlign={['center', null, 'left']}> {t('Item')}</Th>
                    <Th textAlign="right"> {t('Event')}</Th>
                    {isXs || isSm ? null : (
                      <>
                        <Th textAlign="right"> {t('Price')}</Th>
                        <Th textAlign="center"> {t('From')}</Th>
                        <Th textAlign="center"> {t('To')}</Th>
                      </>
                    )}
                    <Th textAlign="center"> {t('Date')}</Th>
                    {isXs || isSm ? null : <Th />}
                  </tr>
                </thead>
                <tbody>
                  {!isInitialized ? (
                    <TableLoader />
                  ) : (
                    activitiesSlice.map((activity) => {
                      const nftMeta = nftMetadata.find(
                        (metaNft) => metaNft.tokenId === activity.nft.tokenId &&
                          metaNft.collectionAddress.toLowerCase() === activity.nft?.collection.id.toLowerCase()
                      )
                      return (
                        <NftActivityRow
                          key={`${activity.marketEvent}#${activity.nft.tokenId}#${activity.timestamp}#${activity.tx}`}
                          activity={activity}
                          nft={nftMeta}
                          bnbBusdPrice={bnbBusdPrice} />
                      )
                    })
                  )}
                </tbody>
              </Table>
              <Flex
                borderTop={`1px ${theme.colors.cardBorder} solid`}
                pt="24px"
                flexDirection="column"
                justifyContent="space-between"
                height="100%"
              />
            </>
          )}
        </Container>
      </Box></>
  )
}

export default SenshiMarketTable
