import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@kazamaswap/wagmi'
import { Button, Flex, Text, InjectedModalProps } from '@kazamaswap/uikit'
import { formatBigNumber } from 'utils/formatBalance'
import { getKazamaProfileAddress } from 'utils/addressHelpers'
import { useKazama } from 'hooks/useContract'
import { useGetKazamaBalance } from 'hooks/useTokenBalance'
import { useTranslation } from '@kazamaswap/localization'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { FetchStatus } from 'config/constants/types'
import { requiresApproval } from 'utils/requiresApproval'
import { useProfile } from 'state/profile/hooks'
import ProfileAvatar from 'components/ProfileAvatar'
import { UseEditProfileResponse } from './reducer'

interface StartPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
  goToRemove: UseEditProfileResponse['goToRemove']
  goToApprove: UseEditProfileResponse['goToApprove']
}

const DangerOutline = styled(Button).attrs({ variant: 'secondary' })`
  border-color: ${({ theme }) => theme.colors.failure};
  color: ${({ theme }) => theme.colors.failure};
  margin-bottom: 24px;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    border-color: ${({ theme }) => theme.colors.failure};
    opacity: 0.8;
  }
`

const AvatarWrapper = styled.div`
  height: 64px;
  width: 64px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`

const StartPage: React.FC<React.PropsWithChildren<StartPageProps>> = ({
  goToApprove,
  goToChange,
  goToRemove,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { reader: kazamaContract } = useKazama()
  const { profile } = useProfile()
  const { balance: kazamaBalance, fetchStatus } = useGetKazamaBalance()
  const {
    costs: { numberKazamaToUpdate, numberKazamaToReactivate },
    isLoading: isProfileCostsLoading,
  } = useGetProfileCosts()
  const [needsApproval, setNeedsApproval] = useState(null)
  const minimumKazamaRequired = profile?.isActive ? numberKazamaToUpdate : numberKazamaToReactivate
  const hasMinimumKazamaRequired = fetchStatus === FetchStatus.Fetched && kazamaBalance.gte(minimumKazamaRequired)

  /**
   * Check if the wallet has the required KAZAMA allowance to change their profile pic or reactivate
   * If they don't, we send them to the approval screen first
   */
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const approvalNeeded = await requiresApproval(
        kazamaContract,
        account,
        getKazamaProfileAddress(),
        minimumKazamaRequired,
      )
      setNeedsApproval(approvalNeeded)
    }

    if (account && !isProfileCostsLoading) {
      checkApprovalStatus()
    }
  }, [account, minimumKazamaRequired, setNeedsApproval, kazamaContract, isProfileCostsLoading])

  if (!profile) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <AvatarWrapper>
        <ProfileAvatar profile={profile} />
      </AvatarWrapper>
      <Flex alignItems="center" style={{ height: '48px' }} justifyContent="center">
        <Text as="p" color="failure">
          {!isProfileCostsLoading &&
            !hasMinimumKazamaRequired &&
            t('%minimum% KAZAMA required to change profile pic', { minimum: formatBigNumber(minimumKazamaRequired) })}
        </Text>
      </Flex>
      {profile.isActive ? (
        <>
          <Button
            width="100%"
            mb="8px"
            onClick={needsApproval === true ? goToApprove : goToChange}
            disabled={isProfileCostsLoading || !hasMinimumKazamaRequired || needsApproval === null}
          >
            {t('Change Profile Pic')}
          </Button>
          <DangerOutline width="100%" onClick={goToRemove}>
            {t('Remove Profile Pic')}
          </DangerOutline>
        </>
      ) : (
        <Button
          width="100%"
          mb="8px"
          onClick={needsApproval === true ? goToApprove : goToChange}
          disabled={isProfileCostsLoading || !hasMinimumKazamaRequired || needsApproval === null}
        >
          {t('Reactivate Profile')}
        </Button>
      )}
      <Button variant="text" width="100%" onClick={onDismiss}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default StartPage
