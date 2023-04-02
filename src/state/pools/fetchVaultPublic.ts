import BigNumber from 'bignumber.js'
import { multicallv2 } from 'utils/multicall'
import kazamaVaultAbi from 'config/abi/kazamaVaultV2.json'
import { getKazamaVaultAddress, getKazamaFlexibleSideVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getKazamaContract } from 'utils/contractHelpers'

const kazamaVaultV2 = getKazamaVaultAddress()
const kazamaFlexibleSideVaultV2 = getKazamaFlexibleSideVaultAddress()
const kazamaContract = getKazamaContract()
export const fetchPublicVaultData = async (kazamaVaultAddress = kazamaVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares', 'totalLockedAmount'].map((method) => ({
      address: kazamaVaultAddress,
      name: method,
    }))

    const [[[sharePrice], [shares], totalLockedAmount], totalKazamaInVault] = await Promise.all([
      multicallv2({
        abi: kazamaVaultAbi,
        calls,
        options: {
          requireSuccess: false,
        },
      }),
      kazamaContract.balanceOf(kazamaVaultV2),
    ])

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber = totalLockedAmount ? new BigNumber(totalLockedAmount[0].toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalKazamaInVault: new BigNumber(totalKazamaInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      totalLockedAmount: null,
      pricePerFullShare: null,
      totalKazamaInVault: null,
    }
  }
}

export const fetchPublicFlexibleSideVaultData = async (kazamaVaultAddress = kazamaFlexibleSideVaultV2) => {
  try {
    const calls = ['getPricePerFullShare', 'totalShares'].map((method) => ({
      address: kazamaVaultAddress,
      name: method,
    }))

    const [[[sharePrice], [shares]], totalKazamaInVault] = await Promise.all([
      multicallv2({
        abi: kazamaVaultAbi,
        calls,
        options: { requireSuccess: false },
      }),
      kazamaContract.balanceOf(kazamaVaultAddress),
    ])

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalKazamaInVault: new BigNumber(totalKazamaInVault.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalKazamaInVault: null,
    }
  }
}

export const fetchVaultFees = async (kazamaVaultAddress = kazamaVaultV2) => {
  try {
    const calls = ['performanceFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: kazamaVaultAddress,
      name: method,
    }))

    const [[performanceFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2({ abi: kazamaVaultAbi, calls })

    return {
      performanceFee: performanceFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
