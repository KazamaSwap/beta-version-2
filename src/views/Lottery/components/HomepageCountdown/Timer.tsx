import styled from 'styled-components'
import { Flex, Heading } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import * as S from './Styled'

export const StyledSubheading = styled(Heading)`
  font-size: 20px;
  color: white;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 24px;
    &.lottery {
      font-size: 20px;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    -webkit-text-stroke: unset;
  }
  margin-bottom: 8px;
`

export interface TimerProps {
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
  wrapperClassName?: string
}

const StyledTimerFlex = styled(Flex)<{ showTooltip?: boolean }>`
  ${({ theme, showTooltip }) => (showTooltip ? ` border-bottom: 1px dashed ${theme.colors.textSubtle};` : ``)}
  div:last-of-type {
    margin-right: 0;
  }
`

const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradients.white};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

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

const Wrapper: React.FC<React.PropsWithChildren<TimerProps>> = ({
  minutes,
  hours,
  days,
  seconds,
  wrapperClassName,
}) => {
  const { t } = useTranslation()

  return (
    <TimerWrapper>
    <StyledTimerFlex alignItems="flex-end" className={wrapperClassName}>
      {Boolean(days) && (
        <>
          <StyledTimerText mb="-4px" scale="xl" mr="4px">
            {days}
          </StyledTimerText>
          <StyledTimerText mr="12px">{t('d')}</StyledTimerText>
        </>
      )}
      {Boolean(hours) && (
        <>
          <StyledTimerText mb="-4px" scale="xl" mr="4px">
            {hours}
          </StyledTimerText>
          <StyledTimerText mr="12px">{t('h')}</StyledTimerText>
        </>
      )}
      {Boolean(minutes) && (
        <>
          <StyledTimerText mb="-4px" scale="xl" mr="4px">
            {minutes}
          </StyledTimerText>
          <StyledTimerText mr="12px">{t('m')}</StyledTimerText>
        </>
      )}
      {Boolean(seconds) && (
        <>
          <StyledTimerText mb="-4px" scale="xl" mr="4px">
            {seconds}
          </StyledTimerText>
          <StyledTimerText mr="12px">{t('s')}</StyledTimerText>
        </>
      )}
    </StyledTimerFlex>
    </TimerWrapper>
  )
}

export default Wrapper