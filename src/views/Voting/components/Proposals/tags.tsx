import { TagProps } from '@kazamaswap/uikit'
import { ClosedTag, CommunityTag, CoreTag, SoonTag, VoteNowTag } from 'components/Tags'
import { ProposalState } from 'state/types'

interface ProposalStateTagProps extends TagProps {
  proposalState: ProposalState
}

export const ProposalStateTag: React.FC<React.PropsWithChildren<ProposalStateTagProps>> = ({
  proposalState,
  ...props
}) => {
  if (proposalState === ProposalState.ACTIVE) {
    return <VoteNowTag {...props} />
  }

  if (proposalState === ProposalState.PENDING) {
    return <SoonTag {...props} />
  }

  return <ClosedTag {...props} />
}

interface ProposalTypeTagProps extends TagProps {
  isCoreProposal: boolean
}

export const ProposalTypeTag: React.FC<React.PropsWithChildren<ProposalTypeTagProps>> = ({
  isCoreProposal,
  ...props
}) => {
  if (isCoreProposal) {
    return <CoreTag {...props} />
  }

  return <CommunityTag {...props} />
}
