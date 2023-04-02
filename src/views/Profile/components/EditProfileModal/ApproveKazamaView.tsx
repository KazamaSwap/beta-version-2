import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { useKazama } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useProfile } from 'state/profile/hooks'
import { getKazamaProfileAddress } from 'utils/addressHelpers'
import { formatBigNumber } from 'utils/formatBalance'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveKazamaPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveKazamaPage: React.FC<React.PropsWithChildren<ApproveKazamaPageProps>> = ({ goToChange, onDismiss }) => {
  const { profile } = useProfile()
  const { t } = useTranslation()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const {
    costs: { numberKazamaToUpdate, numberKazamaToReactivate },
  } = useGetProfileCosts()
  const { signer: kazamaContract } = useKazama()

  if (!profile) {
    return null
  }

  const cost = profile.isActive ? numberKazamaToUpdate : numberKazamaToReactivate

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return kazamaContract.approve(getKazamaProfileAddress(), cost.mul(2).toString())
    })
    if (receipt?.status) {
      goToChange()
    }
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to reactivate:')}</Text>
        <Text>{formatBigNumber(cost)} KAZAMA</Text>
      </Flex>
      <Button
        disabled={isApproving}
        isLoading={isApproving}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
        width="100%"
        mb="8px"
        onClick={handleApprove}
      >
        {t('Enable')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default ApproveKazamaPage
