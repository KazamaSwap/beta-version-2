import { useState } from 'react'
import styled from 'styled-components'
import {
  Heading,
  Flex,
  Skeleton,
  Text,
  Button,
  useModal,
  useMatchBreakpoints,
  ExpandableLabel,
  CardHeader,
  CurrentRoundFooter,
  useIsomorphicEffect
} from '@kazamaswap/uikit'
import useSWR from 'swr'
import { useWeb3React } from '@kazamaswap/wagmi'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@kazamaswap/localization'
import { LotteryResponse, LotteryRoundGraphEntity } from 'state/types'
import { useGetLotteryGraphDataById, useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import PrizeBalance from 'components/PrizeBalance'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import { dateTimeOptions } from 'views/Lottery/helpers'
import getTimePeriods from 'utils/getTimePeriods'
import Timer from 'views/Lottery/components/Countdown/Timer'
import useGetNextLotteryEvent from 'views/Lottery/hooks/useGetNextLotteryEvent'
import useNextEventCountdown from 'views/Home/components/Banners/hooks/useNextEventCountdown'
import RewardBrackets from 'views/Lottery/components/RewardBrackets'
import Countdown from 'views/Lottery/components/Countdown'
import ViewTicketsModal from '../ViewTicketsModal'
import CellLayout from './CellLayout'
import * as S from './Styled'

const Header = styled(S.StyledHeading)`
  font-size: 24px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 32px;
    min-height: auto;
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

const Container = styled.div`
  width: 100%;
  background-image: linear-gradient(#1B1A23,#292734);
  border-radius: 16px;
  margin: 0px 0px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const StyledCardFooter = styled(CurrentRoundFooter)`
  z-index: 2;
  background: none;
  border-bottom: 2px ${({ theme }) => theme.colors.cardBorder} solid;
  border-radius: 0px 0px 15px 15px;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;


  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const CellInner = styled.div`
  padding: 16px 0px;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  padding-right: 8px;
`

const RoundIdCell = styled(CellInner)`
  width: 100px;
  & > h2 {
    font-size: 16px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 190px;
  }
`

const WinningNumbersCell = styled(CellInner)`
  width: 180px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 220px;
  }
`

const ActionCell = styled(CellInner)`
  width: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 80px;
  }
`

const StyledTr = styled.tr`
  padding: 0px 16px;
  cursor: pointer;
  max-width: 100%;
  &:not(:last-child) {
    border-bottom: 1px solid #1B1A23;
  }
  &:hover {
    background-color: #252431;
    overflow: hidden;
  }
`

const StyledCardHeader = styled(CardHeader)`
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const NextDrawWrapper = styled.div`
  background: #292734;
  padding: 24px;
`

const StyledTimerText = styled(Heading)`
   Color: #F4EEFF;
`

const PrizeText = styled(S.StyledHeading)`
  font-size: 20px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
    min-height: auto;
  }
`

const InfoText = styled(S.StyledHeading)`
  font-size: 20px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 52px;
    min-height: auto;
  }
`

const LotteryCountDownTimer = () => {
  const { data } = useSWR<LotteryResponse>(['currentLottery'])
  const endTimeAsInt = parseInt(data.endTime, 10)
  const { nextEventTime } = useGetNextLotteryEvent(endTimeAsInt, data.status)
  const secondsRemaining = useNextEventCountdown(nextEventTime)
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining)
  if (isLotteryLive(data.status))
    return <Timer wrapperClassName="custom-timer" seconds={seconds} minutes={minutes} hours={hours} days={days} />
  return null
}

const isLotteryLive = (status: LotteryStatus) => status === LotteryStatus.OPEN

const UsdPrize = () => {
  const { t, currentLanguage: { locale }, } = useTranslation()
  const { account } = useWeb3React()
  const { currentLotteryId, isTransitioning, currentRound, currentRound: {priceTicketInKazama} } = useLottery()
  const { endTime, amountCollectedInKazama, userTickets, status } = currentRound
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} roundStatus={status} />)
  const [isExpanded, setIsExpanded] = useState(false)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning
  const lotteryGraphDataFromState = useGetLotteryGraphDataById(currentLotteryId)
  const [fetchedLotteryGraphData, setFetchedLotteryGraphData] = useState<LotteryRoundGraphEntity>()
  const kazamaPriceBusd = usePriceKazamaBusd()
  const ticketPrice = priceTicketInKazama
  const ticketPriceBusd = priceTicketInKazama.times(kazamaPriceBusd)
  const prizeInBusd = amountCollectedInKazama.times(kazamaPriceBusd)
  const endTimeMs = parseInt(endTime, 10) * 1000
  const endDate = new Date(endTimeMs)
  const isLotteryOpen = status === LotteryStatus.OPEN
  const userTicketCount = userTickets?.tickets?.length || 0
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)


  const HEADING_ONE_LINE_HEIGHT = 27


  const getPrizeBalances = () => {
    if (status === LotteryStatus.CLOSE || status === LotteryStatus.CLAIMABLE) {
      return (
        <Heading scale="xl" color="secondary" textAlign={['center', null, null, 'left']}>
          {t('Calculating')}...
        </Heading>
      )
    }
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={160} />
        ) : (
          <PrizeBalance
            fontSize="40px"
            color="secondary"
            textAlign={['center', null, null, 'left']}
            lineHeight="1"
            bold
            prefix="~$"
            value={getBalanceNumber(prizeInBusd)}
            decimals={0}
          />
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <PrizeBalance
            fontSize="14px"
            color="textSubtle"
            textAlign={['center', null, null, 'left']}
            unit=" KAZAMA"
            value={getBalanceNumber(amountCollectedInKazama)}
            decimals={0}
          />
        )}
      </>
    )
  }

  const getNextDrawId = () => {
    if (status === LotteryStatus.OPEN) {
      return `${currentLotteryId}`
    }
    if (status === LotteryStatus.PENDING) {
      return ''
    }
    return parseInt(currentLotteryId, 10)
  }

  const getNextDrawDateTime = () => {
    if (status === LotteryStatus.OPEN) {
      return `${t('Draw')}: ${endDate.toLocaleString(locale, dateTimeOptions)}`
    }
    return ''
  }

    return (
      <>
                      {prizeInBusd.isNaN() ? (
          <><InfoText width={['160px', '160px', 'auto']}>{t('$0,00')}</InfoText><PrizeText>
            IN KAZAMA PRIZES!
          </PrizeText></>
                      ) : (
                        <>
                        
                        <PrizeBalance
              fontSize="64px"
              color="text"
              unit=""
              prefix='$'
              value={getBalanceNumber(prizeInBusd)}
              decimals={0} />
              <PrizeText>
              IN KAZAMA PRIZES!
              </PrizeText>
              {/* <Header width={['160px', '160px', 'auto']}>{t('$5000')}</Header> */}
              </>
                      )}
      </>
    )
  }

export default UsdPrize
