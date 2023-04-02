import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { Button, AutoRenewIcon, Box, Flex, Message, MessageText, Text } from '@kazamaswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from '@kazamaswap/localization'
import { MAX_LOCK_DURATION } from 'config/constants/pools'
import { getBalanceAmount } from 'utils/formatBalance'
import { useIfoCeiling } from 'state/pools/hooks'

import { LockedModalBodyPropsType, ModalValidator } from '../types'

import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from '../hooks/useLockedPool'
import { ENABLE_EXTEND_LOCK_AMOUNT } from '../../../helpers'

export const KazamaHeaderText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 3.00px; 
   font-weight: 400;
   margin-bottom: 15px;
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

export const KazamaTextBig = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 24px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const ExtendEnable = dynamic(() => import('./ExtendEnable'), { ssr: false })

const LockedModalBody: React.FC<React.PropsWithChildren<LockedModalBodyPropsType>> = ({
  stakingToken,
  onDismiss,
  lockedAmount,
  currentBalance,
  currentDuration,
  currentDurationLeft,
  editAmountOnly,
  prepConfirmArg,
  validator,
  customOverview,
}) => {
  const { t } = useTranslation()
  const ceiling = useIfoCeiling()
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    stakingToken,
    onDismiss,
    lockedAmount,
    prepConfirmArg,
  })

  const { isValidAmount, isValidDuration, isOverMax }: ModalValidator = useMemo(() => {
    return typeof validator === 'function'
      ? validator({
          duration,
        })
      : {
          isValidAmount: lockedAmount?.toNumber() > 0 && getBalanceAmount(currentBalance).gte(lockedAmount),
          isValidDuration: duration > 0 && duration <= MAX_LOCK_DURATION,
          isOverMax: duration > MAX_LOCK_DURATION,
        }
  }, [validator, currentBalance, lockedAmount, duration])

  const kazamaNeeded = useMemo(
    () => isValidDuration && currentDuration && currentDuration + duration > MAX_LOCK_DURATION,
    [isValidDuration, currentDuration, duration],
  )

  const hasEnoughBalanceToExtend = useMemo(() => currentBalance?.gte(ENABLE_EXTEND_LOCK_AMOUNT), [currentBalance])

  const needsEnable = useMemo(() => kazamaNeeded && !hasEnoughBalanceToExtend, [kazamaNeeded, hasEnoughBalanceToExtend])

  return (
    <>
      <Box mb="16px">
        {editAmountOnly || (
          <>
            <LockDurationField
              isOverMax={isOverMax}
              currentDuration={currentDuration}
              currentDurationLeft={currentDurationLeft}
              setDuration={setDuration}
              duration={duration}
            />
          </>
        )}
      </Box>
      {customOverview ? (
        customOverview({
          isValidDuration,
          duration,
        })
      ) : (
        <Overview
          isValidDuration={isValidDuration}
          openCalculator={_noop}
          duration={duration}
          lockedAmount={lockedAmount?.toNumber()}
          usdValueStaked={usdValueStaked}
          showLockWarning
          ceiling={ceiling}
        />
      )}

      {kazamaNeeded ? (
        hasEnoughBalanceToExtend ? (
          <Text fontSize="12px" mt="24px">
            {t('0.0001 KAZAMA will be spent to extend')}
          </Text>
        ) : (
          <Message variant="warning" mt="24px">
            <MessageText maxWidth="200px">{t('0.0001 KAZAMA required for enabling extension')}</MessageText>
          </Message>
        )
      ) : null}

      <Flex mt="24px">
        {needsEnable ? (
          <ExtendEnable isValidAmount={isValidAmount} isValidDuration={isValidDuration} />
        ) : (
          <Button
            width="100%"
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={handleConfirmClick}
            disabled={!(isValidAmount && isValidDuration)}
          >
            <KazamaTextButton>
            {pendingTx ? t('Confirming') : t('Confirm lock')}
            </KazamaTextButton>
          </Button>
        )}
      </Flex>
    </>
  )
}

export default LockedModalBody
