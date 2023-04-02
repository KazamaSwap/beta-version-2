import { Box, Button, Flex, InjectedModalProps, External, Message, Skeleton, Text } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { ChainId } from '@kazamaswap/sdk'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@kazamaswap/localization'
import useAuth from 'hooks/useAuth'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useGetKazamaBalance } from 'hooks/useTokenBalance'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { formatBigNumber } from 'utils/formatBalance'
import { useBalance } from 'wagmi'
import CopyAddress from './CopyAddress'

export const KazamaTextButton = styled(Button)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

interface WalletInfoProps {
  hasLowNativeBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowNativeBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const { data, isFetched } = useBalance({ addressOrName: account })
  const native = useNativeCurrency()
  const { balance: kazamaBalance, fetchStatus: kazamaFetchStatus } = useGetKazamaBalance()
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }

  const isBSC = native.chainId === ChainId.BSC || ChainId.BSC_TESTNET

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <CopyAddress account={account} mb="24px" />
      {hasLowNativeBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">
              {t('%currency% Balance Low', {
                currency: native.symbol,
              })}
            </Text>
            <Text as="p">
              {t('You need %currency% for transaction fees.', {
                currency: native.symbol,
              })}
            </Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Flex>
          {!isBSC && <ChainLogo chainId={native.chainId} />}
          <Text ml={isBSC ? 0 : '8px'} color="textSubtle">
            {native.symbol} {t('Balance')}
          </Text>
        </Flex>
        {!isFetched ? <Skeleton height="22px" width="60px" /> : <Text>{formatBigNumber(data.value, 6)}</Text>}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px" mt="12px">
        <Flex alignItems="center">
          {!isBSC && <ChainLogo chainId={97} />}
          <Text ml={isBSC ? 0 : '8px'} color="textSubtle">
            {t('KAZAMA Balance')}
          </Text>
        </Flex>
        {kazamaFetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(kazamaBalance, 2)}</Text>
        )}
      </Flex>
      <Flex mb="12px">
        <External href={getBlockExploreLink(account, 'address', chainId)}>
          <KazamaTextButton variant="secondary" width="100%">
          {t('View on %site%', {
            site: getBlockExploreName(chainId),
          })}
          </KazamaTextButton>
        </External>
      </Flex>
      <KazamaTextButton variant="primary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </KazamaTextButton>
    </>
  )
}

export default WalletInfo
