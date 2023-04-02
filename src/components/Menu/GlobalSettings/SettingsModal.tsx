import { SUPPORT_ZAP } from 'config/constants/supportChains';
import { useActiveChainId } from 'hooks/useActiveChainId';
import useTheme from 'hooks/useTheme';
import { useCallback, useState } from 'react';
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers';
import {
    useAudioModeManager, useExpertModeManager, useSubgraphHealthIndicatorManager,
    useUserExpertModeAcknowledgementShow, useUserSingleHopOnly, useZapModeManager
} from 'state/user/hooks';
import styled from 'styled-components';

import { useTranslation } from '@kazamaswap/localization';
import { ChainId } from '@kazamaswap/sdk';
import {
    Box, Flex, InjectedModalProps, PancakeToggle, SwapSettingsModal, Text, ThemeSwitcher, Toggle
} from '@kazamaswap/uikit';

import QuestionHelper from '../../QuestionHelper';
import ExpertModal from './ExpertModal';
import GasSettings from './GasSettings';
import TransactionSettings from './TransactionSettings';
import { SettingsMode } from './types';

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 20px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const StyledToggle = styled(Toggle)`
  background-color: red !important;
`

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 80vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

const InfoWrapper = styled.div`
padding: 0.75rem;
    border-radius: 14px;
    border: 1px solid #1b2031;
    margin-top: 3px;
    width: 100%;
`

const MiscWrapper = styled.div`
padding: 0.75rem;
    border-radius: 14px;
    border: 1px solid #1b2031;
    margin-top: 3px;
    width: 100%;
    margin-bottom: 14px;
`

export const withCustomOnDismiss =
  (Component) =>
  ({
    onDismiss,
    customOnDismiss,
    mode,
    ...props
  }: {
    onDismiss?: () => void
    customOnDismiss: () => void
    mode: SettingsMode
  }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} mode={mode} onDismiss={handleDismiss} />
  }

const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss, mode }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  const [zapMode, toggleZapMode] = useState(false)
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const { onChangeRecipient } = useSwapActionHandlers()
  const { chainId } = useActiveChainId()

  const { t } = useTranslation()
  const { isDark, setTheme } = useTheme()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else {
      onChangeRecipient(null)
      toggleExpertMode()
    }
  }

  return (
    <SwapSettingsModal
      title={t('Settings')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ maxWidth: '420px' }}
    >
      <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex pb="24px" flexDirection="column">
              <Text bold textTransform="uppercase" fontSize="18px" color="secondary" mb="14px">
                {t('Global')}
              </Text>
              {/* <Flex justifyContent="space-between" mb="24px">
                <Text>{t('Dark mode')}</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </Flex>
              {/* <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text>{t('Subgraph Health Indicator')}</Text>
                  <QuestionHelper
                    text={t(
                      'Turn on NFT market subgraph health indicator all the time. Default is to show the indicator only when the network is delayed',
                    )}
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="toggle-subgraph-health-button"
                  checked={subgraphHealth}
                  scale="md"
                  onChange={() => {
                    setSubgraphHealth(!subgraphHealth)
                  }}
                />
              </Flex> */}
              <GasSettings />
            </Flex>
          </>
        )}
        {mode === SettingsMode.SWAP_LIQUIDITY && (
          <>
            <Flex pt="3px" flexDirection="column">
              <Flex justifyContent="space-between" alignItems="center" mb="14px">
                {chainId === ChainId.BSC || ChainId.BSC_TESTNET && <GasSettings />}
              </Flex>
              <TransactionSettings />
            </Flex>
            {/* <MiscWrapper>
            {SUPPORT_ZAP.includes(chainId) && (
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center">
                  <Text>{t('Zap (Beta)')}</Text>
                  <QuestionHelper
                    text={
                      <Box>
                        <Text>
                          {t(
                            'Zap enables simple liquidity provision. Add liquidity with one token and one click, without manual swapping or token balancing.',
                          )}
                        </Text>
                        <Text>
                          {t(
                            'If you experience any issue when adding or removing liquidity, please disable Zap and retry.',
                          )}
                        </Text>
                      </Box>
                    }
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <StyledToggle
                  checked={zapMode}
                  scale="sm"
                  onChange={() => {
                  toggleZapMode(!zapMode)
                  }}
                />
              </Flex>
            )}
            </MiscWrapper> */}

            {/* <MiscWrapper>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <Text>{t('Expert Mode')}</Text>
                <QuestionHelper
                  text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-expert-mode-button"
                scale="sm"
                checked={expertMode}
                onChange={handleExpertModeToggle}
              />
            </Flex>
            </MiscWrapper> */}

            <MiscWrapper>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <Text>{t('Disable Multihops')}</Text>
                <QuestionHelper text={t('Restricts swaps to direct pairs only.')} placement="top-start" ml="4px" />
              </Flex>
              <Toggle
                id="toggle-disable-multihop-button"
                checked={singleHopOnly}
                scale="sm"
                onChange={() => {
                  setSingleHopOnly(!singleHopOnly)
                }}
              />
            </Flex>
            </MiscWrapper>
            {/* <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text>{t('Flippy sounds')}</Text>
                <QuestionHelper
                  text={t('Fun sounds to make a truly immersive pancake-flipping trading experience')}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <PancakeToggle checked={audioPlay} onChange={toggleSetAudioMode} scale="md" />
            </Flex> */}
          </>
        )}
      </ScrollableContainer>
    </SwapSettingsModal>
  )
}

export default SettingsModal
