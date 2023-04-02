import { useCallback, memo } from 'react'
import { Button, useModal, Skeleton } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import styled from 'styled-components'
import { usePool } from 'state/pools/hooks'
import AddAmountModal from '../Modals/AddAmountModal'
import { AddButtonProps } from '../types'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'

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

const AddKazamaButton: React.FC<React.PropsWithChildren<AddButtonProps>> = ({
  currentBalance,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
  stakingTokenBalance,
}) => {
  const {
    pool: { userDataLoaded },
  } = usePool(0)

  const { t } = useTranslation()

  const [openAddAmountModal] = useModal(
    <AddAmountModal
      currentLockedAmount={currentLockedAmount}
      currentBalance={currentBalance}
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      lockEndTime={lockEndTime}
      stakingTokenBalance={stakingTokenBalance}
    />,
    true,
    true,
    'AddAmountModal',
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const handleClicked = useCallback(() => {
    return currentBalance.gt(0) ? openAddAmountModal() : onPresentTokenRequired()
  }, [currentBalance, openAddAmountModal, onPresentTokenRequired])

  return userDataLoaded ? (
    <Button onClick={handleClicked} width="100%" style={{ whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0 }}>
      <KazamaTextButton>
      {t('Add KAZAMA')}
      </KazamaTextButton>
    </Button>
  ) : (
    <Skeleton height={48} />
  )
}

export default memo(AddKazamaButton)
