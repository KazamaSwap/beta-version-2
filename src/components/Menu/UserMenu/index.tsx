import { useTranslation } from '@kazamaswap/localization'
import styled from 'styled-components'
import { ChainId, Currency, Token } from '@kazamaswap/sdk'
import {
  AccountIcon,
  Box,
  ChatCloudIcon,
  ChatNameIcon,
  CogIcon,
  DisconnectIcon,
  EarnIcon,
  FavoritesIcon,
  Flex,
  LogoutIcon,
  RefreshIcon,
  HistoryIcon,
  LotteryTicketsIcon,
  NoProfileAvatarIcon,
  NftCollectionIcon,
  RewardBagIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  Skeleton,
  Tag,
  Text,
  TrophyIcon,
  TransactionHistoryIcon,
  VotePowerIcon,
  UserProfileIcon,
  UserChatNameIcon
} from '@kazamaswap/uikit'
import useSWR from 'swr'
import times from 'lodash/times'
import ProgressBar from '@ramonak/react-progress-bar'
import { useWeb3React } from '@kazamaswap/wagmi'
import { multicallv2 } from 'utils/multicall'
import { CurrencyLogo } from 'components/Logo'
import { bscTestnetTokens } from '@kazamaswap/tokens'
import kazamaAbi from 'config/abi/kazama.json'
import { SPACENAUT, KRAKEN, WHALE, SHARK, ORCA, DOLPHIN, TURTLE, FISH, CRAB, SHRIMP, HOLDER } from 'components/ChatLayout/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useNativeCurrency from 'hooks/useNativeCurrency'
import Balance from 'components/Balance'
import { useGetKazamaBalance } from 'hooks/useTokenBalance'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { formatBigNumber, formatNumberExact, formatNumber } from 'utils/formatBalance'
import { useBalance } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Trans from 'components/Trans'
import { LotteryStatus } from 'config/constants/types'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import NextLink from 'next/link'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import { useEffect, useState } from 'react'
import { useProfile } from 'state/profile/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'
import EditProfileAvatar from 'views/Profile/components/EditProfileAvatar'
import SetChatName from 'views/ChatUsername/setChatName'
import VoteDetailsModal from 'views/Voting/components/VoteDetailsModal'
import Choices, { Choice, makeChoice, MINIMUM_CHOICES } from 'views/Voting/CreateProposal/Choices'
import { FormState } from 'views/Voting/CreateProposal/types'
import useGetNextLotteryEvent from 'views/Lottery/hooks/useGetNextLotteryEvent'
import useStatusTransitions from 'views/Lottery/hooks/useStatusTransitions'
import ProfileMenuAvatar from 'views/Home/components/UserBanner/ProfileMenuAvatar'
import ViewTicketsModal from 'views/Lottery/components/ViewTicketsModal'
import ProfileAvatar from 'components/ProfileAvatar'
import ProfileUserMenuItem from './ProfileUserMenuItem'
import WalletModal, { WalletView } from './WalletModal'
import WalletUserMenuItem from './WalletUserMenuItem'

import CopyAddress from './CopyAddress'



interface AvatarProps {
  onSuccess?: () => void
}

const InnerWrapper = styled.div`
position: relative;
display: flex;
background: #141824;
`

const LeftPanel = styled.div`
flex: 1 1 0%;
min-width: 325px;
padding: 20px;
background: #201c29;
overflow: hidden auto;
`

const BalanceWrappersDiv = styled.div`
padding-top: 20px;
`

const BalanceWrapperLeft = styled.div`
display: flex;
-webkit-box-align: center;
align-items: center;
margin-bottom: 12px;
border-radius: 10px;
flex-direction: column;
`

const StyledBalanceWrapper = styled.div`
flex: 1 1 0%;
min-width: 0px;
display: flex;
background: #292334;
-webkit-box-align: center;
align-items: center;
padding: 7px;
border-radius: 5px;
margin-bottom: 7px;
width: 100%;
cursor: pointer;
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

const UserMenuAvatar = styled.div`
display: flex;
-webkit-box-align: center;
align-items: center;
margin-top: 10px;
margin-left: 11px;
margin-right: 11px;
font-size: 14px;
margin-bottom: 8px;
min-width: 100%;
border-radius: 8px;
transition: all 0.1s ease 0s;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 500;
font-style: normal;
cursor: pointer;
user-select: none;
`

const DisconnectItem = styled.div`
position: relative;
padding: 0.5rem 0;
background: rgba(238, 26, 121, 0.082);
border: 2px solid #EE1A78;
box-sizing: border-box;
border-radius: 8px;
height: 2.75rem;
transition: all .2s ease-in-out;
width: 100%;
&:hover {
  background: rgba(44, 38, 57, 0.897);
}
`

const LeftWrapperTop = styled.div`
display: flex;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: justify;
justify-content: space-between;
color: rgb(177, 182, 198);
font-size: 14px;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 500;
font-style: normal;
`

const CurrencyValueWrapper = styled.div`
display: flex;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: justify;
justify-content: space-between;
color: rgb(177, 182, 198);
font-size: 14px;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 500;
font-style: normal;
`

const UserAvatarWrapper = styled.div`
-webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border: 0;
    background: transparent;
    color: #FFFFFF;
    cursor: pointer;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    font-size: 16px;
    height: 48px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    outline: 0;
    padding-left: 16px;
    padding-right: 16px;
    width: 100%;
