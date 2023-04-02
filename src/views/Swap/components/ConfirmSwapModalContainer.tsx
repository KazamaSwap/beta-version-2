import { SwapModal } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'

const ConfirmSwapModalContainer = ({ children, handleDismiss }) => {
  const { t } = useTranslation()

  return (
    <SwapModal title={t('Confirm Swap')} headerBackground="gradients.cardHeader" onDismiss={handleDismiss}>
      {children}
    </SwapModal>
  )
}

export default ConfirmSwapModalContainer
