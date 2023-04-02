import { ArrowForwardIcon, Button, Heading, Skeleton, Text, useMatchBreakpoints } from '@kazamaswap/uikit'
import BigNumber from 'bignumber.js'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { FetchStatus, LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@kazamaswap/localization'
import Image from 'next/image'
import { memo } from 'react'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import { LotteryResponse } from 'state/types'
import styled from 'styled-components'
import useSWR from 'swr'
import { getBalanceNumber } from 'utils/formatBalance'
import getTimePeriods from 'utils/getTimePeriods'
import Timer from 'views/Lottery/components/Countdown/Timer'
import useGetNextLotteryEvent from 'views/Lottery/hooks/useGetNextLotteryEvent'
import useNextEventCountdown from './hooks/useNextEventCountdown'
import { lotteryImage, lotteryMobileImage } from './images'
import * as S from './Styled'

const TimerWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 16px;
  }
  margin-bottom: 8px;
  .custom-timer {
    background: url('/images/decorations/countdownBg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 0px 10px 7px;
    display: inline-flex;
    white-space: nowrap;
    transform: scale(0.88);
    transform-origin: top left;
  }
`

const StyledTimerText = styled(Heading)`
   Color: #F4EEFF;
`

const isLotteryLive = (status: LotteryStatus) => status === LotteryStatus.OPEN

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

const LotteryCountDown = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { data, status } = useSWR<LotteryResponse>(['currentLottery'])

  return (
    <S.Wrapper>
          {status === FetchStatus.Fetched && isLotteryLive(data.status) ? (
            <>
                <LotteryCountDownTimer />
            </>
          ) : (
            <>
             <StyledTimerText>00 : 00 : 00</StyledTimerText>
            </>
          )}
    </S.Wrapper>
  )
}

export default LotteryCountDown
