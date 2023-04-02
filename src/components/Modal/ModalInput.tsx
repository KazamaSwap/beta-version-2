import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link, IconButton, ArrowDownIcon } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { parseUnits } from '@ethersproject/units'
import { formatBigNumber } from 'utils/formatBalance'

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  decimals?: number
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
`

const StyledInput = styled(Input)`
background: transparent;
width: 100%;
border-radius: 7px;
border: 0px solid transparent !important;
outline: none;
box-shadow: none;
position: relative;
font-weight: 500;
outline: none;
border: none;
flex: 1 1 auto;
background-color: transparent;
font-size: 22px;
text-align: center;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
padding: 0px;
margin-bottom: 5px;
&:disabled {
  background-color: transparent;
  box-shadow: none;
  color: ${({ theme }) => theme.colors.textDisabled};
  cursor: not-allowed;
}

&:focus:not(:disabled) {
  box-shadow: none !important;
  }};

-webkit-appearance: textfield;

::-webkit-search-decoration {
  -webkit-appearance: none;
}

[type='number'] {
  -moz-appearance: textfield;
}

::-webkit-outer-spin-button,
::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

::placeholder {
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 22px;
}

::placeholder::focus {
  color: purple;
}

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const StyledInputWrapper = styled.div`
padding: 0.75rem;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-down {
    fill: #fff !important;
  }
  .icon-up-down {
    display: none;
    fill: #fff !important;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const StyledSwitchButton = styled(SwitchIconButton)`
border-radius: 50%;
background: #191e2e;
z-index: 100;
border: 1px solid #11141e;
`

const ModalInput: React.FC<React.PropsWithChildren<ModalInputProps>> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  decimals = 18,
}) => {
  const { t } = useTranslation()
  const isBalanceZero = max === '0' || !max

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return '0'
    }

    const balanceUnits = parseUnits(balance, decimals)
    return formatBigNumber(balanceUnits, decimals, decimals)
  }

  return (
    <div style={{ position: 'relative' }}>
        <Flex justifyContent="space-between" mb="3px">
          <Flex>
          <Text fontSize="15px">{t('Balance: %balance%', { balance: displayBalance(max) })}</Text>
          </Flex>
          <Flex>
      <Button scale="xs" variant="secondary" style={{color: "#fff"}} onClick={onSelectMax}>
            {t('Max')}
          </Button> 
          </Flex>
          {isBalanceZero && (
        <StyledErrorMessage fontSize="15px" color="failure">
          {t('No tokens to stake')}:{' '}
          <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
            {t('Get %symbol%', { symbol })}
          </Link>
        </StyledErrorMessage>
      )}
        </Flex>
        <StyledInputWrapper>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex alignItems="flex-end" justifyContent="space-around">
          <StyledInput
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="Enter amount"
            value={value}
          />
          {/* <Text fontSize="16px">{symbol}</Text> */}
        </Flex>
      </StyledTokenInput>
      </StyledInputWrapper>
    </div>
  )
}

export default ModalInput
