import styled from 'styled-components'
import { Modal } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { LotteryStatus } from 'config/constants/types'
import { useLottery } from 'state/lottery/hooks'
import useTheme from 'hooks/useTheme'
import PreviousRoundTicketsInner from './PreviousRoundTicketsInner'
import CurrentRoundTicketsInner from './CurrentRoundTicketsInner'

const StyledModal = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%
  }
`

interface TicketsBoxProps {
  roundStatus?: LotteryStatus
  onDismiss?: () => void
}

const TicketsBox: React.FC<React.PropsWithChildren<TicketsBoxProps>> = ({
  roundStatus,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { currentLotteryId } = useLottery()
  const isPreviousRound = roundStatus?.toLowerCase() === LotteryStatus.CLAIMABLE

  return (
    <StyledModal
    >
    <CurrentRoundTicketsInner />
    </StyledModal>
  )
}

export default TicketsBox
