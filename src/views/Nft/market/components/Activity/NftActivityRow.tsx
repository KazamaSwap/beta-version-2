import styled from 'styled-components'
import {
  Box,
  GemIcon,
  Flex,
  Text,
  Td,
  IconButton,
  Link,
  OpenNewIcon,
  useModal,
  Skeleton,
  useMatchBreakpoints,
} from '@kazamaswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Activity, NftToken } from 'state/nftMarket/types'
import { Price, Currency } from '@kazamaswap/sdk'
import { getBlockExploreLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ProfileCell from 'views/Nft/market/components/ProfileCell'
import MobileModal from './MobileModal'
import ActivityPrice from './ActivityPrice'
import ActivityEventText from './ActivityEventText'
import { nftsBaseUrl, kazamaSenshisAddress } from '../../constants'
import NFTMedia from '../NFTMedia'

const NftDataRow = styled.tr`
background: #292334;
border-radius: 9px;
animation: 0.5s ease-out 0s 1 normal none running animation;
`

interface NftActivityRowProps {
  activity: Activity
  nft: NftToken
  bnbBusdPrice: Price<Currency, Currency>
  isUserActivity?: boolean
  isNftActivity?: boolean
}

const NftActivityRow: React.FC<React.PropsWithChildren<NftActivityRowProps>> = ({
  activity,
  bnbBusdPrice,
  nft,
  isUserActivity = false,
  isNftActivity = false,
}) => {
  const { chainId } = useActiveWeb3React()
  const { isXs, isSm } = useMatchBreakpoints()
  const priceAsFloat = parseFloat(activity.price)
  const timestampAsMs = parseFloat(activity.timestamp) * 1000
  const localeTimestamp = new Date(timestampAsMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
//  let Color;
//  if (nft.name == "Ignis Senshi") {
//    Color = "rgb(247,148,24)"; 
//  }

  const [onPresentMobileModal] = useModal(
    <MobileModal
      nft={nft}
      activity={activity}
      localeTimestamp={localeTimestamp}
      bnbBusdPrice={bnbBusdPrice}
      isUserActivity={isUserActivity}
    />,
  )
  const isKSCollection = nft ? nft.collectionAddress.toLowerCase() === kazamaSenshisAddress.toLowerCase() : false
  const tokenId =
    nft && isKSCollection
      ? nft.attributes.find((attribute) => attribute.traitType === 'senshiId')?.value
      : nft
      ? nft.tokenId
      : null

  const onClickProp = nft
    ? {
        onClick: onPresentMobileModal,
      }
    : {}

//    const RarityIcon = () => {
//      if (nft.name == "Ignis Senshi") {
//        return <GemIcon />; 
//      } 
//    }

  return (
    <NftDataRow {...((isXs || isSm) && onClickProp)} data-test="nft-activity-row">
      {!isNftActivity ? (
        <Td
          {...((isXs || isSm) && {
            onClick: (event) => {
              event.stopPropagation()
            },
          })}
        >
          <Flex justifyContent="flex-start" alignItems="center" flexDirection={['column', null, 'row']}>
            {!nft ? (
              <Skeleton height={[138, null, 64]} width={[80, null, 249]} />
            ) : (
              <>
                <Box width={50} height={50} mr={[0, null, '16px']} mb={['8px', null, 0]}>
                  <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${tokenId}`}>
                    <NFTMedia nft={nft} width={50} height={50} />
                  </NextLinkFromReactRouter>
                </Box>
                <Flex flexDirection="column">
                  <Text
                    as={NextLinkFromReactRouter}
                    to={`${nftsBaseUrl}/collections/${nft.collectionAddress}`}
                    textAlign={['center', null, 'left']}
                    color="textSubtle"
                    fontSize="14px"
                  >
                    {nft.collectionName}
                  </Text>
                  <Text
                    as={NextLinkFromReactRouter}
                    to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${tokenId}`}
                    textAlign={['center', null, 'left']}
                    bold
                  >
                    {nft.name}
                  </Text>
                </Flex>
              </>
            )}
          </Flex>
        </Td>
      ) : null}
      <Td>
        <Flex alignItems="center" justifyContent="flex-end">
          <ActivityEventText marketEvent={activity.marketEvent} />
        </Flex>
        {isXs || isSm ? <ActivityPrice price={priceAsFloat} bnbBusdPrice={bnbBusdPrice} /> : null}
      </Td>
      {isXs || isSm ? null : (
        <>
          <Td>
            <ActivityPrice price={priceAsFloat} bnbBusdPrice={bnbBusdPrice} />
          </Td>
          {isUserActivity ? (
            <Td>
              <Flex justifyContent="center" alignItems="center">
                {activity.otherParty ? <ProfileCell accountAddress={activity.otherParty} /> : '-'}
              </Flex>
            </Td>
          ) : (
            <>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {activity.seller ? <ProfileCell accountAddress={activity.seller} /> : '-'}
                </Flex>
              </Td>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {activity.buyer ? <ProfileCell accountAddress={activity.buyer} /> : '-'}
                </Flex>
              </Td>
            </>
          )}
        </>
      )}
      <Td>
        <Flex justifyContent="center">
          <Text textAlign="center" fontSize={isXs || isSm ? '12px' : '16px'}>
            {localeTimestamp}
          </Text>
        </Flex>
      </Td>
      {isXs || isSm ? null : (
        <Td>
          <IconButton as={Link} external href={getBlockExploreLink(activity.tx, 'transaction', chainId)}>
            <OpenNewIcon color="textSubtle" width="18px" />
          </IconButton>
        </Td>
      )}
    </NftDataRow>
  )
}

export default NftActivityRow
