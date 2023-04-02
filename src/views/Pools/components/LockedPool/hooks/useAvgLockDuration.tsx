import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from 'config/constants/pools'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useKazamaVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'

import formatSecondsToWeeks from '../../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalKazamaInVault, pricePerFullShare } = useKazamaVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleKazamaAmount = totalKazamaInVault.minus(totalLockedAmount)
    const flexibleKazamaShares = flexibleKazamaAmount.div(pricePerFullShare).times(getFullDecimalMultiplier(18))
    const lockedKazamaBoostedShares = totalShares.minus(flexibleKazamaShares)
    const lockedKazamaOriginalShares = totalLockedAmount.div(pricePerFullShare).times(getFullDecimalMultiplier(18))
    const avgBoostRatio = lockedKazamaBoostedShares.div(lockedKazamaOriginalShares)

    return avgBoostRatio
      .minus(1)
      .times(new BigNumber(DURATION_FACTOR.toString()))
      .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
      .toFixed(0)
  }, [totalKazamaInVault, totalLockedAmount, pricePerFullShare, totalShares])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInSeconds: _toNumber(avgLockDurationsInSeconds),
  }
}
