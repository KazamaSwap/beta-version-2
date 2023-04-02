import { TooltipText, useTooltip } from '@kazamaswap/uikit'
import { DeserializedPool } from 'state/types'
import Balance from 'components/Balance'
import AutoEarningsBreakdown from '../AutoEarningsBreakdown'

interface RecentKazamaProfitBalanceProps {
  kazamaToDisplay: number
  pool: DeserializedPool
  account: string
}

const RecentKazamaProfitBalance: React.FC<React.PropsWithChildren<RecentKazamaProfitBalanceProps>> = ({
  kazamaToDisplay,
  pool,
  account,
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom-end',
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="14px" value={kazamaToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentKazamaProfitBalance
