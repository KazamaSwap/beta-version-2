import BigNumber from 'bignumber.js'
import {
  SerializedFarm,
  DeserializedPool,
  SerializedPool,
  SerializedKazamaVault,
  DeserializedKazamaVault,
  SerializedLockedKazamaVault,
  VaultKey,
} from 'state/types'
import { deserializeToken } from 'state/user/hooks/helpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { convertSharesToKazama } from 'views/Pools/helpers'

type UserData =
  | DeserializedPool['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
    }

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  }
}

const transformProfileRequirement = (profileRequirement?: { required: boolean; thresholdPoints: string }) => {
  return profileRequirement
    ? {
        required: profileRequirement.required,
        thresholdPoints: profileRequirement.thresholdPoints
          ? new BigNumber(profileRequirement.thresholdPoints)
          : BIG_ZERO,
      }
    : undefined
}

export const transformPool = (pool: SerializedPool): DeserializedPool => {
  const {
    totalStaked,
    stakingLimit,
    numberBlocksForUserLimit,
    userData,
    stakingToken,
    earningToken,
    profileRequirement,
    startBlock,
    ...rest
  } = pool

  return {
    ...rest,
    startBlock,
    profileRequirement: transformProfileRequirement(profileRequirement),
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
    stakingLimitEndBlock: numberBlocksForUserLimit + startBlock,
  }
}

export const transformVault = (vaultKey: VaultKey, vault: SerializedKazamaVault): DeserializedKazamaVault => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      kazamaAtLastUserAction: kazamaAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = vault

  const totalShares = totalSharesAsString ? new BigNumber(totalSharesAsString) : BIG_ZERO
  const pricePerFullShare = pricePerFullShareAsString ? new BigNumber(pricePerFullShareAsString) : BIG_ZERO
  const userShares = new BigNumber(userSharesAsString)
  const kazamaAtLastUserAction = new BigNumber(kazamaAtLastUserActionAsString)
  let userDataExtra
  let publicDataExtra
  if (vaultKey === VaultKey.KazamaVault) {
    const {
      totalKazamaInVault: totalKazamaInVaultAsString,
      totalLockedAmount: totalLockedAmountAsString,
      userData: {
        userBoostedShare: userBoostedShareAsString,
        lockEndTime,
        lockStartTime,
        locked,
        lockedAmount: lockedAmountAsString,
        currentOverdueFee: currentOverdueFeeAsString,
        currentPerformanceFee: currentPerformanceFeeAsString,
      },
    } = vault as SerializedLockedKazamaVault

    const totalKazamaInVault = new BigNumber(totalKazamaInVaultAsString)
    const totalLockedAmount = new BigNumber(totalLockedAmountAsString)
    const lockedAmount = new BigNumber(lockedAmountAsString)
    const userBoostedShare = new BigNumber(userBoostedShareAsString)
    const currentOverdueFee = currentOverdueFeeAsString ? new BigNumber(currentOverdueFeeAsString) : BIG_ZERO
    const currentPerformanceFee = currentPerformanceFeeAsString
      ? new BigNumber(currentPerformanceFeeAsString)
      : BIG_ZERO

    const balance = convertSharesToKazama(
      userShares,
      pricePerFullShare,
      undefined,
      undefined,
      currentOverdueFee.plus(currentPerformanceFee).plus(userBoostedShare),
    )
    userDataExtra = {
      lockEndTime,
      lockStartTime,
      locked,
      lockedAmount,
      userBoostedShare,
      currentOverdueFee,
      currentPerformanceFee,
      balance,
    }
    publicDataExtra = { totalLockedAmount, totalKazamaInVault }
  } else {
    const balance = convertSharesToKazama(userShares, pricePerFullShare)
    const { kazamaAsBigNumber } = convertSharesToKazama(totalShares, pricePerFullShare)
    userDataExtra = { balance }
    publicDataExtra = { totalKazamaInVault: kazamaAsBigNumber }
  }

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  return {
    totalShares,
    pricePerFullShare,
    ...publicDataExtra,
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod, performanceFeeAsDecimal },
    userData: {
      isLoading,
      userShares,
      kazamaAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
      ...userDataExtra,
    },
  }
}

export const getTokenPricesFromFarm = (farms: SerializedFarm[]) => {
  return farms.reduce((prices, farm) => {
    const quoteTokenAddress = farm.quoteToken.address.toLowerCase()
    const tokenAddress = farm.token.address.toLowerCase()
    /* eslint-disable no-param-reassign */
    if (!prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteTokenPriceBusd).toNumber()
    }
    if (!prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.tokenPriceBusd).toNumber()
    }
    /* eslint-enable no-param-reassign */
    return prices
  }, {})
}
