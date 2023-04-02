import BigNumber from 'bignumber.js'
import { getSenshimasterV1Contract } from 'utils/contractHelpers'

export const fetchUserStakeBalances = async (account) => {
  // KAZAMA / KAZAMA pool
  const { amount: masterPoolAmount } = await getSenshimasterV1Contract().userInfo('0', account)
  return new BigNumber(masterPoolAmount.toString()).toJSON()
}

export const fetchUserPendingRewards = async (account) => {
  // KAZAMA / KAZAMA pool
  const pendingReward = await getSenshimasterV1Contract().pendingKazama('0', account)
  return new BigNumber(pendingReward.toString()).toJSON()
}
