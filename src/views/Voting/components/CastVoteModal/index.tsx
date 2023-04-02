import { useState } from 'react'
import { Box, Modal } from '@kazamaswap/uikit'
import { useWeb3React, useSignMessage } from '@kazamaswap/wagmi'
import { useTranslation } from '@kazamaswap/localization'
import { SnapshotCommand } from 'state/types'
import useToast from 'hooks/useToast'
import useTheme from 'hooks/useTheme'
import { CastVoteModalProps, ConfirmVoteView } from './types'
import MainView from './MainView'
import DetailsView from './DetailsView'
import { generatePayloadData, Message, sendSnapshotData } from '../../helpers'
import useGetVotingPower from '../../hooks/useGetVotingPower'

const CastVoteModal: React.FC<React.PropsWithChildren<CastVoteModalProps>> = ({
  onSuccess,
  proposalId,
  vote,
  block,
  onDismiss,
}) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { signMessageAsync } = useSignMessage()
  const { toastError } = useToast()
  const { theme } = useTheme()
  const {
    isLoading,
    isError,
    total,
    kazamaBalance,
    kazamaVaultBalance,
    kazamaPoolBalance,
    poolsBalance,
    kazamaBnbLpBalance,
    lockedKazamaBalance,
    lockedEndTime,
  } = useGetVotingPower(block, modalIsOpen)

  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)
  const handleViewDetails = () => setView(ConfirmVoteView.DETAILS)

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  const handleDismiss = () => {
    setModalIsOpen(false)
    onDismiss()
  }

  const handleConfirmVote = async () => {
    try {
      setIsPending(true)
      const voteMsg = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.VOTE,
        payload: {
          proposal: proposalId,
          choice: vote.value,
        },
      })

      const sig = await signMessageAsync({ message: voteMsg })
      const msg: Message = { address: account, msg: voteMsg, sig }

      // Save proposal to snapshot
      await sendSnapshotData(msg)

      await onSuccess()

      handleDismiss()
    } catch (error) {
      toastError(t('Error'), (error as Error)?.message ?? t('Error occurred, please try again'))
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Box mb="24px">
        {view === ConfirmVoteView.MAIN && (
          <MainView
            vote={vote}
            isError={isError}
            isLoading={isLoading}
            isPending={isPending}
            total={total}
            lockedKazamaBalance={lockedKazamaBalance}
            lockedEndTime={lockedEndTime}
            onConfirm={handleConfirmVote}
            onViewDetails={handleViewDetails}
            onDismiss={handleDismiss}
          />
        )}
        {view === ConfirmVoteView.DETAILS && (
          <DetailsView
            total={total}
            kazamaBalance={kazamaBalance}
            kazamaVaultBalance={kazamaVaultBalance}
            kazamaPoolBalance={kazamaPoolBalance}
            poolsBalance={poolsBalance}
            kazamaBnbLpBalance={kazamaBnbLpBalance}
            block={block}
            lockedKazamaBalance={lockedKazamaBalance}
            lockedEndTime={lockedEndTime}
          />
        )}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
