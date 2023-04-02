import ConnectWalletButton from 'components/ConnectWalletButton';
import { ToastDescriptionWithTx } from 'components/Toast';
import { BASE_ADD_LIQUIDITY_URL } from 'config';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useCatchTxError from 'hooks/useCatchTxError';
import { useERC20 } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';
import { useAppDispatch } from 'state';
import { fetchFarmUserDataAsync } from 'state/farms';
import { useLpTokenPrice, usePriceKazamaBusd } from 'state/farms/hooks';
import styled from 'styled-components';
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts';

import { TransactionResponse } from '@ethersproject/providers';
import { useTranslation } from '@kazamaswap/localization';
import {
    AddIcon, Button, IconButton, MinusIcon, Skeleton, Text, useModal
} from '@kazamaswap/uikit';

import useApproveFarm from '../../../hooks/useApproveFarm';
import useStakeFarms from '../../../hooks/useStakeFarms';
import useUnstakeFarms from '../../../hooks/useUnstakeFarms';
import DepositModal from '../../DepositModal';
import StakedLP from '../../StakedLP';
import { FarmWithStakedValue } from '../../types';
import WithdrawModal from '../../WithdrawModal';
import { YieldBoosterStateContext } from '../../YieldBooster/components/ProxyFarmContainer';
import useProxyStakedActions from '../../YieldBooster/hooks/useProxyStakedActions';
import { YieldBoosterState } from '../../YieldBooster/hooks/useYieldBoosterState';
import { ActionContainer, ActionContent, ActionTitles } from './styles';

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

export const KazamaPlusMinus = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 24px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const IconButtonWrapper = styled.div`
  display: flex;
`

const StyledIconButton = styled(IconButton)`
height: 45px;
width: 45px;
border-radius: 50%;
background: #161b28;
margin-bottom: 10px
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  lpLabel?: string
  displayApr?: string
  onStake?: (value: string) => Promise<TransactionResponse>
  onUnstake?: (value: string) => Promise<TransactionResponse>
  onDone?: () => void
  onApprove?: () => Promise<TransactionResponse>
  isApproved?: boolean
  shouldUseProxyFarm?: boolean
}

const StyledActionContainer = styled(ActionContainer)`
  background: #1b2031;
  border: 0px solid;
  &:nth-child(3) {
    flex-basis: 100%;
  }
  min-height: 124.5px;
  ${({ theme }) => theme.mediaQueries.sm} {
    &:nth-child(3) {
      margin-top: 16px;
    }
  }
`

export function useStakedActions(pid, lpContract) {
  const { account, chainId } = useActiveWeb3React()
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const dispatch = useAppDispatch()

  const { onApprove } = useApproveFarm(lpContract, chainId)

  const onDone = useCallback(
    () => dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId })),
    [account, pid, chainId, dispatch],
  )

  return {
    onStake,
    onUnstake,
    onApprove,
    onDone,
  }
}

export const ProxyStakedContainer = ({ children, ...props }) => {
  const { account } = useActiveWeb3React()

  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)

  const { onStake, onUnstake, onApprove, onDone } = useProxyStakedActions(props.pid, lpContract)

  const { allowance } = props.userData || {}

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  return children({
    ...props,
    onStake,
    onDone,
    onUnstake,
    onApprove,
    isApproved,
  })
}

export const StakedContainer = ({ children, ...props }) => {
  const { account } = useActiveWeb3React()

  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)
  const { onStake, onUnstake, onApprove, onDone } = useStakedActions(props.pid, lpContract)

  const { allowance } = props.userData || {}

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  return children({
    ...props,
    onStake,
    onDone,
    onUnstake,
    onApprove,
    isApproved,
  })
}

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({
  apr,
  multiplier,
  lpSymbol,
  lpLabel,
  quoteToken,
  token,
  userDataReady,
  displayApr,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  userData,
  onDone,
  onStake,
  onUnstake,
  onApprove,
  isApproved,
}) => {
  const { boosterState } = useContext(YieldBoosterStateContext)

  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { account } = useActiveWeb3React()

  const { tokenBalance, stakedBalance } = userData || {}

  const router = useRouter()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const kazamaPrice = usePriceKazamaBusd()

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onStake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onUnstake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      lpPrice={lpPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      addLiquidityUrl={addLiquidityUrl}
      kazamaPrice={kazamaPrice}
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      max={stakedBalance}
      onConfirm={handleUnstake}
      tokenName={lpSymbol}
    />,
  )

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  if (!account) {
    return (
      <StyledActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </StyledActionContainer>
    )
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <StyledActionContainer>
          <ActionTitles>
            <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
              {lpSymbol}
            </Text>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              {t('Staked')}
            </Text>
          </ActionTitles>
          <ActionContent>
            <StakedLP
              stakedBalance={stakedBalance}
              lpSymbol={lpSymbol}
              quoteTokenSymbol={quoteToken.symbol}
              tokenSymbol={token.symbol}
              lpTotalSupply={lpTotalSupply}
              tokenAmountTotal={tokenAmountTotal}
              quoteTokenAmountTotal={quoteTokenAmountTotal}
            />
            <IconButtonWrapper>
              <StyledIconButton variant="primary" onClick={onPresentWithdraw} mr="6px">
                  <MinusIcon />
              </StyledIconButton>
              <StyledIconButton
                variant="primary"
                onClick={onPresentDeposit}
                disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
              >
                  <AddIcon />
              </StyledIconButton>
            </IconButtonWrapper>
          </ActionContent>
        </StyledActionContainer>
      )
    }

    return (
      <StyledActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
            {t('Stake')}
          </Text>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
            {lpSymbol}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentDeposit}
            variant="primary"
            disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
          >
            {t('Stake')} {lpSymbol}
          </Button>
        </ActionContent>
      </StyledActionContainer>
    )
  }

  if (!userDataReady) {
    return (
      <StyledActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </ActionContent>
      </StyledActionContainer>
    )
  }

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Enable Farm')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary" style={{color: "#fff"}}>
          {t('Enable to start')}
        </Button>
      </ActionContent>
    </StyledActionContainer>
  )
}

export default Staked
