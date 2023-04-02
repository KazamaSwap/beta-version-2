import styled from 'styled-components'
import { Box, Button, Flex, IconButton, CloseIcon } from '@kazamaswap/uikit'
import { ContextApi, useTranslation } from '@kazamaswap/localization'
import { MarketEvent } from '../../../../state/nftMarket/types'
import { useNftStorage } from '../../../../state/nftMarket/storage'

interface SenshiFilterProps {
  eventType: MarketEvent
  collectionAddress: string
  nftActivityFilters: { typeFilters: MarketEvent[]; collectionFilters: string[] }
}

const TriggerButton = styled(Button)<{ hasItem: boolean }>`
  background-color: transparent;
  font-size: 13px;
  white-space: nowrap;
  padding: 0 5px 0 9px;
  color: #c4bdd2;
  ${({ hasItem }) =>
    hasItem &&
    `  
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 8px;
  `}
`

const CloseButton = styled(IconButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const eventName = (t: ContextApi['t'], eventType: string) => {
  switch (eventType) {
    case MarketEvent.CANCEL:
      return t('Delisted')
    case MarketEvent.MODIFY:
      return t('Modified')
    case MarketEvent.NEW:
      return t('Listed')
    case MarketEvent.SELL:
      return t('Sold')
    default:
      return ''
  }
}

export const SenshiFilter: React.FC<React.PropsWithChildren<SenshiFilterProps>> = ({
  eventType,
  collectionAddress,
  nftActivityFilters,
}) => {
  const { t } = useTranslation()
  const { addActivityTypeFilters, removeActivityTypeFilters } = useNftStorage()

  const isEventSelected = nftActivityFilters.typeFilters.some((nftActivityFilter) => nftActivityFilter === eventType)

  const handleMenuClick = () => {
    if (!isEventSelected) {
      addActivityTypeFilters({ collection: collectionAddress, field: eventType })
    }
  }

  const handleClearItem = () => {
    removeActivityTypeFilters({ collection: collectionAddress, field: eventType })
  }

  return (
    <Flex alignItems="center" mr="4px" mb="4px">
      <Box>
        <TriggerButton
          onClick={handleMenuClick}
          variant={isEventSelected ? 'subtle' : 'light'}
          scale="sm"
          hasItem={isEventSelected}
        >
          {eventName(t, eventType)}
        </TriggerButton>
      </Box>
      {isEventSelected && (
        <CloseButton variant={isEventSelected ? 'subtle' : 'light'} scale="sm" onClick={handleClearItem}>
          <CloseIcon color="warning" width="18px" />
        </CloseButton>
      )}
    </Flex>
  )
}
