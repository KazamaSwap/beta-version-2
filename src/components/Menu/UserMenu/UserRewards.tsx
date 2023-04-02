import { useTranslation } from '@kazamaswap/localization'
import styled from 'styled-components'
import { ChainId, Currency, Token } from '@kazamaswap/sdk'
import {
  Box,
  Flex,
  RefreshIcon,
  LotteryTicketsIcon,
  NoProfileAvatarIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuItem,
  UserMenuVariant,
  Text,
  UserChatNameIcon
} from '@kazamaswap/uikit'
import useSWR from 'swr'
import times from 'lodash/times'
import { useWeb3React } from '@kazamaswap/wagmi'
import { multicallv2 } from 'utils/multicall'
import { bscTestnetTokens } from '@kazamaswap/tokens'
import kazamaAbi from 'config/abi/kazama.json'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useNativeCurrency from 'hooks/useNativeCurrency'
import Balance from 'components/Balance'
import { useGetKazamaBalance } from 'hooks/useTokenBalance'
import { formatBigNumber, formatNumberExact, formatNumber } from 'utils/formatBalance'
import { useBalance } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Trans from 'components/Trans'
import { LotteryStatus } from 'config/constants/types'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import { useEffect, useState } from 'react'
import { useProfile } from 'state/profile/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'
import SetChatName from 'views/ChatUsername/setChatName'
import VoteDetailsModal from 'views/Voting/components/VoteDetailsModal'
import { FormState } from 'views/Voting/CreateProposal/types'
import useStatusTransitions from 'views/Lottery/hooks/useStatusTransitions'
import ViewTicketsModal from 'views/Lottery/components/ViewTicketsModal'
import WalletModal, { WalletView } from './WalletModal'


interface AvatarProps {
  onSuccess?: () => void
}

const InnerWrapper = styled.div`
position: relative;
display: flex;
background: #141824;
`

const RightPanelWrapper = styled.div`
display: flex;
-webkit-box-align: center;
align-items: center;
padding: 0px 7px 0px 6px;
margin-left: 11px;
margin-right: 11px;
font-size: 14px;
margin-bottom: 8px;
height: 40px;
min-height: 40px;
border-radius: 8px;
color: rgb(255, 255, 255);
background: #1b2031;
transition: all 0.1s ease 0s;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 500;
font-style: normal;
cursor: pointer;
user-select: none;
`

const RewardWrapper = styled.div`
-webkit-align-items: center;
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
background-color: #1b2031;
border-radius: 10px;
box-shadow: inset 0px -2px 0px rgba(0,0,0,0.1);
cursor: pointer;
display: -webkit-inline-box;
display: -webkit-inline-flex;
display: -ms-inline-flexbox;
display: inline-flex;
height: 45px;
padding-left: 13px;
padding-right: 8px;
position: relative;
`

const ADMIN_ADDRESS = "0x4162fBe60B7dDb0EaAbC0b13C6e68cC836Fe3a8f";

const UserRewards: React.FC<React.PropsWithChildren<AvatarProps>> = ({onSuccess}) => {
  const { t } = useTranslation()
  const { chainId, isWrongNetwork } = useActiveChainId()
  const { logout } = useAuth()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const { isInitialized, isLoading, profile } = useProfile()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentSetUsernameModal] =  useModal(<SetChatName />)
  // const [onPresentBusdStatsModal] =  useModal(<BusdStats />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)
  const hasProfile = isInitialized && !!profile
  const avatarSrc = profile?.nft?.image?.thumbnail
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { account, isConnected } = useWeb3React()
  const [loadData, setLoadData] = useState(false)
  const { data, isFetched } = useBalance({ addressOrName: account })
  const native = useNativeCurrency()
  const { balance: kazamaBalance, fetchStatus: kazamaFetchStatus } = useGetKazamaBalance()
  const avatarImage = profile?.nft?.image?.thumbnail || '/images/nfts/no-profile-md.png'
  const {
    data: { kazamaSupply, balanceUser} = {
      kazamaSupply: 0,
      balanceUser: 0,
    },
  } = useSWR(
    loadData ? ['kazamaDataRow'] : null,
    async () => {
      const totalSupplyCall = { address: bscTestnetTokens.kazama.address, name: 'totalSupply'}
      const balanceUserCall = { address: bscTestnetTokens.kazama.address, name: 'balanceOf', params: [account], }
      const [tokenDataResultRaw] = await Promise.all([
        multicallv2({
          abi: kazamaAbi,calls: [totalSupplyCall, balanceUserCall],
        options:
         {requireSuccess: false,},
        })
      ])
      const [totalSupply, balanceUserAccount] = tokenDataResultRaw.flat()

      return {
        kazamaSupply: totalSupply ? +formatBigNumber(totalSupply) : 0,
        balanceUser: balanceUserAccount ? +formatBigNumber(balanceUserAccount) : 0
      }
    },
  )

   useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])


  useFetchLottery()
  useStatusTransitions()
  const { currentRound: { amountCollectedInKazama, userTickets, status }, currentLotteryId, isTransitioning } = useLottery()
  const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} roundStatus={status} />)

  const isLotteryOpen = status === LotteryStatus.OPEN
  const userTicketCount = userTickets?.tickets?.length || 0

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('$4000')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  const RewardItems = () => {
    return (
      <>
      <InnerWrapper>

        <Flex flexDirection="column" mt="15px">

        <RightPanelWrapper>
        <UserMenuItem as="button" onClick={onPresentSetUsernameModal}>
         <UserChatNameIcon width="19px" />
          <Text paddingLeft="9px" fontSize="15px">
            Set Username
          </Text>

          {hasPendingTransactions && <RefreshIcon spin />}
        </UserMenuItem>
        </RightPanelWrapper>

        <RightPanelWrapper>
        <UserMenuItem as="button" disabled onClick={onPresentViewTicketsModal}>
                    <LotteryTicketsIcon width="20px" />
                    <Flex flexDirection="row">
                    <Text paddingLeft="9px" fontSize="15px">
                      Lottery Tickets
                    </Text>
                    </Flex>
                  </UserMenuItem>
                  </RightPanelWrapper>
                </Flex>
              </InnerWrapper>
      </>
    )
  }

  if (account) {
    return (
      <UIKitUserMenu text={userMenuText} variant={userMenuVariable} style={{marginRight: "10px"}}>
        {({ isOpen }) => (isOpen ? <RewardItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger">
        {({ isOpen }) => (isOpen ? <RewardItems /> : null)}
      </UIKitUserMenu>
    )
  }

  return (
    <ConnectWalletButton scale="sm">
      <Box display={['none', , , 'block']}>
        <Trans>Connect Wallet</Trans>
      </Box>
      <Box display={['block', , , 'none']}>
        <Trans>Connect</Trans>
      </Box>
    </ConnectWalletButton>
  )
}

export default UserRewards
