import styled from 'styled-components'
import {
  CardBody,
  Heading,
  Flex,
  Skeleton,
  Text,
  Box,
  Button,
  useModal,
  CardRibbon,
  BunnyPlaceholderIcon,
  useMatchBreakpoints,
} from '@kazamaswap/uikit'
import { LotteryRound } from 'state/types'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@kazamaswap/localization'
import WidgetNumbers from '../WidgetNumbers'
import ViewTicketsModal from '../ViewTicketsModal'

const StyledCardBody = styled(CardBody)`

  padding: 20px 100px 25px 100px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));

  ${({ theme }) => theme.mediaQueries.md} {
    grid-row-gap: 36px;
    grid-template-columns: auto 1fr;
  }
`

const PreviousRoundCardBody: React.FC<
  React.PropsWithChildren<{ lotteryNodeData: LotteryRound; lotteryId: string }>
> = ({ lotteryNodeData, lotteryId }) => {
  const { t } = useTranslation()
  const {
    currentLotteryId,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl

  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const isLatestRound = mostRecentFinishedRoundId.toString() === lotteryId

  const [onPresentViewTicketsModal] = useModal(
    <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryNodeData?.status} />,
  )

  const totalTicketNumber = userDataForRound ? userDataForRound.totalTickets : 0
  const ticketRoundText =
    totalTicketNumber > 1
      ? t('You had %amount% tickets this round', { amount: totalTicketNumber })
      : t('You had %amount% ticket this round', { amount: totalTicketNumber })
  const [youHadText, ticketsThisRoundText] = ticketRoundText.split(totalTicketNumber.toString())

  return (
    <StyledCardBody>
      {isLatestRound}
      <Grid>
        <Flex maxWidth={['240px', null, null, '100%']} justifyContent={['center', null, null, 'flex-start']}>
          {lotteryId ? ( lotteryNodeData?.finalNumber ? (
              <>
              <WidgetNumbers
              rotateText={isLargerScreen || false}
              number={lotteryNodeData?.finalNumber.toString()}
              size="100%"
              fontSize={isLargerScreen ? '32px' : '16px'} />
              </>
            ) : (
          <Flex />
            )
          ) : (
            <>
              <Flex flexDirection="column" alignItems="center" width={['240px', null, null, '480px']}>
                <Text mb="8px">{t('Please specify Round')}</Text>
              </Flex>
            </>
          )}
        </Flex>
      </Grid>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody