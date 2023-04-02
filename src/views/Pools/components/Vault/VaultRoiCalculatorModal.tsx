import { Box, ButtonMenu, ButtonMenuItem } from '@kazamaswap/uikit'
import styled from 'styled-components'
import RoiCalculatorModal, { RoiCalculatorModalProps } from 'components/RoiCalculatorModal'
import { CalculatorMode } from 'components/RoiCalculatorModal/useRoiCalculatorReducer'
import { useTranslation } from '@kazamaswap/localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { useEffect, useState, useMemo } from 'react'
import { DeserializedPool, VaultKey } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getRoi } from 'utils/compoundApyHelpers'
import LockDurationField from '../LockedPool/Common/LockDurationField'
import { weeksToSeconds } from '../utils/formatSecondsToWeeks'

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

export const VaultRoiCalculatorModal = ({
  pool,
  initialView,
  ...rest
}: { pool: DeserializedPool; initialView?: number } & Partial<RoiCalculatorModalProps>) => {
  const {
    userData: {
      balance: { kazamaAsBigNumber },
    },
  } = useVaultPoolByKey(pool.vaultKey)

  const { getLockedApy, flexibleApy } = useVaultApy()
  const { t } = useTranslation()

  const [kazamaVaultView, setKazamaVaultView] = useState(initialView || 0)

  const [duration, setDuration] = useState(() => weeksToSeconds(1))

  const buttonMenuItems = useMemo(
    () => [
      <ButtonMenuItem key="Flexible"><KazamaTextButton>{t('Flexible')}</KazamaTextButton></ButtonMenuItem>,
      <ButtonMenuItem key="Locked"><KazamaTextButton>{t('Locked')}</KazamaTextButton></ButtonMenuItem>,
    ],
    [t],
  )

  const apy = useMemo(() => {
    return kazamaVaultView === 0 ? flexibleApy : getLockedApy(duration)
  }, [kazamaVaultView, getLockedApy, flexibleApy, duration])

  return (
    <RoiCalculatorModal
      stakingTokenSymbol={pool.stakingToken.symbol}
      apy={+apy}
      initialState={{
        controls: {
          compounding: false, // no compounding if apy is specify
        },
      }}
      linkHref="/swap"
      linkLabel={t('Get %symbol%', { symbol: pool.stakingToken.symbol })}
      earningTokenPrice={pool.earningTokenPrice}
      stakingTokenPrice={pool.stakingTokenPrice}
      stakingTokenBalance={
        pool.userData?.stakingTokenBalance ? kazamaAsBigNumber.plus(pool.userData?.stakingTokenBalance) : kazamaAsBigNumber
      }
      autoCompoundFrequency={1}
      strategy={
        kazamaVaultView
          ? (state, dispatch) => (
              <LockedRoiStrategy
                state={state}
                dispatch={dispatch}
                stakingTokenPrice={pool.stakingTokenPrice}
                earningTokenPrice={pool.earningTokenPrice}
                duration={duration}
              />
            )
          : null
      }
      header={
        pool.vaultKey === VaultKey.KazamaVault ? (
          <ButtonMenu
            mb="24px"
            fullWidth
            scale="sm"
            variant="primary"
            activeIndex={kazamaVaultView}
            onItemClick={setKazamaVaultView}
          >
            {buttonMenuItems}
          </ButtonMenu>
        ) : (
          <></>
        )
      }
      {...rest}
    >
      {kazamaVaultView && (
        <Box mt="16px">
          <LockDurationField duration={duration} setDuration={setDuration} isOverMax={false} />
        </Box>
      )}
    </RoiCalculatorModal>
  )
}

function LockedRoiStrategy({ state, dispatch, earningTokenPrice, duration, stakingTokenPrice }) {
  const { getLockedApy } = useVaultApy()
  const { principalAsUSD, roiUSD } = state.data
  const { compounding, compoundingFrequency, stakingDuration, mode } = state.controls

  useEffect(() => {
    if (mode === CalculatorMode.ROI_BASED_ON_PRINCIPAL) {
      const principalInUSDAsNumber = parseFloat(principalAsUSD)
      const interest =
        (principalInUSDAsNumber / earningTokenPrice) * (+getLockedApy(duration) / 100) * (duration / 31449600)

      const hasInterest = !Number.isNaN(interest)
      const roiTokens = hasInterest ? interest : 0
      const roiAsUSD = hasInterest ? roiTokens * earningTokenPrice : 0
      const roiPercentage = hasInterest
        ? getRoi({
            amountEarned: roiAsUSD,
            amountInvested: principalInUSDAsNumber,
          })
        : 0
      dispatch({ type: 'setRoi', payload: { roiUSD: roiAsUSD, roiTokens, roiPercentage } })
    }
  }, [
    principalAsUSD,
    stakingDuration,
    earningTokenPrice,
    compounding,
    compoundingFrequency,
    mode,
    duration,
    dispatch,
    getLockedApy,
  ])

  useEffect(() => {
    if (mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI) {
      const principalUSD = roiUSD / (+getLockedApy(duration) / 100) / (duration / 31449600)
      const roiPercentage = getRoi({
        amountEarned: roiUSD,
        amountInvested: principalUSD,
      })
      const principalToken = principalUSD / stakingTokenPrice
      dispatch({
        type: 'setPrincipalForTargetRoi',
        payload: {
          principalAsUSD: principalUSD.toFixed(2),
          principalAsToken: principalToken.toFixed(10),
          roiPercentage,
        },
      })
    }
  }, [dispatch, duration, getLockedApy, mode, roiUSD, stakingTokenPrice])

  return null
}
