import { Button, Grid, Message, MessageText, Modal, Text } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useTranslation } from '@kazamaswap/localization'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import useAuth from 'hooks/useAuth'
import { useMenuItems } from 'components/Menu/hooks/useMenuItems'
import { useRouter } from 'next/router'
import { getActiveMenuItem, getActiveSubMenuItem } from 'components/Menu/utils'
import { useAccount, useNetwork } from 'wagmi'
import { useMemo } from 'react'
import { ChainId } from '@kazamaswap/sdk'
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

// Where chain is not supported or page not supported
export function UnsupportedNetworkModal() {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { chains } = useNetwork()
  const chainId = useLocalNetworkChain() || ChainId.BSC_TESTNET
  const { isConnected } = useAccount()
  const { logout } = useAuth()
  const { t } = useTranslation()
  const menuItems = useMenuItems()
  const { pathname } = useRouter()

  const title = useMemo(() => {
    const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
    const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

    return activeSubMenuItem?.label || activeMenuItem?.label
  }, [menuItems, pathname])

  const supportedMainnetChains = useMemo(() => chains.filter((chain) => !chain.testnet), [chains])

  return (
    <Modal title={t('Check your network')} hideCloseButton headerBackground="gradients.cardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="336px">
      <Text bold>{t('The platform is currently active on the Binance Smart Chain Test Network ..')}</Text>

{/* {image && (
  <Box mx="auto" my="8px" position="relative" width="100%" minHeight="250px">
    <Image src={image} alt="feature" fill style={{ objectFit: 'contain' }} unoptimized />
  </Box>
)} */}
<Text small>
  {t(
    'It looks like your wallet is not connected to the right network at the moment. Change your network to the Binance Smart Chain Test network to use the platform, or disconnect your wallet.',
  )}
</Text>
        {canSwitch && (
          <KazamaTextButton isLoading={isLoading} onClick={() => switchNetworkAsync(chainId)}>
            {isLoading ? t('Switch network in wallet') : t('Switch network in wallet')}
          </KazamaTextButton>
        )}
        {isConnected && (
          <KazamaTextButton variant="secondary" onClick={logout}>
            {t('Disconnect Wallet')}
          </KazamaTextButton>
        )}
      </Grid>
    </Modal>
  )
}
