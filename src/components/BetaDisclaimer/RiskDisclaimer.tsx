import styled from 'styled-components'
import { useEffect, memo } from 'react'
import { useModal, Text } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import DisclaimerModal from 'components/BetaDisclaimer/DisclaimerModal'
import { useUserAcceptedBetaRisk } from 'state/user/hooks'

export const SmallerText = styled(Text)`
   font-size: 10px;
`

function BetaDisclaimer() {
  const [hasAcceptedRisk, setHasAcceptedRisk] = useUserAcceptedBetaRisk()
  const { t } = useTranslation()

  const [onPresentRiskDisclaimer, onDismiss] = useModal(
    <DisclaimerModal
      id="beta-risk-disclaimer"
      checks={[
        {
          key: '1',
          content: 
          t(
            'I have read and understood it and want to enter',
          ),
        },
      ]}
      onSuccess={() => setHasAcceptedRisk(true)}
    />,
    false,
    false,
  )

  useEffect(() => {
    if (!hasAcceptedRisk) {
      onPresentRiskDisclaimer()
    }

    return () => {
      onDismiss()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAcceptedRisk])

  return null
}

export default memo(BetaDisclaimer)
