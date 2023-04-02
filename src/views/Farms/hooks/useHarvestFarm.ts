import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useSenshimaster } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useHarvestFarm = (farmPid: number) => {
  const senshiMasterContract = useSenshimaster()
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return harvestFarm(senshiMasterContract, farmPid, gasPrice)
  }, [farmPid, senshiMasterContract, gasPrice])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
