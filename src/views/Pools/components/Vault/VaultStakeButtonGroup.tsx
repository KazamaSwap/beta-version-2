import { Box, Button, TooltipText, useTooltip } from '@kazamaswap/uikit'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from '@kazamaswap/localization'
import styled from 'styled-components'

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

export const VaultStakeButtonGroup = ({
  onFlexibleClick,
  onLockedClick,
}: {
  onFlexibleClick: () => void
  onLockedClick: () => void
}) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      {t(
        'Flexible staking offers flexibility for staking/unstaking whenever you want. Locked staking offers higher APY as well as other benefits.',
      )}
    </Box>,
    {},
  )
  return (
    <Box width="100%">
      <FlexGap gap="12px">
        <Button style={{ flex: 1 }} onClick={onFlexibleClick}>
          <KazamaTextButton>
          {t('Flexible')}
          </KazamaTextButton>
        </Button>
        {onLockedClick && (
          <Button style={{ flex: 1 }} onClick={onLockedClick} variant="warning">
            <KazamaTextButton>
            {t('Locked')}
            </KazamaTextButton>
          </Button>
        )}
      </FlexGap>
      {tooltipVisible && tooltip}
      {onLockedClick && (
        <TooltipText mt="16px" small ref={targetRef}>
          {t('What’s the difference?')}
        </TooltipText>
      )}
    </Box>
  )
}
