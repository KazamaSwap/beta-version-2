import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import lpAprs56 from 'config/constants/lpAprs/56.json'
import lpAprs97 from 'config/constants/lpAprs/97.json'


const getLpApr = (chainId: number) => {
  switch (chainId) {
    case 97:
      return lpAprs97
    default:
      return {}
  }
}

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new kazama allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param kazamaPriceUsd Kazama price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  chainId: number,
  poolWeight: BigNumber,
  kazamaPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  regularKazamaPerBlock: number,
): { kazamaRewardsApr: number; lpRewardsApr: number } => {
  const yearlyKazamaRewardAllocation = poolWeight
    ? poolWeight.times(BLOCKS_PER_YEAR * regularKazamaPerBlock)
    : new BigNumber(NaN)
  const kazamaRewardsApr = yearlyKazamaRewardAllocation.times(kazamaPriceUsd).div(poolLiquidityUsd).times(100)
  let kazamaRewardsAprAsNumber = null
  if (!kazamaRewardsApr.isNaN() && kazamaRewardsApr.isFinite()) {
    kazamaRewardsAprAsNumber = kazamaRewardsApr.toNumber()
  }
  const lpRewardsApr = getLpApr(chainId)[farmAddress?.toLowerCase()] ?? 0
  return { kazamaRewardsApr: kazamaRewardsAprAsNumber, lpRewardsApr }
}

export default null
