import styled from 'styled-components'
import { Flex, Heading, Skeleton } from '@kazamaswap/uikit'
import getTimePeriods from 'utils/getTimePeriods'
import Timer from './Timer'
import useNextEventCountdown from '../../hooks/useNextEventCountdown'

const StyledTimerText = styled(Heading)`
   Color: #F4EEFF;
`

interface CountdownProps {
  nextEventTime: number
  preCountdownText?: string
  postCountdownText?: string
}

const Countdown: React.FC<React.PropsWithChildren<CountdownProps>> = ({
  nextEventTime,
  preCountdownText,
  postCountdownText,
}) => {
  const secondsRemaining = useNextEventCountdown(nextEventTime)
  const { days, hours, minutes, seconds, milliseconds } = getTimePeriods(secondsRemaining)

  return (
    <>
      {secondsRemaining ? (
        <Flex display="inline-flex" justifyContent="flex-end" alignItems="flex-end">
          {preCountdownText && (
            <Heading mr="12px" color="#ffff">
              {preCountdownText}
            </Heading>
          )}
          <Timer
            milliseconds={milliseconds}
            seconds={seconds}
            minutes={minutes + 1} // We don't show seconds - so values from 0 - 59s should be shown as 1 min
            hours={hours}
            days={days}
          />
          {postCountdownText}
        </Flex>
      ) : (
        <StyledTimerText>
          0d : 0h : 0m : 0s
        </StyledTimerText>       
      )}
    </>
  )
}

export default Countdown
