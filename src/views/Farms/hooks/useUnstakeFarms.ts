import { useCallback } from 'react'
import { unstakeFarm } from 'utils/calls'
import { useSenshimaster } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useUnstakeFarms = (pid: number) => {
  const senshiMasterContract = useSenshimaster()
  const gasPrice = useGasPrice()

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(senshiMasterContract, pid, amount, gasPrice)
    },
    [senshiMasterContract, pid, gasPrice],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
