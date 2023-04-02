import { useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  Text,
  Skeleton,
  Button,
  useModal,
  Box,
  CardFooter,
  ExpandableLabel,
} from '@kazamaswap/uikit'
import { useWeb3React } from '@kazamaswap/wagmi'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@kazamaswap/localization'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import ViewTicketsModal from './ViewTicketsModal'
import BuyTicketsButton from './BuyTicketsButton'
import { dateTimeOptions } from '../helpers'
import RewardBrackets from './RewardBrackets'

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 32px;
    grid-template-columns: auto 1fr;
  }
`

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 520px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const NextDrawWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
`

const CurrentRoundTickets = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { account } = useWeb3React()
  const { currentLotteryId, isTransitioning, currentRound } = useLottery()
  const { endTime, amountCollectedInKazama, userTickets, status } = currentRound

  const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} roundStatus={status} />)
  const [isExpanded, setIsExpanded] = useState(false)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const kazamaPriceBusd = usePriceKazamaBusd()
  const prizeInBusd = amountCollectedInKazama.times(kazamaPriceBusd)
  const endTimeMs = parseInt(endTime, 10) * 1000
  const endDate = new Date(endTimeMs)
  const isLotteryOpen = status === LotteryStatus.OPEN
  const userTicketCount = userTickets?.tickets?.length || 0

  const ticketRoundText =
    userTicketCount > 1
      ? t('You have %amount% tickets', { amount: userTicketCount })
      : t('You have %amount% ticket', { amount: userTicketCount })
  const [youHaveText, ticketsThisRoundText] = ticketRoundText.split(userTicketCount.toString())

  return (
        <>
      <Flex flexDirection={['column', null, null, 'row']} alignItems={['center', null, null, 'flex-start']}>
        {isLotteryOpen && (
          <Flex
            flexDirection="column"
            mr={[null, null, null, '24px']}
            alignItems={['center', null, null, 'flex-start']}
          >
            {account && (
              <Flex justifyContent={['center', null, null, 'flex-start']}>
                <Text display="inline">{youHaveText} </Text>
                {!userTickets.isLoading ? (
                  <Balance value={userTicketCount} decimals={0} display="inline" bold mx="4px" />
                ) : (
                  <Skeleton mx="4px" height={20} width={40} />
                )}
                <Text display="inline"> {ticketsThisRoundText}</Text>
              </Flex>
            )}
            {!userTickets.isLoading && userTicketCount > 0 && (
              <Button
                onClick={onPresentViewTicketsModal}
                height="auto"
                width="fit-content"
                p="0"
                mb={['32px', null, null, '0']}
                variant="text"
                scale="sm"
              >
                {t('View your tickets')}
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default CurrentRoundTickets
