import { Flex, Text } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import isEmpty from 'lodash/isEmpty'
import { MarketEvent } from 'state/nftMarket/types'
import styled from 'styled-components'
import { ListCollectionFilter } from '../components/Filters/ListCollectionFilter'
import { SenshiFilter } from './SenshiFilter'
import ClearAllButton from './ClearAllButton'

export const Container = styled(Flex)`
  gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    align-items: center;
  }
`

const ScrollableFlexContainer = styled(Flex)`
  align-items: center;
  flex: 1;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: wrap;
    overflow-x: revert;
  }
`

interface SenshiMarketFiltersProps {
  address: string
  nftActivityFilters: { typeFilters: MarketEvent[]; collectionFilters: string[] }
}

const SenshiMarketFilters: React.FC<React.PropsWithChildren<SenshiMarketFiltersProps>> = ({ address, nftActivityFilters }) => {
  const { t } = useTranslation()

  return (
    <Container>
      <ScrollableFlexContainer>
        {/* {address === '' && <ListCollectionFilter nftActivityFilters={nftActivityFilters} />} */}
        {[MarketEvent.NEW, MarketEvent.CANCEL, MarketEvent.MODIFY, MarketEvent.SELL].map((eventType) => {
          return (
            <SenshiFilter
              key={eventType}
              eventType={eventType}
              collectionAddress={address}
              nftActivityFilters={nftActivityFilters}
            />
          )
        })}
      </ScrollableFlexContainer>
      {!isEmpty(nftActivityFilters.typeFilters) || !isEmpty(nftActivityFilters.collectionFilters) ? (
        <ClearAllButton collectionAddress={address} />
      ) : null}
    </Container>
  )
}

export default SenshiMarketFilters
