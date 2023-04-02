import { useMemo } from 'react'
import styled from 'styled-components'
import { Trade, TradeType, CurrencyAmount, Currency} from '@kazamaswap/sdk'
import { Button, Text, ErrorIcon, ArrowDownIcon, IconButton } from '@kazamaswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from '@kazamaswap/localization'
import { computeTradePriceBreakdown, warningSeverity, basisPointsToPercent } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from 'utils/truncateHash'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'

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

const StyledInputWrapper = styled.div`
padding-left: 0.75rem;
padding-right: 0.75rem;
padding-top: 17px;
padding-bottom: 17px;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
`

const StyledBottomWrapper = styled.div`
margin-top: -1.25rem;
padding-left: 0.75rem;
padding-right: 0.75rem;
padding-top: 17px;
padding-bottom: 17px;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
`

const StyledWrapper = styled.div`
border-radius: 50%;
background: #191e2e;
z-index: 100;
border: 1px solid #11141e;
`

export default function SwapModalHeader({
  trade,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  allowedSlippage,
}: {
  trade: Trade<Currency, Currency, TradeType>
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  isEnoughInputBalance: boolean
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
  allowedSlippage: number
}) {
  const { t } = useTranslation()

  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const inputTextColor =
    showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT && isEnoughInputBalance
      ? 'primary'
      : trade.tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance
      ? 'failure'
      : 'text'

  const amount =
    trade.tradeType === TradeType.EXACT_INPUT
      ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)
      : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)
  const symbol =
    trade.tradeType === TradeType.EXACT_INPUT ? trade.outputAmount.currency.symbol : trade.inputAmount.currency.symbol

  const tradeInfoText =
    trade.tradeType === TradeType.EXACT_INPUT
      ? t('Output is estimated. You will receive at least or the transaction will revert.')
      : t('Input is estimated. You will sell at most or the transaction will revert.')

  const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  return (
    <AutoColumn gap="md">
      <StyledInputWrapper>
      <RowBetween align="flex-end">
        <RowFixed gap="4px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="18px" style={{ marginRight: '12px' }} />
          <TruncatedText fontSize="18px" color={inputTextColor}>
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="18px" ml="10px">
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      </StyledInputWrapper>
      <div style={{ padding: '0 1rem', marginTop: '-2rem', marginBottom: '-1.75rem', textAlign: 'center' }}>
          <StyledSwitchButton variant="light" scale="sm">
          <ArrowDownIcon />
          </StyledSwitchButton>
        </div>
      <StyledBottomWrapper>
      <RowBetween align="flex-end">
        <RowFixed gap="4px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="18px" />
          <TruncatedText
            fontSize="18px"
            color={
              priceImpactSeverity > 2
                ? 'failure'
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? 'primary'
                : 'text'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed>
          <Text fontSize="18px" ml="10px">
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      </StyledBottomWrapper>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold> {t('Price Updated')}</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>{t('Accept')}</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '10px 0 0 0px' }}>
        {trade.tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance && (
          <Text small color="failure" textAlign="left" style={{ width: '100%' }}>
            {t('Insufficient input token balance. Your transaction may fail.')}
          </Text>
        )}
        <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
          {estimatedText}
          {transactionRevertText}
        </Text>
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            {recipientSentToText}
            <b title={recipient}>{truncatedRecipient}</b>
            {postSentToText}
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
