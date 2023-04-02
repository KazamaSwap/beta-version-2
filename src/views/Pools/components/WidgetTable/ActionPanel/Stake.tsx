import {
  AddIcon,
  Button,
  Flex,
  IconButton,
  MinusIcon,
  HelpIcon,
  Skeleton,
  Text,
  useModal,
  useTooltip,
  Box,
  SkeletonV2,
  useMatchBreakpoints,
} from '@kazamaswap/uikit'
import { useWeb3React } from '@kazamaswap/wagmi'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { PoolCategory } from 'config/constants/types'
import { useTranslation } from '@kazamaswap/localization'
import { useERC20 } from 'hooks/useContract'

import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedLockedKazamaVault } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/kazamaPool'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'

import { useApprovePool, useCheckVaultApprovalStatus, useVaultApprove } from '../../../hooks/useApprove'
import VaultStakeModal from '../../KazamaVaultCard/VaultStakeModal'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import StakeModal from '../../PoolCard/Modals/StakeModal'
import { ProfileRequirementWarning } from '../../ProfileRequirementWarning'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { VaultStakeButtonGroup } from '../../Vault/VaultStakeButtonGroup'
import AddKazamaButton from '../../LockedPool/Buttons/AddKazamaButton'
import ExtendButton from '../../LockedPool/Buttons/ExtendDurationButton'
import AfterLockedActions from '../../LockedPool/Common/AfterLockedActions'
import ConvertToLock from '../../LockedPool/Common/ConvertToLock'
import BurningCountDown from '../../LockedPool/Common/BurningCountDown'
import LockedStakedModal from '../../LockedPool/Modals/LockedStakeModal'

export const KazamaHeaderText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 3.00px; 
   font-weight: 400;
   margin-bottom: 15px;
`

export const KazamaText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 28px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 2.00px; 
   font-weight: 400;
`

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

