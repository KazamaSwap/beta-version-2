import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useCallback, useMemo, useState } from 'react'
import { Button, Modal, AutoRenewIcon, Message, MessageText, IconButton, Text } from '@kazamaswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import { useTranslation } from '@kazamaswap/localization'
import { getFullDisplayBalance } from 'utils/formatBalance'

const StyledInputWrapper = styled.div`
padding: 0.75rem;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
text-align: center;
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-down {
    fill: #fff !important;
  }
  .icon-up-down {
    display: none;
    fill: #fff !important;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const InfoWrapper = styled.div`
padding: 0.75rem;
border-radius: 14px;
border: 1px solid #1b2031;
margin-top: 10px;
`

const StyledSwitchButton = styled(SwitchIconButton)`
border-radius: 50%;
background: #191e2e;
z-index: 100;
border: 1px solid #11141e;
`

const StyledActions = styled.div`
padding-top: 10px !important;
padding-bottom: 10px !important;
`

interface WithdrawModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  showActiveBooster?: boolean
}

const WithdrawModal: React.FC<React.PropsWithChildren<WithdrawModalProps>> = ({
  onConfirm,
  onDismiss,
  max,
  tokenName = '',
  showActiveBooster,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={t('Unstake LP tokens')} onDismiss={onDismiss}>
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={t('Unstake')}
      />
      {showActiveBooster ? (
        <Message variant="warning" mt="8px">
          <MessageText>
            {t('The yield booster multiplier will be updated based on the latest staking conditions.')}
          </MessageText>
        </Message>
      ) : null}
              <InfoWrapper style={{textAlign: 'center'}}>
  <Text fontSize="12px" color="#93acd3">
  By withdrawing your stake or part of your stake, your outstanding rewards will automatically be sent to your wallet  </Text>
        </InfoWrapper>
      <StyledActions>
        {pendingTx ? (
          <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
            {t('Confirming')}
          </Button>
        ) : (
          <Button
            width="100%"
            disabled={!valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val)
              onDismiss?.()
              setPendingTx(false)
            }}
          >
            {t('Confirm unstake')}
          </Button>
        )}
      </StyledActions>
    </Modal>
  )
}

export default WithdrawModal
