import { useTranslation } from '@kazamaswap/localization'
import { RocketIcon, Text } from '@kazamaswap/uikit'
import _toNumber from 'lodash/toNumber'
import { memo, useContext } from 'react'
import { formatNumber } from 'utils/formatBalance'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import useBoostMultiplier from '../hooks/useBoostMultiplier'
import { YieldBoosterState } from '../hooks/useYieldBoosterState'
import { YieldBoosterStateContext } from './ProxyFarmContainer'

interface BoosterAprWidgetPropsType {
  lpRewardsApr: number
  apr: number
  pid: number
  mr?: string
}

function BoosterAprWidget(props: BoosterAprWidgetPropsType) {
  const { lpRewardsApr, apr, pid, ...rest } = props
  const { boosterState, proxyAddress } = useContext(YieldBoosterStateContext)
  const { t } = useTranslation()

  const multiplier = useBoostMultiplier({ pid, boosterState, proxyAddress })

  const boostedApr =
    (!isUndefinedOrNull(multiplier) &&
      !isUndefinedOrNull(apr) &&
      formatNumber(
        _toNumber(apr) * Number(multiplier) + (!isUndefinedOrNull(lpRewardsApr) ? _toNumber(lpRewardsApr) : 0),
      )) ||
    '0'

  const msg =
    boosterState === YieldBoosterState.ACTIVE ? (
      `${boostedApr}%`
    ) : (
      <>
        {`${boostedApr}%`}
      </>
    )

  return (
    <>
      <Text bold color="success" {...rest} fontSize={16}>
        {msg}
      </Text>
    </>
  )
}

export default memo(BoosterAprWidget)
