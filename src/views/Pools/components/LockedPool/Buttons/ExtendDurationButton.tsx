import { useMemo } from 'react'
import { Button, useModal, ButtonProps } from '@kazamaswap/uikit'
import { ONE_WEEK_DEFAULT, MAX_LOCK_DURATION } from 'config/constants/pools'
import styled from 'styled-components'
import ExtendDurationModal from '../Modals/ExtendDurationModal'
import { ExtendDurationButtonPropsType } from '../types'

export const KazamaHeaderText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 3.00px; 
   font-weight: 400;
   margin-bottom: 48px;
`

export const KazamaText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 28px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 2.00px; 
   font-weight: 400;
`

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const ExtendDurationButton: React.FC<React.PropsWithChildren<ExtendDurationButtonPropsType & ButtonProps>> = ({
  modalTitle,
  stakingToken,
  currentLockedAmount,
  currentBalance,
  lockEndTime,
  lockStartTime,
  children,
  ...rest
}) => {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  const currentDuration = useMemo(() => Number(lockEndTime) - Number(lockStartTime), [lockEndTime, lockStartTime])
  const currentDurationLeft = useMemo(
    () => Math.max(Number(lockEndTime) - nowInSeconds, 0),
    [lockEndTime, nowInSeconds],
  )

  const [openExtendDurationModal] = useModal(
    <ExtendDurationModal
      modalTitle={modalTitle}
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      currentBalance={currentBalance}
      currentLockedAmount={currentLockedAmount}
      currentDuration={currentDuration}
      currentDurationLeft={currentDurationLeft}
    />,
    true,
    true,
    'ExtendDurationModal',
  )

  return (
    <Button
      disabled={Number.isFinite(currentDurationLeft) && MAX_LOCK_DURATION - currentDurationLeft < ONE_WEEK_DEFAULT}
      onClick={openExtendDurationModal}
      width="100%"
      variant="warning"
      {...rest}
    >
      <KazamaTextButton>
      {children}
      </KazamaTextButton>
    </Button>
  )
}

export default ExtendDurationButton
