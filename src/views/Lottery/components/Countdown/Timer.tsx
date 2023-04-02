import styled from 'styled-components'
import { Flex, Heading, Text, Box } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import * as S from './Styled'

export interface TimerProps {
  milliseconds?: number
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
  wrapperClassName?: string
}

const Header = styled(S.StyledHeading)`
  font-size: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
  }
`

const HeaderLower = styled(S.StyledHeadingLow)`
  font-size: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
  }
`

const TBox = styled(Box)`
  background: red;
  border-radius: 5px;
`

const StyledTimerFlex = styled(Flex)<{ showTooltip?: boolean }>`
  ${({ theme, showTooltip }) => (showTooltip ? ` border-bottom: 1px dashed ${theme.colors.textSubtle};` : ``)}
  div:last-of-type {
    margin-right: 0;
  }
`

const Wrapper: React.FC<React.PropsWithChildren<TimerProps>> = ({
  minutes,
  hours,
  days,
  seconds,
  milliseconds,
  wrapperClassName,
}) => {
  const { t } = useTranslation()

  return (
    <StyledTimerFlex alignItems="flex-end" className={wrapperClassName}>
      {Boolean(days) && (
        <>
          <Header>
            {days} :
          </Header>
          <HeaderLower mr="4px">{t('d ')} </HeaderLower>
        </>
      )}
      {Boolean(hours) && (
        <>
          <Header>
           {hours}
          </Header>
          <HeaderLower mr="4px">{t('h ')}</HeaderLower>
        </>
      )}
      {Boolean(minutes) && (
        <>
          <Header>
           : {minutes}
          </Header>
          <HeaderLower mr="4px">{t('m ')}</HeaderLower>
        </>
      )}
      {Boolean(seconds) && (
        <>
          <Header>
            : {seconds}
          </Header>
          <HeaderLower mr="4px">{t('s')}</HeaderLower>
        </>
      )}
    </StyledTimerFlex>
  )
}

export default Wrapper
