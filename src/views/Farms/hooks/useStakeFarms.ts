import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useSenshimaster } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useStakeFarms = (pid: number) => {
  const senshiMasterContract = useSenshimaster()
  const gasPrice = useGasPrice()

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(senshiMasterContract, pid, amount, gasPrice)
    },
    [senshiMasterContract, pid, gasPrice],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
