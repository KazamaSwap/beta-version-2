import BigNumber from 'bignumber.js'
import { useTranslation } from '@kazamaswap/localization'
import { getBalanceAmount } from 'utils/formatBalance'

import { useMemo } from 'react'

export const useUserEnoughKazamaValidator = (kazamaAmount: string, stakingTokenBalance: BigNumber) => {
  const { t } = useTranslation()
  const errorMessage = t('Insufficient KAZAMA balance')

  const userNotEnoughKazama = useMemo(() => {
    if (new BigNumber(kazamaAmount).gt(getBalanceAmount(stakingTokenBalance, 18))) return true
    return false
  }, [kazamaAmount, stakingTokenBalance])
  return { userNotEnoughKazama, notEnoughErrorMessage: errorMessage }
}
