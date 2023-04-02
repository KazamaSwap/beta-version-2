import React, { useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@kazamaswap/wagmi'
import { getFarmApr } from 'utils/apr'
import { useTranslation } from '@kazamaswap/localization'
import { KAZAMA_PER_YEAR } from 'config'
import { useFarmsV1, usePriceKazamaBusd } from 'state/farmsV1/hooks'
import { DeserializedFarm } from 'state/types'
import { FarmWithStakedValue } from 'views/Farms/components/types'
import MigrationFarmTable from '../../MigrationFarmTable'
import { DesktopColumnSchema } from '../../types'

const OldFarmStep1: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { data: farmsLP, userDataLoaded } = useFarmsV1()
  const kazamaPrice = usePriceKazamaBusd()

  const userDataReady = !account || (!!account && userDataLoaded)

  const farms = farmsLP.filter((farm) => farm.pid !== 0)

  const stakedOrHasTokenBalance = farms.filter((farm) => {
    return (
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.tokenBalance).isGreaterThan(0))
    )
  })

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { kazamaRewardsApr, lpRewardsApr } = getFarmApr(
          56,
          new BigNumber(farm.poolWeight),
          kazamaPrice,
          totalLiquidity,
          farm.lpAddress,
          KAZAMA_PER_YEAR,
        )
        return { ...farm, apr: kazamaRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [kazamaPrice],
  )

  const chosenFarmsMemoized = useMemo(() => {
    return farmsList(stakedOrHasTokenBalance)
  }, [stakedOrHasTokenBalance, farmsList])

  return (
    <MigrationFarmTable
      title={t('Old Farms')}
      noStakedFarmText={t('You are not currently staking in any v1 farms.')}
      account={account}
      kazamaPrice={kazamaPrice}
      columnSchema={DesktopColumnSchema}
      farms={chosenFarmsMemoized}
      userDataReady={userDataReady}
    />
  )
}

export default OldFarmStep1
