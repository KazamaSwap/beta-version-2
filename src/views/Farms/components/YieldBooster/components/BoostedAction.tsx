import { useTranslation } from '@kazamaswap/localization'
import { AutoRenewIcon } from '@kazamaswap/uikit'
import { ReactNode, useCallback, useContext } from 'react'
import styled from 'styled-components'
import _isEmpty from 'lodash/isEmpty'
import { NextLinkFromReactRouter } from 'components/NextLink'

import { YieldBoosterState } from '../hooks/useYieldBoosterState'
import useBoosterFarmHandlers from '../hooks/useBoosterFarmHandlers'

import useBoostMultiplier from '../hooks/useBoostMultiplier'
import ActionButton from './ActionButton'
import CreateProxyButton from './CreateProxyButton'
import { YieldBoosterStateContext } from './ProxyFarmContainer'
import MigrateActionButton from './MigrateActionButton'

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

interface BoostedActionPropsType {
  farmPid: number
  title: (status: YieldBoosterState) => ReactNode
  desc: (actionBtn: ReactNode) => ReactNode
}

const BoostedAction: React.FunctionComponent<BoostedActionPropsType> = ({ farmPid, title, desc }) => {
  const { t } = useTranslation()
  const { boosterState, refreshActivePool, refreshProxyAddress, proxyAddress } = useContext(YieldBoosterStateContext)
  const { isConfirming, ...handlers } = useBoosterFarmHandlers(farmPid, refreshActivePool)
  const boostMultiplier = useBoostMultiplier({ pid: farmPid, boosterState, proxyAddress })
  const boostMultiplierDisplay = boostMultiplier.toLocaleString(undefined, { maximumFractionDigits: 3 })

  const renderBtn = useCallback(() => {
    switch (boosterState) {
      case YieldBoosterState.UNCONNECTED:
        return (
          <ActionButton
            title={`${t('Up to')} ${boostMultiplierDisplay}x`}
            description={t('Connect wallet to activate yield booster')}
          />
        )
      case YieldBoosterState.NO_LOCKED:
        return (
          <ActionButton
            title={`${t('Up to')} ${boostMultiplierDisplay}x`}
            description={t('Lock KAZAMA to activate yield booster')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <NextLinkFromReactRouter to="/pools">
            <KazamaTextButton>
            {t('Go to Pool')}
            </KazamaTextButton>
            </NextLinkFromReactRouter>
          </ActionButton>
        )
      case YieldBoosterState.LOCKED_END:
        return (
          <ActionButton
            title={`${t('Up to')} ${boostMultiplierDisplay}x`}
            description={t('Lock KAZAMA is ended. Re-lock KAZAMA to activate yield booster')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <NextLinkFromReactRouter to="/pools">{t('Go to Pool')}</NextLinkFromReactRouter>
          </ActionButton>
        )
      case YieldBoosterState.NO_PROXY_CREATED:
        return (
          <ActionButton
            title={`${boostMultiplierDisplay}x`}
            description={t('One-time setup is required ..')}
            button={<CreateProxyButton onDone={refreshProxyAddress} width="auto" />}
          />
        )
      case YieldBoosterState.NO_MIGRATE:
        return (
          <ActionButton
            title={`${boostMultiplierDisplay}x`}
            description={t('Migration required to activate boost  ..')}
            button={<MigrateActionButton pid={farmPid} />}
          />
        )
      case YieldBoosterState.NO_LP:
        return (
          <ActionButton
            title={`${boostMultiplierDisplay}x`}
            description={t('Stake LP tokens to start boosting')}
            disabled
          ><KazamaTextButton>
            {t('Boost')}
            </KazamaTextButton>
          </ActionButton>
        )
      case YieldBoosterState.DEACTIVE:
        return (
          <ActionButton
            disabled={isConfirming}
            onClick={handlers.activate}
            title={`${boostMultiplierDisplay}x`}
            isLoading={isConfirming}
            description={t('Yield booster available')}
            variant="warning"
            endIcon={isConfirming && <AutoRenewIcon spin color="currentColor" />}
          >
            <KazamaTextButton>
            {t('Boost')}
            </KazamaTextButton>
          </ActionButton>
        )
      case YieldBoosterState.ACTIVE:
        return (
          <ActionButton
            disabled={isConfirming}
            onClick={handlers.deactivate}
            title={`${boostMultiplierDisplay}x`}
            isLoading={isConfirming}
            description={t('Active')}
            endIcon={isConfirming && <AutoRenewIcon spin color="currentColor" />}
          >
            <KazamaTextButton>
            {t('Unset')}
            </KazamaTextButton>
          </ActionButton>
        )
      case YieldBoosterState.MAX:
        return (
          <ActionButton
            title={`${boostMultiplierDisplay}x`}
            description={t('Unset other boosters to activate')}
            disabled
          >
            <KazamaTextButton>
            {t('Boost')}
            </KazamaTextButton>
          </ActionButton>
        )
      default:
        return null
    }
  }, [
    boosterState,
    t,
    handlers.activate,
    handlers.deactivate,
    isConfirming,
    farmPid,
    refreshProxyAddress,
    boostMultiplierDisplay,
  ])

  let status = null

  if ([YieldBoosterState.NO_MIGRATE, YieldBoosterState.DEACTIVE].includes(boosterState)) {
    status = t('Ready')
  } else if (boosterState === YieldBoosterState.ACTIVE) {
    status = t('Active')
  }

  return (
    <>
      {title && title(status)}
      {desc && desc(renderBtn())}
    </>
  )
}

export default BoostedAction
