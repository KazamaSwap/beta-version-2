import styled from 'styled-components'
import { useTranslation } from '@kazamaswap/localization'
import { ChainId } from '@kazamaswap/sdk'
import { ArrowForwardIcon, Button, Grid, Message, MessageText, Modal, Text } from '@kazamaswap/uikit'
import { FlexGap } from 'components/Layout/Flex'
import { ChainLogo } from 'components/Logo/ChainLogo'
import useAuth from 'hooks/useAuth'
import { useSessionChainId } from 'hooks/useSessionChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/future/image'
import { Chain, useAccount, useNetwork } from 'wagmi'
import Dots from '../Loader/Dots'

export const KazamaTextButton = styled(Button)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

// Where page network is not equal to wallet network
export function WrongNetworkModal({ currentChain, onDismiss }: { currentChain: Chain; onDismiss: () => void }) {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { logout } = useAuth()
  const { isConnected } = useAccount()
  const [, setSessionChainId] = useSessionChainId()
  const chainId = currentChain.id || ChainId.BSC_TESTNET
  const { t } = useTranslation()

  const switchText = t('Switch to BNB Testnet')

  return (
    <Modal title={t('Wrong network detected')} headerBackground="gradients.cardHeader" onDismiss={onDismiss}>
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>{t('The platform is currently active on the Binance Smart Chain Testnet')}</Text>
        <Text small>
          {t('It looks like your wallet is not connected to the right network at the moment. Change your network to the Binance Smart Chain Test network to use the platform, or disconnect your wallet.', { network: chain?.name ?? '' })}
        </Text>
        <Message variant="warning" icon={false} p="8px 12px">
          <MessageText>
            <FlexGap gap="12px">
              <FlexGap gap="6px">
                <ChainLogo chainId={chain?.id} /> <ArrowForwardIcon color="#D67E0A" />
                <ChainLogo chainId={chainId} />
              </FlexGap>
              <span>{t('Switch network to continue.')}</span>
            </FlexGap>
          </MessageText>
        </Message>
        {canSwitch && (
          <KazamaTextButton isLoading={isLoading} onClick={() => switchNetworkAsync(chainId)}>
          {switchText}
          </KazamaTextButton>
        )}
        {isConnected && (
          <KazamaTextButton
            onClick={() => switchNetworkAsync(ChainId.BSC_TESTNET)}
            variant="secondary"
          >
            {t('Disconnect Wallet')}
          </KazamaTextButton>
        )}
      </Grid>
    </Modal>
  )
}
