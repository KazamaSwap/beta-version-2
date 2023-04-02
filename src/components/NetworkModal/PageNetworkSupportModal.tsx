import { useMenuItems } from 'components/Menu/hooks/useMenuItems';
import { getActiveMenuItem, getActiveSubMenuItem } from 'components/Menu/utils';
import { useHistory } from 'contexts/HistoryContext';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useAuth from 'hooks/useAuth';
import { useSwitchNetwork } from 'hooks/useSwitchNetwork';
import Image from 'next/future/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import styled from 'styled-components';
import { chains } from 'utils/wagmi';

import { useTranslation } from '@kazamaswap/localization';
import { ChainId } from '@kazamaswap/sdk';
import { Box, Button, CardFooter, Grid, Modal, Text } from '@kazamaswap/uikit';

export const KazamaTextButton = styled(Button)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

export function PageNetworkSupportModal() {
  const { t } = useTranslation()
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { chainId, isConnected } = useActiveWeb3React()
  const { logout } = useAuth()

  const foundChain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])
  const historyManager = useHistory()

  const lastValidPath = historyManager?.history?.find((h) => ['/swap', 'liquidity', '/'].includes(h))

  const menuItems = useMenuItems()
  const { pathname, push } = useRouter()

  const { title, image } = useMemo(() => {
    const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
    const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

    return {
      title: activeSubMenuItem?.disabled ? activeSubMenuItem?.label : activeMenuItem?.label,
      image: activeSubMenuItem?.image || activeMenuItem?.image,
    }
  }, [menuItems, pathname])

  return (
    <Modal title="Network">
      <Grid style={{ gap: '16px' }} maxWidth="360px">
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
          <KazamaTextButton
            variant={foundChain && lastValidPath ? 'primary' : 'primary'}
            isLoading={isLoading}
            onClick={() => switchNetworkAsync(ChainId.BSC_TESTNET)}
          >
            {t('Switch to %chain%', { chain: 'Test Network' })}
          </KazamaTextButton>
        )}
        {isConnected && (
          <KazamaTextButton
            variant="secondary"
            onClick={() =>
              logout().then(() => {
                push('/')
              })
            }
          >
            {t('Disconnect Wallet')}
          </KazamaTextButton>
//        )}
//        {foundChain && lastValidPath && (
//          <NextLink href={lastValidPath} passHref>
//            <Button as="a">{t('Stay on %chain%', { chain: foundChain.name })}</Button>
//          </NextLink>
        )}
      </Grid>
    </Modal>
  )
}
