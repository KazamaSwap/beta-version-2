import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { BOOSTED_FARM_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'

const options = {
  gasLimit: BOOSTED_FARM_GAS_LIMIT,
}

export const stakeFarm = async (senshiMasterContract: Contract, pid, amount, gasPrice) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return senshiMasterContract.deposit(pid, value, { ...options, gasPrice })
}

export const unstakeFarm = async (senshiMasterContract, pid, amount, gasPrice) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return senshiMasterContract.withdraw(pid, value, { ...options, gasPrice })
}

export const harvestFarm = async (senshiMasterContract, pid, gasPrice) => {
  return senshiMasterContract.deposit(pid, '0', { ...options, gasPrice })
}
