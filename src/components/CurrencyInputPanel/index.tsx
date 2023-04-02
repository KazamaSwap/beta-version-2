import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice';
import styled, { css } from 'styled-components';
import { isAddress } from 'utils';
import { formatNumber } from 'utils/formatBalance';
import { formatAmount } from 'utils/formatInfoNumbers';

import { useTranslation } from '@kazamaswap/localization';
import { Currency, Pair } from '@kazamaswap/sdk';
import { WrappedTokenInfo } from '@kazamaswap/tokens';
import { Box, Button, ChevronDownIcon, Flex, Text, useModal } from '@kazamaswap/uikit';

import { useCurrencyBalance } from '../../state/wallet/hooks';
import AddToWalletButton from '../AddToWallet/AddToWalletButton';
import { CopyButton } from '../CopyButton';
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';
import { Input as NumericalInput } from './NumericalInput';

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  outline: none;
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ zapStyle?: ZapStyle }>`
  padding: 0 0.5rem;
  background: transparent !important;
  border: 0px !important;

  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      background: ${theme.colors.background};
      border: 1px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '0px' : '8px'} 8px 0px 0px;
      height: auto;
    `};
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  outline: none;
  border: 0px solid transparent !important;
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  z-index: 1;
  outline: none;
  border: 0;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean }>`
  border-radius: 16px;
  box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
  ${({ zapStyle }) =>
    !!zapStyle &&
    css`
      border-radius: 0px 16px 16px 16px;
    `};
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

const StyledInputWrapper = styled.div`
padding: 5px;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
`

const StyledInputBox = styled.div`
padding: 0.75rem;
background: #141824;
border-radius: 9px;
width: 65%;
`

const StyledNumericalInput = styled(NumericalInput)`
background: transparent;
width: 100%;
border-radius: 7px;
border: 0px solid transparent !important;
`



type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showBUSD?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  disabled,
  error,
  showBUSD,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()

  const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null

  const amountInDollar = useBUSDCurrencyAmount(
    showBUSD ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
  )

  return (
    <Box position="relative" id={id}>
        <StyledInputWrapper>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <div style={{display: "flex", alignItems: "center"}}>
            <CurrencySelectButton
            zapStyle={zapStyle}
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="32px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <>
                <Flex flexDirection="column">
                  <Flex>
                  <Text fontSize="11px" fontFamily="Inter, sans-serif" style={{textTransform: "none", color: "#93acd3"}}>Input</Text>
                  </Flex>
                  <Flex>
                  <Text id="pair" fontSize="16px" bold>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                      currency.symbol.length - 5,
                      currency.symbol.length
                    )}`
                    : currency?.symbol) || t('Select a currency')}
                </Text>
                {!disableCurrencySelect && <ChevronDownIcon ml="3px" />}
                  </Flex>
                </Flex>
               </>
              )}
            </Flex>
          </CurrencySelectButton>
            </div>
              <StyledInputBox>
               {account && (
          <Text
            onClick={!disabled && onMax}
            color="#93acd3"
            fontSize="12px"
            style={{ display: 'inline', cursor: 'pointer', left: '0' }}
          >
            {!hideBalance && !!currency
              ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
              : ' -'}
          </Text>
        )} 
        <div style={{display: "flex", flexDirection: "row"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          {account && currency && !disabled && showMaxButton && label !== 'To' && (
              <Button onClick={onMax} scale="xs" variant="secondary" style={{ textTransform: 'uppercase', borderColor: '#323c5c', color: '#323c5c', marginTop: "1px", marginRight: "8px" }}>
                {t('Max')}
              </Button>
            )}
          </div>
          <div>
            <StyledNumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
          </div>
        </div>
            {/* <InputPanel>
            {showBUSD && Number.isFinite(amountInDollar) && (
              <Text fontSize="12px" fontFamily="Inter, sans-serif" color="textSubtle" mr="12px">
                ${formatNumber(amountInDollar)} USD
              </Text>
            )}
        {disabled && <Overlay />}
      </InputPanel> */}
      </StyledInputBox>
            </div>
          </StyledInputWrapper>
    </Box>
  )
}