export const KazamaTextBig = styled(Text)`
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

interface StackedActionProps {
  pool: DeserializedPool
}

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({ pool }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    stakingLimit,
    isFinished,
    poolCategory,
    userData,
    stakingTokenPrice,
    vaultKey,
    profileRequirement,
    userDataLoaded,
  } = pool
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const stakingTokenContract = useERC20(stakingToken.address || '')
  const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken.symbol,
  )

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(vaultKey)
  const { handleApprove: handleVaultApprove, pendingTx: pendingVaultTx } = useVaultApprove(vaultKey, setLastUpdated)

  const handleApprove = vaultKey ? handleVaultApprove : handlePoolApprove
  const pendingTx = vaultKey ? pendingVaultTx : pendingPoolTx

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !vaultKey && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const vaultData = useVaultPoolByKey(pool.vaultKey)
  const {
    userData: {
      userShares,
      balance: { kazamaAsBigNumber, kazamaAsNumberBalance },
    },
  } = vaultData

  const { lockEndDate, remainingTime, burnStartTime } = useUserDataInVaultPresenter({
    lockStartTime:
      vaultKey === VaultKey.KazamaVault ? (vaultData as DeserializedLockedKazamaVault).userData?.lockStartTime ?? '0' : '0',
    lockEndTime:
      vaultKey === VaultKey.KazamaVault ? (vaultData as DeserializedLockedKazamaVault).userData?.lockEndTime ?? '0' : '0',
    burnStartTime:
      vaultKey === VaultKey.KazamaVault ? (vaultData as DeserializedLockedKazamaVault).userData?.burnStartTime ?? '0' : '0',
  })

  const hasSharesStaked = userShares.gt(0)
  const isVaultWithShares = vaultKey && hasSharesStaked
  const stakedAutoDollarValue = getBalanceNumber(kazamaAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const needsApproval = vaultKey ? !isVaultApproved : !allowance.gt(0) && !isBnbPool

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={kazamaAsBigNumber} pool={pool} isRemovingStake />)

  const [openPresentLockedStakeModal] = useModal(
    <LockedStakedModal
      currentBalance={stakingTokenBalance}
      stakingToken={stakingToken}
      stakingTokenBalance={stakingTokenBalance}
    />,
  )

  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

  const onStake = () => {
    if (vaultKey) {
      onPresentVaultStake()
    } else {
      onPresentStake()
    }
  }

  const onUnstake = () => {
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("You've already staked the maximum amount you can stake in this pool!"),
    { placement: 'bottom' },
  )

  const tooltipContentOfBurn = t(
    'After Burning starts at %burnStartTime%. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.',
    { burnStartTime },
  )
  const {
    targetRef: tagTargetRefOfBurn,
    tooltip: tagTooltipOfBurn,
    tooltipVisible: tagTooltipVisibleOfBurn,
  } = useTooltip(tooltipContentOfBurn, {
    placement: 'bottom',
  })

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (notMeetRequired || notMeetThreshold) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (needsApproval) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
            <KazamaTextButton>
            {t('Enable to start')}
            </KazamaTextButton>
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    const vaultPosition = getVaultPosition(vaultData.userData)
    return (
      <>
        <ActionContainer flex={vaultPosition > 1 ? 1.5 : 1}>
          <ActionContent mt={0}>
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <ActionTitles>
                <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                  {stakingToken.symbol}{' '}
                </Text>
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {vaultKey === VaultKey.KazamaVault && (vaultData as DeserializedLockedKazamaVault).userData.locked
                    ? t('Locked')
                    : t('Staked')}
                </Text>
              </ActionTitles>
              <ActionContent>
                <Box position="relative">
                  <Balance
                    lineHeight="1"
                    bold
                    fontSize="20px"
                    decimals={5}
                    value={vaultKey ? kazamaAsNumberBalance : stakedTokenBalance}
                  />
                  <SkeletonV2
                    isDataReady={Number.isFinite(vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance)}
                    width={120}
                    wrapperProps={{ height: '20px' }}
                    skeletonTop="2px"
                  >
                    <Balance
                      fontSize="13px"
                      display="inline"
                      color="success"
                      decimals={2}
                      value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
                      unit=" USD"
                      prefix="~"
                    />
                  </SkeletonV2>
                </Box>
              </ActionContent>
              {vaultPosition === VaultPosition.Locked && (
                <Box mt="16px">
                  <AddKazamaButton
                    lockEndTime={(vaultData as DeserializedLockedKazamaVault).userData.lockEndTime}
                    lockStartTime={(vaultData as DeserializedLockedKazamaVault).userData.lockStartTime}
                    currentLockedAmount={kazamaAsBigNumber}
                    stakingToken={stakingToken}
                    currentBalance={stakingTokenBalance}
                    stakingTokenBalance={stakingTokenBalance}
                  />
                </Box>
              )}
            </Flex>
            {vaultPosition >= VaultPosition.Locked && (
              <Flex flex="1" ml="20px" flexDirection="column" alignSelf="flex-start">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {t('Unlocks In')}
                </Text>
                <Text
                  lineHeight="1"
                  mt="8px"
                  bold
                  fontSize="20px"
                  color={vaultPosition >= VaultPosition.LockedEnd ? 'text' : 'text'}
                >
                  {vaultPosition >= VaultPosition.LockedEnd ? t('Unlocked') : remainingTime}
                  {tagTooltipVisibleOfBurn && tagTooltipOfBurn}
                  <span ref={tagTargetRefOfBurn}>
                    <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                  </span>
                </Text>
                <Text
                  height="20px"
                  fontSize="12px"
                  display="inline"
                  color={vaultPosition >= VaultPosition.LockedEnd ? 'success' : 'text'}
                >
                  {t('On %date%', { date: lockEndDate })}
                </Text>
                {vaultPosition === VaultPosition.Locked && (
                  <Box mt="16px">
                    <ExtendButton
                      lockEndTime={(vaultData as DeserializedLockedKazamaVault).userData.lockEndTime}
                      lockStartTime={(vaultData as DeserializedLockedKazamaVault).userData.lockStartTime}
                      stakingToken={stakingToken}
                      currentBalance={stakingTokenBalance}
                      currentLockedAmount={kazamaAsNumberBalance}
                    >
                      {t('Extend')}
                    </ExtendButton>
                  </Box>
                )}
              </Flex>
            )}
            {(vaultPosition === VaultPosition.Flexible || !vaultKey) && (
              <IconButtonWrapper>
                <IconButton variant="primary" onClick={onUnstake} mr="6px">
                <KazamaTextBig>
                        -
                </KazamaTextBig>
                </IconButton>
                {reachStakingLimit ? (
                  <span ref={targetRef}>
                    <IconButton variant="primary" disabled>
                      <KazamaTextBig>
                        +
                      </KazamaTextBig>
                    </IconButton>
                  </span>
                ) : (
                  <IconButton
                    variant="primary"
                    onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
                    disabled={isFinished}
                  >
                      <KazamaTextBig>
                        +
                      </KazamaTextBig>
                  </IconButton>
                )}
              </IconButtonWrapper>
            )}
            {!isMobile && vaultPosition >= VaultPosition.LockedEnd && (
              <Flex flex="1" ml="20px" flexDirection="column" alignSelf="flex-start">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
                </Text>
                <Text lineHeight="1" mt="8px" bold fontSize="20px" color="warning">
                  {vaultPosition === VaultPosition.AfterBurning ? (
                    isUndefinedOrNull((vaultData as DeserializedLockedKazamaVault).userData.currentOverdueFee) ? (
                      '-'
                    ) : (
                      t('%amount% Burned', {
                        amount: getFullDisplayBalance(
                          (vaultData as DeserializedLockedKazamaVault).userData.currentOverdueFee,
                          18,
                          5,
                        ),
                      })
                    )
                  ) : (
                    <BurningCountDown lockEndTime={(vaultData as DeserializedLockedKazamaVault).userData.lockEndTime} />
                  )}
                </Text>
              </Flex>
            )}
            {tooltipVisible && tooltip}
          </ActionContent>
        </ActionContainer>
        {isMobile && vaultPosition >= VaultPosition.LockedEnd && (
          <Flex mb="24px" justifyContent="space-between">
            <Text fontSize="14px" color="failure" as="span">
              {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
            </Text>
            <Text fontSize="14px" bold color="failure">
              {vaultPosition === VaultPosition.AfterBurning ? (
                isUndefinedOrNull((vaultData as DeserializedLockedKazamaVault).userData.currentOverdueFee) ? (
                  '-'
                ) : (
                  t('%amount% Burned', {
                    amount: getFullDisplayBalance(
                      (vaultData as DeserializedLockedKazamaVault).userData.currentOverdueFee,
                      18,
                      5,
                    ),
                  })
                )
              ) : (
                <BurningCountDown lockEndTime={(vaultData as DeserializedLockedKazamaVault).userData.lockEndTime} />
              )}
            </Text>
          </Flex>
        )}
        {[VaultPosition.AfterBurning, VaultPosition.LockedEnd].includes(vaultPosition) && (
          <Box
            width="100%"
            mt={['0', '0', '24px', '24px', '24px']}
            ml={['0', '0', '12px', '12px', '12px', '32px']}
            mr={['0', '0', '12px', '12px', '12px', '0px']}
          >
            <AfterLockedActions
              isInline
              position={vaultPosition}
              currentLockedAmount={kazamaAsNumberBalance}
              stakingToken={stakingToken}
              lockEndTime="0"
              lockStartTime="0"
            />
          </Box>
        )}
        {vaultKey === VaultKey.KazamaVault && vaultPosition === VaultPosition.Flexible && (
          <Box
            width="100%"
            mt={['0', '0', '24px', '24px', '24px']}
            ml={['0', '0', '12px', '12px', '32px']}
            mr={['0', '0', '12px', '12px', '0']}
          >
            <ConvertToLock stakingToken={stakingToken} currentStakedAmount={kazamaAsNumberBalance} isInline />
          </Box>
        )}
      </>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {t('Staking')}{' '}
        </Text>
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {stakingToken.symbol}
        </Text>
      </ActionTitles>
      <ActionContent>
        {vaultKey ? (
          <VaultStakeButtonGroup
            onFlexibleClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
            onLockedClick={vaultKey === VaultKey.KazamaVault ? openPresentLockedStakeModal : null}
          />
        ) : (
          <Button
            width="100%"
            onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
            variant="primary"
            disabled={isFinished}
          >
            <KazamaTextButton>
            {t('Start staking!')}
            </KazamaTextButton>
          </Button>
        )}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
