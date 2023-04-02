import styled from 'styled-components'
import { Button, AutoRenewIcon, ButtonProps } from '@kazamaswap/uikit'
import { useState, memo } from 'react'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@kazamaswap/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useBKazamaFarmBoosterProxyFactoryContract } from 'hooks/useContract'

export const KazamaTextButton = styled(Button)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const MAX_GAS_LIMIT = 2500000

interface CreateProxyButtonProps extends ButtonProps {
  onDone?: () => void
}

const CreateProxyButton: React.FC<React.PropsWithChildren<CreateProxyButtonProps>> = ({ onDone, ...props }) => {
  const { t } = useTranslation()
  const farmBoosterProxyFactoryContract = useBKazamaFarmBoosterProxyFactoryContract()
  const [isCreateProxyLoading, setIsCreateProxyLoading] = useState(false)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading } = useCatchTxError()

  return (
    <KazamaTextButton
      width="100%"
      {...props}
      onClick={async () => {
        try {
          setIsCreateProxyLoading(true)
          const receipt = await fetchWithCatchTxError(() =>
            farmBoosterProxyFactoryContract.createFarmBoosterProxy({ gasLimit: MAX_GAS_LIMIT }),
          )
          if (receipt?.status) {
            toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
          }
        } catch (error) {
          console.error(error)
        } finally {
          setIsCreateProxyLoading(false)
          onDone?.()
        }
      }}
      isLoading={isCreateProxyLoading || loading}
      endIcon={isCreateProxyLoading || loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
    >
      {isCreateProxyLoading || loading ?
      t('Confirming...') : t('Enable Boost')}
    </KazamaTextButton>
  )
}

export default memo(CreateProxyButton)
