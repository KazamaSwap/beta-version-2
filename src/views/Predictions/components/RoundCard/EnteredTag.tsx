import { BigNumber } from '@ethersproject/bignumber'
import { CheckmarkCircleIcon, CheckmarkCircleFillIcon, Tag, useTooltip } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { formatBnbv2 } from '../../helpers'

interface EnteredTagProps {
  amount?: BigNumber
  hasClaimed?: boolean
}

const EnteredTag: React.FC<React.PropsWithChildren<EnteredTagProps>> = ({ amount, hasClaimed = false }) => {
  const { t } = useTranslation()
  const { token, displayedDecimals } = useConfig()

  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>{`${formatBnbv2(amount, displayedDecimals)} ${token.symbol}`}</div>,
    { placement: 'bottom' },
  )

  return (
    <>
      <span ref={targetRef}>
        <Tag
          variant="secondary"
          fontWeight="bold"
          textTransform="uppercase"
          outline={!hasClaimed}
          startIcon={hasClaimed ? <CheckmarkCircleFillIcon width="18px" /> : <CheckmarkCircleIcon width="18px" />}
        >
          {hasClaimed ? t('Claimed') : t('Entered')}
        </Tag>{' '}
      </span>{' '}
      {tooltipVisible && tooltip}
    </>
  )
}

export default EnteredTag
