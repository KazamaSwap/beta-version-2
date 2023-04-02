import { useState, useEffect } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarms, usePriceKazamaBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { DeserializedFarm } from 'state/types'
import { FetchStatus } from 'config/constants/types'
import { getFarmConfig } from 'config/constants/farms/index'
import { FarmWithStakedValue } from '../../Farms/components/types'

const useGetTopFarmsByMultiplier = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()
  const { data: farms, regularKazamaPerBlock } = useFarms()
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [fetched, setFetched] = useState(false)
  const [topFarms, setTopFarms] = useState<FarmWithStakedValue[]>([null, null, null, null, null])
  const kazamaPriceBusd = usePriceKazamaBusd()
  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    const fetchFarmData = async () => {
      const farmsConfig = await getFarmConfig(chainId)
      setFetchStatus(FetchStatus.Fetching)
      const activeFarms = farmsConfig.filter((farm) => farm.pid !== 0)
      try {
        await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms.map((farm) => farm.pid), chainId }))
        setFetchStatus(FetchStatus.Fetched)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.Failed)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.Idle) {
      fetchFarmData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topFarms, isIntersecting, chainId])

  useEffect(() => {
    const getTopFarmsByApr = (farmsState: DeserializedFarm[]) => {
      const farmsWithPrices = farmsState.filter(
        (farm) =>
          farm.lpTotalInQuoteToken &&
          farm.quoteTokenPriceBusd &&
          farm.pid !== 0 &&
          farm.multiplier &&
          farm.multiplier !== '0X',
      )
      const farmsWithMultiplier: FarmWithStakedValue[] = farmsWithPrices.map((farm) => {
        const totalLiquidity = farm.lpTotalInQuoteToken.times(farm.quoteTokenPriceBusd)
        const { kazamaRewardsApr, lpRewardsApr } = getFarmApr(
          chainId,
          farm.poolWeight,
          kazamaPriceBusd,
          totalLiquidity,
          farm.lpAddress,
          regularKazamaPerBlock,
        )
        return { ...farm, apr: kazamaRewardsApr, lpRewardsApr }
      })

      const sortedByMultiplier = orderBy(farmsWithMultiplier, (farm) => farm.multiplier, 'desc')
      setTopFarms(sortedByMultiplier.slice(0, 7))
      setFetched(true)
    }

    if (fetchStatus === FetchStatus.Fetched && !topFarms[0]) {
      getTopFarmsByApr(farms)
    }
  }, [setTopFarms, farms, fetchStatus, kazamaPriceBusd, topFarms, regularKazamaPerBlock, chainId])

  return { topFarms, fetched }
}

export default useGetTopFarmsByMultiplier