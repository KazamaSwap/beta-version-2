import styled from 'styled-components'
import { Text, TextProps, Skeleton } from '@kazamaswap/uikit'
import { useMemo } from 'react'
import CountUp from 'react-countup'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import _toNumber from 'lodash/toNumber'
import _isNaN from 'lodash/isNaN'
import _replace from 'lodash/replace'
import _toString from 'lodash/toString'
import * as S from './Styled'

const Header = styled(S.StyledHeading)`
font-size: 18px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 18px;
    min-height: auto;
  }
`

const HeaderGold = styled(S.StyledHeadingGold)`
  font-size: 24px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
    min-height: auto;
  }
`

interface PrizeBalanceSmallProps extends TextProps {
  value: number
  decimals?: number
  unit?: string
  isDisabled?: boolean
  prefix?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const PrizeBalanceSmall: React.FC<React.PropsWithChildren<PrizeBalanceSmallProps>> = ({
  value,
  color = 'text',
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  onClick,
  ...props
}) => {
  const prefixProp = useMemo(() => (prefix ? { prefix } : {}), [prefix])
  const suffixProp = useMemo(() => (unit ? { suffix: unit } : {}), [unit])

  return (
    <CountUp
      start={0}
      preserveValue
      delay={0}
      end={value}
      {...prefixProp}
      {...suffixProp}
      decimals={decimals}
      duration={1}
      separator=","
    >
      {({ countUpRef }) => (
        <Text color={isDisabled ? 'textDisabled' : color} onClick={onClick} {...props}>
          <Header>
          <span ref={countUpRef} />
          </Header>
        </Text>
      )}
    </CountUp>
  )
}

export const PrizeBalanceSmallWithLoading: React.FC<
  React.PropsWithChildren<Omit<PrizeBalanceSmallProps, 'value'> & { value: string | number }>
> = ({ value, fontSize, ...props }) => {
  const isValueUndefinedOrNull = useMemo(() => isUndefinedOrNull(value), [value])
  const finalValue = useMemo(() => {
    if (isValueUndefinedOrNull) return null
    const trimmedValue = _replace(_toString(value), /,/g, '')

    return _isNaN(trimmedValue) || _isNaN(_toNumber(trimmedValue)) ? 0 : _toNumber(trimmedValue)
  }, [value, isValueUndefinedOrNull])

  if (isValueUndefinedOrNull) {
    return <Skeleton />
  }
  return <Header><PrizeBalanceSmall {...props} value={finalValue} fontSize={fontSize} /></Header>
}

export default PrizeBalanceSmall
