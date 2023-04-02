import styled from 'styled-components'
import { Button, AutoRenewIcon, Skeleton } from '@kazamaswap/uikit'
import { VaultKey } from 'state/types'
import { useTranslation } from '@kazamaswap/localization'
import { useVaultApprove } from '../../../hooks/useApprove'

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

interface ApprovalActionProps {
  vaultKey: VaultKey
  setLastUpdated: () => void
  isLoading?: boolean
}

const VaultApprovalAction: React.FC<React.PropsWithChildren<ApprovalActionProps>> = ({
  vaultKey,
  isLoading = false,
  setLastUpdated,
}) => {
  const { t } = useTranslation()

  const { handleApprove, pendingTx } = useVaultApprove(vaultKey, setLastUpdated)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={pendingTx}
          onClick={handleApprove}
          width="100%"
        >
          <KazamaTextButton>
          {t('Enable')}
          </KazamaTextButton>
        </Button>
      )}
    </>
  )
}

export default VaultApprovalAction
