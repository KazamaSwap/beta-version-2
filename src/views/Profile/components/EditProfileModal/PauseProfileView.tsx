import { useState } from 'react'
import { AutoRenewIcon, Button, Checkbox, Flex, InjectedModalProps, Text } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { useProfile } from 'state/profile/hooks'
import useToast from 'hooks/useToast'
import { formatBigNumber } from 'utils/formatBalance'
import { useProfileContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'

interface PauseProfilePageProps extends InjectedModalProps {
  onSuccess?: () => void
}

const PauseProfilePage: React.FC<React.PropsWithChildren<PauseProfilePageProps>> = ({ onDismiss, onSuccess }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const { profile, refresh: refreshProfile } = useProfile()
  const {
    costs: { numberKazamaToReactivate },
  } = useGetProfileCosts()
  const { t } = useTranslation()
  const kazamaProfileContract = useProfileContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()

  const handleChange = () => setIsAcknowledged(!isAcknowledged)

  const handleDeactivateProfile = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(kazamaProfileContract, 'pauseProfile')
    })
    if (receipt?.status) {
      // Re-fetch profile
      refreshProfile()
      toastSuccess(t('Profile Paused!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      if (onSuccess) {
        onSuccess()
      }
      onDismiss?.()
    }
  }

  if (!profile) {
    return null
  }

  return (
    <>
      <Text as="p" color="failure" mb="24px">
        {t('This will suspend your profile and send your Collectible back to your wallet')}
      </Text>
      <Text as="p" color="textSubtle" mb="24px">
        {t(
          "While your profile is suspended, you won't be able to earn points, but your achievements and points will stay associated with your profile",
        )}
      </Text>
      <Text as="p" color="textSubtle" mb="24px">
        {t('Cost to reactivate in the future: %cost% KAZAMA', { cost: formatBigNumber(numberKazamaToReactivate) })}
      </Text>
      <label htmlFor="acknowledgement" style={{ cursor: 'pointer', display: 'block', marginBottom: '24px' }}>
        <Flex alignItems="center">
          <Checkbox id="acknowledgement" checked={isAcknowledged} onChange={handleChange} scale="sm" />
          <Text ml="8px">{t('I understand')}</Text>
        </Flex>
      </label>
      <Button
        width="100%"
        isLoading={isConfirming}
        endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : null}
        disabled={!isAcknowledged || isConfirming}
        onClick={handleDeactivateProfile}
        mb="8px"
      >
        {t('Confirm')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss}>
        {t('Close Window')}
      </Button>
    </>
  )
}

export default PauseProfilePage
