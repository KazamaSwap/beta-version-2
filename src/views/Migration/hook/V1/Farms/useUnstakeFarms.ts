import BigNumber from 'bignumber.js'
import { BOOSTED_FARM_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { useCallback } from 'react'
import getGasPrice from 'utils/getGasPrice'
import { useSenshimasterV1 } from 'hooks/useContract'

const options = {
  gasLimit: BOOSTED_FARM_GAS_LIMIT,
}

const useUnstakeFarms = (pid: number) => {
  const senshiMasterContract = useSenshimasterV1()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const gasPrice = getGasPrice()
      const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
      if (pid === 0) {
        return senshiMasterContract.leaveStaking(value, { ...options, gasPrice })
      }

      return senshiMasterContract.withdraw(pid, value, { ...options, gasPrice })
    },
    [senshiMasterContract, pid],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
