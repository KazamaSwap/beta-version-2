import { CommitButton } from 'components/CommitButton';
import ConnectWalletButton from 'components/ConnectWalletButton';
import CurrencyInput from 'components/CurrencyInputPanel/CurrencyInput';
import BottomSection from 'components/Layout/BottomSection';
import Container from 'components/Layout/Container';
import { PageMeta } from 'components/Layout/Page';
import TopSection from 'components/Layout/TopSection';
import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal';
import { SettingsMode } from 'components/Menu/GlobalSettings/types';
import PageSection from 'components/PageSection';
import SunburstSvg from 'components/Sunburst/SunburstSvg';
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter';
import { BIG_INT_ZERO } from 'config/constants/exchange';
import { useIsTransactionUnsupported } from 'hooks/Trades';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useProtocolChartData, useProtocolData, useProtocolTransactions } from 'state/info/hooks';
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters';
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers';
import styled from 'styled-components';
import { computeTradePriceBreakdown, warningSeverity } from 'utils/exchange';
import { maxAmountSpend } from 'utils/maxAmountSpend';
import shouldShowSwapWarning from 'utils/shouldShowSwapWarning';
import TopSliderBar from 'views/Home/components/TopSliderBar';
import TradingTokens from 'views/Home/components/TradingTokens';
import SwapTransactions from 'views/Info/components/InfoTables/SwapTransactions';
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable';
import TokensTopPage from 'views/Info/components/TokensTopPage';

import { useTranslation } from '@kazamaswap/localization';
import { ChainId, Currency, CurrencyAmount, Token, Trade, TradeType } from '@kazamaswap/sdk';
import {
    ArrowDownIcon, ArrowUpDownIcon, BottomDrawer, Box, Button, Flex, Heading, IconButton, Image,
    KazamaFrontCard, Skeleton, Text, useMatchBreakpoints, useModal
} from '@kazamaswap/uikit';

import { AppBody } from '../../components/App';
import { GreyCard } from '../../components/Card';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal';
import Column, { AutoColumn } from '../../components/Layout/Column';
import { AutoRow, RowBetween } from '../../components/Layout/Row';
import CircleLoader from '../../components/Loader/CircleLoader';
import { CommonBasesType } from '../../components/SearchModal/types';
import { useAllTokens, useCurrency } from '../../hooks/Tokens';
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback';
import { useSwapCallback } from '../../hooks/useSwapCallback';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import { Field } from '../../state/swap/actions';
import {
    useDefaultsFromURLSearch, useDerivedSwapInfo, useSingleTokenSwapInfo, useSwapState
} from '../../state/swap/hooks';
import {
    useExchangeChartManager, useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance
} from '../../state/user/hooks';
import { currencyId } from '../../utils/currencyId';
import replaceBrowserHistory from '../../utils/replaceBrowserHistory';
import SwapPage from '../Page';
import AddressInputPanel from './components/AddressInputPanel';
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown';
import PriceChartContainer from './components/Chart/PriceChartContainer';
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee';
import ConfirmSwapModal from './components/ConfirmSwapModal';
import CurrencyInputHeader from './components/CurrencyInputHeader';
import ProgressSteps from './components/ProgressSteps';
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds';
import SwapWarningModal from './components/SwapWarningModal';
import TradePrice from './components/TradePrice';
import CompositeImage from './CompositeImage';
import useRefreshBlockNumberID from './hooks/useRefreshBlockNumber';
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles';

const BgWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const StyledSunburst = styled(SunburstSvg)`
  height: 350%;
  width: 350%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 600%;
    width: 600%;
  }
`

export const KazamaTextSmall = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 30px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.65px; 
   font-weight: 400;
`

export const KazamaTextBig = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 2.00px; 
   font-weight: 400;
`

export const ImageWrapper = styled(Image)`
  z-index: 4;
  margin-bottom: 75px;
  margin-right: 75px;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const TopWrapper = styled(Flex)`
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 150px;
`

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
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

const MoonWrapper = styled(Container)`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    visibility: visible;
  }
`

const SwapUpper = styled(KazamaFrontCard)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-110px);
  background: transparent;
  z-index: 1;
  margin-top: 200px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-335px);
  }
`

const TokenContent = styled(KazamaFrontCard)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-110px);
  background: transparent;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-77px);
  }