`

const AddressWrapper = styled.div`
padding-top: 25px;
position: absolute;
bottom: 0px;
padding-bottom: 15px;
`

const CurrencyNameWrapper = styled.div`
left: 0;
`

const CurrencyValue = styled.div`
right: 0;
`

const TicketCount = styled(Balance)`
padding-left: 6px;
padding-right: 6px;
padding-top: 2px;
font-size: 12px;
text-align: center;
`

// TODO: replace with no profile avatar icon
const AvatarInactive = styled(NoProfileAvatarIcon)`
  width: 100%;
  height: 100%;
`

const AvatarWrapper = styled.div<{ bg: string }>`
  background: url('${({ bg }) => bg}');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 100%;
  height: 100%;

  & > img {
    border-radius: 50%;
  }
`

const ADMIN_ADDRESS = "0x4162fBe60B7dDb0EaAbC0b13C6e68cC836Fe3a8f";

const UserMenu: React.FC<React.PropsWithChildren<AvatarProps>> = ({onSuccess}) => {
  const [state, setState] = useState<FormState>(() => ({
    name: '',
    body: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
  }))
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
  const [onPresentVoteDetailsModal] = useModal(<VoteDetailsModal block={state.snapshot} />)
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

  let barColor;
  let totalBg;
  let currentPercentage;

  if (balanceUser > SPACENAUT) {
    barColor = "#EE1A78";
    totalBg = "rgba(238, 26, 121, 0.308)";
    currentPercentage = 100;
  } else
  if (balanceUser > KRAKEN) {
    barColor = "#F79418";
    totalBg = "rgba(247, 147, 24, 0.336)";
    currentPercentage = balanceUser / SPACENAUT * 100;
  } else
  if (balanceUser > WHALE) {
    barColor = "#0096ff";
    totalBg = "rgba(0, 149, 255, 0.288)";
    currentPercentage = balanceUser / KRAKEN * 100;
  } else
  if (balanceUser > SHARK) {
    barColor = "#777777";
    totalBg = "rgba(119, 119, 119, 0.308)";
    currentPercentage = balanceUser / WHALE * 100;
  } else
  if (balanceUser > ORCA) {
    barColor = "#7a6a96";
    totalBg = "rgba(122, 106, 150, 0.315)";
    currentPercentage = balanceUser / SHARK * 100;
  } else
  if (balanceUser > DOLPHIN) {
    barColor = "#A5D1D3";
    totalBg = "rgba(165, 209, 211, 0.349)";
    currentPercentage = balanceUser / ORCA * 100;
  } else  if (balanceUser > TURTLE) {
    barColor = "#81ba47";
    totalBg = "rgba(49, 208, 171, 0.247)";
    currentPercentage = balanceUser / DOLPHIN * 100;
  } else
  if (balanceUser > FISH) {
    barColor = "#CDE2B8";
    totalBg = "rgba(205, 226, 184, 0.288)";
    currentPercentage = balanceUser / TURTLE * 100;
  } else
  if (balanceUser > CRAB) {
    barColor = "#cfc6c1";
    totalBg = "rgba(207, 198, 193, 0.267)";
    currentPercentage = balanceUser / FISH * 100;
  } else
  if (balanceUser > SHRIMP) {
    barColor = "#e14f4f";
    totalBg = "rgba(225, 79, 79, 0.295)";
    currentPercentage = balanceUser / CRAB * 100;
  } else
  if (balanceUser > HOLDER) {
    barColor = "#ffffff";
    totalBg = "rgba(255, 255, 255, 0.205)";
    currentPercentage = balanceUser / FISH * 100;
  } else {
    barColor = "#ffffff";
    totalBg = "rgba(255, 255, 255, 0.205)";
    currentPercentage = 0;
  }

  const KazamaProgress = () => {
    const kazamaProgress = currentPercentage
     return <ProgressBar baseBgColor={totalBg} margin="5px 0px 0px 8px" transitionTimingFunction="ease-in-out" 
     bgColor={barColor} height="5px" width="62px" borderRadius="2px" isLabelVisible={false} completed={kazamaProgress} maxCompleted={100} />;
   };

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
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  const UserMenuItems = () => {
    return (
      <>
      <InnerWrapper>
                    {/* <LeftPanel>
                <LeftWrapperTop>
                  <div>
                    Total value
                  </div>
                  <div>
                    $125,000
                  </div>
                </LeftWrapperTop>
                
                <BalanceWrappersDiv>
                <BalanceWrapperLeft>

                <NextLink href="/swap" passHref>
                  <StyledBalanceWrapper>
                  <CurrencyLogo currency={bscTestnetTokens.kazama} style={{ marginRight: 8, marginLeft: 5, borderRadius: '50%', width: '25px' ,height: '25px' }} />
                    <CurrencyNameWrapper>
                      <Flex flexDirection="column">
                      <Text color="secondary" fontSize="15px" fontWeight="bold">
                        Kazama Senshi
                      </Text>
                      <Flex>
                      <Text color="secondary" fontSize="15px">
                        KAZAMA
                      </Text>
                      </Flex>
                      </Flex>                 
                    </CurrencyNameWrapper>

                  </StyledBalanceWrapper>
                  </NextLink>

                  <NextLink href="/swap?outputCurrency=0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd" passHref>
                  <StyledBalanceWrapper>
                  <CurrencyLogo currency={bscTestnetTokens.wbnb} style={{ marginRight: 8, marginLeft: 5, borderRadius: '50%', width: '25px' ,height: '25px' }} />
                    <CurrencyNameWrapper>
                      <Flex flexDirection="column">

                        <Flex>
                        <Text color="secondary" fontSize="15px" fontWeight="bold">
                        Binance Token
                      </Text>
                      </Flex>
                      <Flex>
                      <Text color="secondary" fontSize="15px">
                        BNB
                        </Text>
                      {!isFetched ? <Skeleton height="22px" width="60px" /> : <Text>{formatBigNumber(data.value, 6)}</Text>} 
                      </Flex>

                      </Flex>
                    </CurrencyNameWrapper>

                  </StyledBalanceWrapper>
                  </NextLink>

                  <NextLink href="/swap?outputCurrency=0xf20F35A35994c87c8c8AB69Eb2a68762A15D0581" passHref>
                  <StyledBalanceWrapper>
                  <CurrencyLogo currency={bscTestnetTokens.egc} style={{ marginRight: 8, marginLeft: 5, borderRadius: '50%', width: '25px' ,height: '25px' }} />
                    <CurrencyNameWrapper>
                      <Flex flexDirection="column">

                        <Flex>
                        <Text color="secondary" fontSize="15px" fontWeight="bold">
                      EverGrow Coin
                      </Text>
                      </Flex>
                      <Flex>
                      <Text fontSize="15px">
                        EGC
                      </Text>
                      </Flex>
                      </Flex>
                    </CurrencyNameWrapper>

                  </StyledBalanceWrapper>
                  </NextLink>

                  <NextLink href="/swap?outputCurrency=0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd" passHref>
                  <StyledBalanceWrapper>
                  <CurrencyLogo currency={bscTestnetTokens.wbnb} style={{ marginRight: 8, marginLeft: 5, borderRadius: '50%', width: '25px' ,height: '25px' }} />
                    <CurrencyNameWrapper>
                      <Flex flexDirection="column">

                      <Flex>
                        <Text color="secondary" fontSize="15px" fontWeight="bold">
                        Wrapped BNB
                      </Text>
                      </Flex>
                      <Flex>
                      <Text color="secondary" fontSize="15px">
                        WBNB
                        </Text>
                        </Flex>

                      </Flex>
                    </CurrencyNameWrapper>

                  </StyledBalanceWrapper>
                  </NextLink>

                  <NextLink href="/swap?outputCurrency=0x15Dc609e4B1B190bE9A985404Ad3EF046B922Cd6" passHref>
                  <StyledBalanceWrapper>
                  <CurrencyLogo currency={bscTestnetTokens.sdxb} style={{ marginRight: 8, marginLeft: 5, borderRadius: '50%', width: '25px' ,height: '25px' }} />
                    <CurrencyNameWrapper>
                      <Flex flexDirection="column">

                        <Flex>
                        <Text color="secondary" fontSize="15px" fontWeight="bold">
                      SwapDEX
                      </Text>
                      </Flex>
                      <Flex>
                      <Text fontSize="15px">
                        SDXB
                      </Text>
                      </Flex>
                      </Flex>
                    </CurrencyNameWrapper>

                  </StyledBalanceWrapper>
                  </NextLink>

                  <NextLink href="/swap?outputCurrency=0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7" passHref>
                  <StyledBalanceWrapper>
                  <CurrencyLogo currency={bscTestnetTokens.busd} style={{ marginRight: 8, marginLeft: 5, borderRadius: '50%', width: '25px' ,height: '25px' }} />
                    <CurrencyNameWrapper>
                      <Flex flexDirection="column">

                        <Flex>
                        <Text color="secondary" fontSize="15px" fontWeight="bold">
                      Binance-Peg BUSD
                      </Text>
                      </Flex>
                      <Flex>
                      <Text fontSize="15px">
                        BUSD
                      </Text>
                      </Flex>
                      </Flex>
                    </CurrencyNameWrapper>
                  </StyledBalanceWrapper>
                  </NextLink>

                  <AddressWrapper>
                  <Text color="secondary" fontSize="15px" fontWeight="bold" mb="3px" mt="8px">
        {t('Account Address')}
      </Text>
      <CopyAddress account={account} />
      </AddressWrapper>
                </BalanceWrapperLeft>
                </BalanceWrappersDiv>
              </LeftPanel> */}


              <Flex flexDirection="column" mt="15px">
                {/* <UserMenuAvatar>
                <EditProfileAvatar
              src={avatarImage}
              alt={t('User profile picture')}
              onSuccess={() => {
                if (onSuccess) {
                  onSuccess()
                }
              }}
            />
              </UserMenuAvatar>  */}

              {/* <RightPanelWrapper>
              <UserProfileIcon width="20px" />
              <ProfileUserMenuItem
          isLoading={isLoading}
          hasProfile={hasProfile}
          disabled={isWrongNetwork || chainId !== ChainId.BSC_TESTNET}
        />
        </RightPanelWrapper> */}

        {/* <RightPanelWrapper>
        <UserMenuItem as="button" onClick={onPresentSetUsernameModal}>
         <FavoritesIcon width="20px" />
          <Text paddingLeft="9px" fontSize="15px">
            Favorites
          </Text>
          {hasPendingTransactions && <RefreshIcon spin />}
        </UserMenuItem>
        </RightPanelWrapper> */}

        <RightPanelWrapper>
        <UserMenuItem as="button" onClick={onPresentSetUsernameModal}>
         <UserChatNameIcon width="19px" />
          <Text paddingLeft="9px" fontSize="15px">
            Set Username
          </Text>

          {hasPendingTransactions && <RefreshIcon spin />}
        </UserMenuItem>
        </RightPanelWrapper>

        {/* <NextLink href='#' passHref>
        <RightPanelWrapper>
          <UserMenuItem as="a" disabled={isWrongNetwork || chainId !== ChainId.BSC_TESTNET}>
          <NftCollectionIcon width="20px" />
          <Text paddingLeft="9px" fontSize="15px">
            Senshi NFT's
            </Text>
          </UserMenuItem>
          </RightPanelWrapper>
        </NextLink>  */}

        {/* <RightPanelWrapper>
        <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentBusdStatsModal}>
          <RewardBagIcon width="20px" />
          <Text paddingLeft="9px" fontSize="15px">
            BUSD Rewards
            </Text>
          {hasPendingTransactions && <RefreshIcon spin />}
        </UserMenuItem>
        </RightPanelWrapper> */}

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
                <RightPanelWrapper>
                    <UserMenuItem as="button" disabled onClick={onPresentVoteDetailsModal}>
                      <VotePowerIcon width="20px" />
                      <Text paddingLeft="9px" fontSize="15px">
                        Voting Power
                      </Text>
                      {hasPendingTransactions && <RefreshIcon spin />}
                    </UserMenuItem>
                  </RightPanelWrapper><RightPanelWrapper>
                    <UserMenuItem as="button" disabled onClick={onPresentTransactionModal}>
                      <CogIcon fill="#fff" width="20px" />
                      <Text paddingLeft="9px" fontSize="15px">
                        Global Settings
                      </Text>
                      {hasPendingTransactions && <RefreshIcon spin />}
                    </UserMenuItem>
                  </RightPanelWrapper><RightPanelWrapper>
                    <UserMenuItem as="button" disabled onClick={onPresentTransactionModal}>
                      <TransactionHistoryIcon width="20px" />
                      <Text paddingLeft="9px" fontSize="15px">
                        Transactions
                      </Text>
                      {hasPendingTransactions && <RefreshIcon spin />}
                    </UserMenuItem>
                  </RightPanelWrapper><RightPanelWrapper>
                    <UserMenuItem as="button" onClick={logout}>
                      <Flex alignItems="center" width="100%">
                        <LogoutIcon width="20px" />
                        <Text paddingLeft="9px" fontSize="15px">
                          Disconnect
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
      <UIKitUserMenu account={account} avatarSrc={avatarSrc} text={userMenuText} variant={userMenuVariable} rankProgress={
        <KazamaProgress />
      }>
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger">
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
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

export default UserMenu
