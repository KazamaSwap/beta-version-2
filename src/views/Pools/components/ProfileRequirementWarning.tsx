import { Box, Message, MessageText } from '@kazamaswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@kazamaswap/localization'
import { DeserializedPool } from 'state/types'
import { useProfileRequirement } from '../hooks/useProfileRequirement'

export function ProfileRequirementWarning({
  profileRequirement,
}: {
  profileRequirement: DeserializedPool['profileRequirement']
}) {
  const { t } = useTranslation()
  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)
  return (
    <Message variant="warning">
      <Box>
        <MessageText>
          {notMeetRequired &&
            notMeetThreshold &&
            t('This pool requires an active KazamaSwap Profile and %amount% profile points.', {
              amount: profileRequirement.thresholdPoints.toNumber().toLocaleString(),
            })}
          {notMeetRequired && !notMeetThreshold && t('This pool requires an active KazamaSwap Profile')}
          {!notMeetRequired &&
            notMeetThreshold &&
            t('This pool requires %amount% profile points.', {
              amount: profileRequirement.thresholdPoints.toNumber().toLocaleString(),
            })}
        </MessageText>
        {(notMeetRequired || notMeetThreshold) && (
          <MessageText bold>
            {notMeetRequired ? (
              <NextLinkFromReactRouter style={{ textDecoration: 'underline' }} to="/create-profile">
                {t('Create Profile')} »
              </NextLinkFromReactRouter>
            ) : (
              <NextLinkFromReactRouter style={{ textDecoration: 'underline' }} to="/profile">
                {t('Go to Profile')} »
              </NextLinkFromReactRouter>
            )}
          </MessageText>
        )}
      </Box>
    </Message>
  )
}