`

const TopLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  top: 0;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const PolyBorder = styled.div`
filter: drop-shadow(1px 0px 0px #1B1A23)
drop-shadow(-1px 0px 0px #1B1A23)
drop-shadow(0px 0px 0px #1B1A23)
drop-shadow(0px -1px 0px #1B1A23)
drop-shadow(1px 0px 0px #1B1A23)
drop-shadow(-1px -1px 0px #1B1A23)
drop-shadow(-1px 2px 0px #1B1A23)
drop-shadow(1px -1px 0px #1B1A23);
`

const StyledSwitchButton = styled(SwitchIconButton)`
border-radius: 50%;
background: #191e2e;
z-index: 100;
border: 1px solid #11141e;

`

const StyledInputWrapper = styled.div`
padding: 0.75rem;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
`

const DetailsWrapper = styled.div`
margin-top: 3px;
margin-bottom: 5px;
padding: 0.75rem;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
`

const PolyShadow = styled.div`
  filter: drop-shadow(0 15px 30px rgba(32, 28, 41, 0.938));
`

const topLeftImage = {
  path: '/images/home/KazamaMoon/',
  attributes: [
    { src: '1-left', alt: 'Kazama Moon' },
  ],
}



const CHART_SUPPORT_CHAIN_IDS = [ChainId.BSC, ChainId.BSC_TESTNET]

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

export default function Swap() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [isChartExpanded, setIsChartExpanded] = useState(false)
   const [userChartPreference, setUserChartPreference] = useState(false)
  // const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const [protocolData] = useProtocolData()
  const [chartData] = useProtocolChartData()
  const [transactions] = useProtocolTransactions()


  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  const { account, chainId } = useActiveWeb3React()

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens) && token.chainId === chainId
    })

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(BIG_INT_ZERO),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, chainId)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />, false)

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      const showSwapWarning = shouldShowSwapWarning(currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }

      replaceBrowserHistory('inputCurrency', currencyId(currencyInput))
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      const showSwapWarning = shouldShowSwapWarning(currencyOutput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyOutput)
      } else {
        setSwapWarningCurrency(null)
      }

      replaceBrowserHistory('outputCurrency', currencyId(currencyOutput))
    },

    [onCurrencySelection],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/swap')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      currencyBalances={currencyBalances}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
      openSettingModal={onPresentSettingsModal}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      setSwapState((state) => ({
        ...state,
        swapErrorMessage: undefined,
      }))
      onPresentConfirmModal()
    }
  }, [indirectlyOpenConfirmModalState, onPresentConfirmModal])

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  const isChartSupported = useMemo(
    () =>
      // avoid layout shift, by default showing
      !chainId || CHART_SUPPORT_CHAIN_IDS.includes(chainId),
    [chainId],
  )

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <><PageMeta />
        {/* <PolyShadow>
      <PolyBorder>

       <div>
        <div style={{background: 'linear-gradient(180deg,#201c29,rgba(34,33,39,0)), url("/images/casino-bg.png") no-repeat bottom', marginTop: "64px", padding: "0px 0px", backgroundSize: "cover",  position: "relative",
      clipPath: "polygon(0 0, 100% 0, 100% 20%, 100% 88%, 95% 100%, 5% 100%, 0 88%, 0% 20%)"}}>
        <TopSliderBar />
        <div className='slider-graphic slider-graphic-farm-1' />
           <div className='slider-graphic slider-graphic-3' /> 
        </div>
      </div>
      </PolyBorder>
      </PolyShadow> */}
     {/* <TokenContent>
    <TopSection>
    <TokensTopPage />
    </TopSection>
    </TokenContent> */}
    <Container>
    <SwapPage removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
    {/* <TradingTokens /> */}
        <Flex width="100%" justifyContent="center" position="relative">
          {!isMobile && isChartSupported && (
            <PriceChartContainer
              inputCurrencyId={inputCurrencyId}
              inputCurrency={currencies[Field.INPUT]}
              outputCurrencyId={outputCurrencyId}
              outputCurrency={currencies[Field.OUTPUT]}
              isChartExpanded={isChartExpanded}
              setIsChartExpanded={setIsChartExpanded}
              isChartDisplayed={isChartDisplayed}
              currentSwapPrice={singleTokenPrice} />
          )}
          {isChartSupported && (
            <BottomDrawer
              content={<PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
                outputCurrency={currencies[Field.OUTPUT]}
                isChartExpanded={isChartExpanded}
                setIsChartExpanded={setIsChartExpanded}
                isChartDisplayed={isChartDisplayed}
                currentSwapPrice={singleTokenPrice}
                isMobile />}
              isOpen={isChartDisplayed}
              setIsOpen={setIsChartDisplayed} />
          )}
          <Flex flexDirection="column">
            <StyledSwapContainer $isChartExpanded={isChartExpanded}>
              <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
                <AppBody>
                  <CurrencyInputHeader
                    title={t('')}
                    subtitle={t('')}
                    setIsChartDisplayed={setIsChartDisplayed}
                    isChartDisplayed={isChartDisplayed}
                    hasAmount={hasAmount}
                    onRefreshPrice={onRefreshPrice} />
                  <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
                  
                    <AutoColumn gap="3px">
                    <StyledInputWrapper>
                      <CurrencyInput
                        label={independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')}
                        value={formattedAmounts[Field.INPUT]}
                        showMaxButton={!atMaxAmountInput}
                        currency={currencies[Field.INPUT]}
                        onUserInput={handleTypeInput}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputSelect}
                        otherCurrency={currencies[Field.OUTPUT]}
                        id="swap-currency-input"
                        showCommonBases
                        commonBasesType={CommonBasesType.SWAP_LIMITORDER} />
                      </StyledInputWrapper>
                        <AutoRow justify={isExpertMode ? 'center' : 'center'} style={{ padding: '0 1rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
                          <StyledSwitchButton
                            variant="light"
                            scale="sm"
                            onClick={() => {
                              setApprovalSubmitted(false) // reset 2 step UI for approvals
                              onSwitchTokens()
                            } }
                          >
                            <ArrowDownIcon
                              className="icon-down"
                              color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'} />
                            <ArrowUpDownIcon
                              className="icon-up-down"
                              color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'} />
                          </StyledSwitchButton>
                          {/* {recipient === null && !showWrap && isExpertMode ? (
                            <Button variant="tertiary" scale="sm" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                              {t('+ Add a send (optional)')}
                            </Button>
                          ) : null} */}
                        </AutoRow>
                      <StyledInputWrapper>
                      <CurrencyInput
                        value={formattedAmounts[Field.OUTPUT]}
                        onUserInput={handleTypeOutput}
                        label={independentField === Field.INPUT ? t('To (estimated)') : t('To')}
                        showMaxButton={false}
                        currency={currencies[Field.OUTPUT]}
                        onCurrencySelect={handleOutputSelect}
                        otherCurrency={currencies[Field.INPUT]}
                        id="swap-currency-output"
                        showCommonBases
                        commonBasesType={CommonBasesType.SWAP_LIMITORDER} />
                       </StyledInputWrapper>
                       <DetailsWrapper>
                       <AdvancedSwapDetailsDropdown trade={trade} />
                       </DetailsWrapper>
                      {isExpertMode && recipient !== null && !showWrap ? (
                        <>
                          <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                            <ArrowWrapper clickable={false}>
                              <ArrowDownIcon width="16px" />
                            </ArrowWrapper>
                            <Button variant="tertiary" scale="sm" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                              {t('- Remove send')}
                            </Button>
                          </AutoRow>
                          <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                        </>
                      ) : null}
                    </AutoColumn>
                    <Box mt="0.25rem">
                      {swapIsUnsupported ? (
                        <Button width="100%" disabled>
                          {t('Unsupported Asset')}
                        </Button>
                      ) : !account ? (
                        <ConnectWalletButton width="100%" />
                      ) : showWrap ? (
                        <CommitButton width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                          {wrapInputError ??
                            (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                        </CommitButton>
                      ) : noRoute && userHasSpecifiedInputOutput ? (
                        <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
                          <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
                          {singleHopOnly && <Text color="textSubtle">{t('Try enabling multi-hop trades.')}</Text>}
                        </GreyCard>
                      ) : showApproveFlow ? (
                        <RowBetween>
                          <CommitButton
                            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                            onClick={approveCallback}
                            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                            width="48%"
                          >
                            {approval === ApprovalState.PENDING ? (
                              <AutoRow gap="6px" justify="center">
                                {t('Enabling')} <CircleLoader stroke="white" />
                              </AutoRow>
                            ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                              t('Enabled')
                            ) : (
                              t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                            )}
                          </CommitButton>
                          <CommitButton
                            variant={isValid && priceImpactSeverity > 2 ? 'warning' : 'primary'}
                            onClick={() => {
                              if (isExpertMode) {
                                handleSwap()
                              } else {
                                setSwapState({
                                  tradeToConfirm: trade,
                                  attemptingTxn: false,
                                  swapErrorMessage: undefined,
                                  txHash: undefined,
                                })
                                onPresentConfirmModal()
                              }
                            } }
                            width="48%"
                            id="swap-button"
                            disabled={!isValid ||
                              approval !== ApprovalState.APPROVED ||
                              (priceImpactSeverity > 3 && !isExpertMode)}
                          >
                            {priceImpactSeverity > 3 && !isExpertMode
                              ? t('Price Impact High')
                              : priceImpactSeverity > 2
                                ? t('Swap Anyway!')
                                : t('Swap Tokens')}
                          </CommitButton>
                        </RowBetween>
                      ) : (
                        <CommitButton
                          variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'warning' : 'primary'}
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                txHash: undefined,
                              })
                              onPresentConfirmModal()
                            }
                          } }
                          id="swap-button"
                          width="100%"
                          disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                        >
                          {swapInputError ||
                            (priceImpactSeverity > 3 && !isExpertMode
                              ? t('Price Impact Too High')
                              : priceImpactSeverity > 2
                                ? t('Swap Anyway!')
                                : t('Swap Tokens'))}
                        </CommitButton>
                      )}
                      {showApproveFlow && (
                        <Column style={{ marginTop: '1rem' }}>
                          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                        </Column>
                      )}
                      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                    </Box>
                  </Wrapper>
                </AppBody>
              </StyledInputCurrencyWrapper>
            </StyledSwapContainer>
          </Flex>
        </Flex>
        <Flex mt="20px">
         {/* <Heading scale="md" mt="20px" mb="15px">
        {t('Recent transactions')}
      </Heading>  */}
       {/* <TransactionTable transactions={transactions} />  */}
      </Flex>
      </SwapPage>
      </Container>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />

      </>
  )
}
