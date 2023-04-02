import { memo, ReactNode } from 'react'
import { StakeMessage, StakeMessageText, Box, Flex, useMatchBreakpoints } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import Trans from 'components/Trans'
import { VaultPosition } from 'utils/kazamaPool'

import ConvertToFlexibleButton from '../Buttons/ConvertToFlexibleButton'
import ExtendButton from '../Buttons/ExtendDurationButton'
import { AfterLockedActionsPropsType } from '../types'

const msg: Record<VaultPosition, ReactNode> = {
  [VaultPosition.None]: null,
  [VaultPosition.Flexible]: null,
  [VaultPosition.Locked]: null,
  [VaultPosition.LockedEnd]: (
    <Trans>
      The lock period has ended. Convert to flexible staking or renew your position to start a new lock staking.
    </Trans>
  ),
  [VaultPosition.AfterBurning]: (
    <Trans>
      The lock period has ended. To avoid more rewards being burned convert to flexible or renew your position.
    </Trans>
  ),
}

const AfterLockedActions: React.FC<React.PropsWithChildren<AfterLockedActionsPropsType>> = ({
  currentLockedAmount,
  stakingToken,
  position,
  isInline,
}) => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const isDesktopView = isInline && isDesktop
  const Container = isDesktopView ? Flex : Box

  return (
    <StakeMessage
      variant="info"
      mb="16px"
      action={
        <Container mt={!isDesktopView && '8px'} ml="10px">
          <ConvertToFlexibleButton
            mb={!isDesktopView && '8px'}
            minWidth={isDesktopView && '200px'}
            mr={isDesktopView && '14px'}
          />
          <ExtendButton
            modalTitle={t('Renew Lock')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentLockedAmount}
            minWidth="186px"
          >
            {t('Renew')}
          </ExtendButton>
        </Container>
      }
      actionInline={isDesktopView}
    >
      <StakeMessageText>{msg[position]}</StakeMessageText>
    </StakeMessage>
  )
}

export default memo(AfterLockedActions)
