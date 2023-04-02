import { Token } from '@kazamaswap/sdk'
import styled from 'styled-components'
import { Flex, Message, MessageText, useMatchBreakpoints } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { memo } from 'react'
import { useVaultApy } from 'hooks/useVaultApy'

import ExtendButton from '../Buttons/ExtendDurationButton'
import useAvgLockDuration from '../hooks/useAvgLockDuration'

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

interface ConvertToLockProps {
  stakingToken: Token
  currentStakedAmount: number
  isInline?: boolean
}

const ConvertToLock: React.FC<React.PropsWithChildren<ConvertToLockProps>> = ({
  stakingToken,
  currentStakedAmount,
  isInline,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const isTableView = isInline && !isMobile
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { lockedApy } = useVaultApy({ duration: avgLockDurationsInSeconds })

  return (
    <Message
      variant="warning"
      action={
        <Flex mt={!isTableView && '8px'} flexGrow={1} ml={isTableView && '80px'}>
          <ExtendButton
            modalTitle={t('Convert to Lock')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentStakedAmount}
          >
            <KazamaTextButton>
            {t('Convert to Lock')}
            </KazamaTextButton>
          </ExtendButton>
        </Flex>
      }
      actionInline={isTableView}
    >
      <MessageText>
        {t('Lock staking users are earning an average of %amount%% APY. More benefits are coming soon.', {
          amount: lockedApy ? parseFloat(lockedApy).toFixed(2) : 0,
        })}
      </MessageText>
    </Message>
  )
}

export default memo(ConvertToLock)
