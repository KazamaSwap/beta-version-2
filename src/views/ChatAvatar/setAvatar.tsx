/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useWeb3React } from '../../../packages/wagmi/src/useWeb3React';
import {
  ArrowDownIcon,
  BurnIcon,
  Card,
  CardBody,
  Heading,
  IconButton,
  Text,
  Input as UIKitInput,
  Button,
  AutoRenewIcon,
  CheckmarkIcon,
  Flex,
  Modal,
  WarningIcon,
  useModal,
  Skeleton,
  Checkbox,
} from '@kazamaswap/uikit'
import { useSignMessage } from '@kazamaswap/wagmi'
import { useTranslation } from '@kazamaswap/localization'
import styled from 'styled-components'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import Page from 'components/Layout/Page'
import { useProfile } from 'state/profile/hooks'
import { useRouter } from 'next/router'
import { isValidRoute, setAvatarRoute } from '../../utils/apiRoutes'
import { useKazamaBurn } from 'hooks/useContract'
import { CommitButton } from 'components/CommitButton';
import ProgressSteps from 'views/Swap/components/ProgressSteps';
import { ToastDescriptionWithTx } from 'components/Toast'
import { parseUnits } from '@ethersproject/units';
import { useGetKazamaBalance } from 'hooks/useTokenBalance'
import { useBalance } from 'wagmi'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 425px;
    max-width: 425px;
    border-radius: 16px;
    background: #141824;
    border-bottom: 2px solid #11141e;
  }
`

const StyledInputWrapper = styled.div`
padding: 0.75rem;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
`

const InputWrapper = styled.div`
display: flex;
background: transparent;
outline: none;
border-radius: 14px;
`

const StyledResultWrapper = styled.div`
padding: 0.75rem;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
`

const InfoWrapper = styled.div`
padding: 0.75rem;
border-radius: 14px;
border: 1px solid #1b2031;
margin-top: 10px;
`

const BurnWrapper = styled.div`
padding: 0.75rem;
border-radius: 14px;
border: 1px solid #1b2031;
margin-top: 3px;
margin-bottom: 15px;
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-down {
    fill: #fff !important;
  }
  .icon-up-down {
    display: none;
    fill: #fff !important;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const StyledSwitchButton = styled(SwitchIconButton)`
border-radius: 50%;
background: #191e2e;
z-index: 100;
border: 1px solid #11141e;
`

interface SetProfileAvatarModalProps {
  onDismiss?: () => void
  onDone?: () => void
}

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
`

const Input = styled(UIKitInput)`
  background: transparent;
  width: 100%;
  border-radius: 7px;
  border: 0px solid transparent !important;
  outline: none;
  box-shadow: none;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: 22px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  margin-bottom: 5px;
  &:disabled {
    background-color: transparent;
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: none !important;
    }};

  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 22px;
  }

 ::placeholder::focus {
    color: purple;
}
`

const Indicator = styled(Flex)`
  align-items: center;
  height: 24px;
  justify-content: center;
`

const ArrowWrapper = styled.div`
background-color: #201c29;
border-radius: 50px;
`

const SetNameButton = styled(Button)`
position: relative;
padding: 0.5rem 0;
background: rgba(238, 26, 121, 0.082);
border: 2px solid #EE1A78;
box-sizing: border-box;
border-radius: 8px;
height: 2.75rem;
transition: all .2s ease-in-out;
width: 100%;
`

const KAZAMA_TO_BURN = parseUnits('1000')

const SetProfileAvatar: React.FC<React.PropsWithChildren<SetProfileAvatarModalProps>> = ({ onDismiss, onDone }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isInitialized, hasProfile } = useProfile()
  const router = useRouter()
  const { signMessageAsync } = useSignMessage()
  const [avatarImage, setAvatar] = useState<string>(undefined)
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isBurned, setIsBurned] = useState(false)
  const { toastError, toastSuccess } = useToast()
  const kazama = useKazamaBurn()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { data, isFetched } = useBalance({ addressOrName: account })
  const { balance: kazamaBalance } = useGetKazamaBalance()


  const handleChange = (event) => {
    const { value } = event.target
    setAvatar(value)
  }

  // useEffect(() => {
  //   if (account && hasProfile) {
  //     router.push(`/profile/${account.toLowerCase()}`)
  //   }
  // }, [account, hasProfile, router])

  // if (!isInitialized || isLoading) {
  //   return <PageLoader />
  // }

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      const signature = await signMessageAsync({ message: avatarImage })
      const response = await fetch(setAvatarRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          avatarimage: avatarImage,
          signature
        }),
      })
      const data = await response.json();
      console.log(data)
      toastSuccess('Success', data.message)
      onDone?.()
    } catch (error) {
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    } finally {
      setIsLoading(false)
    }
  }

  let balanceCheck: boolean;
  const BalanceMessage = () => {
  if (kazamaBalance >= KAZAMA_TO_BURN) {
    balanceCheck = true;
    return (
      <Flex style={{background: "#31D0AA", borderRadius: "7px", display: "inline-block", width: "100px", height: "20px"}}>
       <Text textAlign="center" fontSize="12px" color="#fff"> Check passed
       </Text>
      </Flex>
    )
  } else {
    return (
      <Flex style={{background: "#FF5958", borderRadius: "7px", display: "inline-block", width: "155px", height: "20px"}}>
      <Text textAlign="center" fontSize="12px" color="#fff"> Failed: not enough balance
      </Text>
     </Flex>
    )
  }
}

  return (
    <StyledModal title={t('Profile settings')} onDismiss={onDismiss} >
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex>
          <Text>
        1. Check balance
        </Text>
          </Flex>
          <Flex>
          {BalanceMessage()}
          </Flex>
        </Flex>
      <BurnWrapper>
      <Text fontSize="12px" color="#93acd3" textAlign="center">
      To activate a nickname you need to burn 1000 KAZAMA from your balance, so think carefully about your nickname.
      </Text>
      </BurnWrapper>
      <div style={{marginBottom: "3px"}}>
      <Text>
        2. Enter avatar URL
        </Text>
      </div>
 
        <div style={{textAlign: "center"}}>
        <StyledInputWrapper>

        <Flex style={{alignItems: "center", justifyContent: "center", width: "100%"}}>
        <InputWrapper>
          <Input
            disabled={!balanceCheck}
            onChange={handleChange}
            minLength={3}
            maxLength={200}
            // disabled={isUserCreated}
            placeholder={'Image URL ..'}
            value={avatarImage}
          />
        </InputWrapper>

      </Flex>
        </StyledInputWrapper>
        <div style={{ padding: '0 1rem', marginTop: '-1.25rem', marginBottom: '-1.25rem' }}>
          <StyledSwitchButton variant="light" scale="sm">
          <ArrowDownIcon />
          </StyledSwitchButton>
        </div>
        <StyledResultWrapper>
          <Indicator marginTop="10px" marginBottom="10px">
            {isLoading && <AutoRenewIcon width={32} spin />}
            {!isLoading && avatarImage && <CheckmarkIcon width={32} color="success" />}
          </Indicator>
</StyledResultWrapper>
<InfoWrapper>
  <Text fontSize="12px" color="#93acd3">
  Please note that your chat nickname will also be your future profile name. If you wish to change your nickname in the future you will have to burn KAZAMA again and your old nickname will become available for others to use, please keep this in mind.
  </Text>
</InfoWrapper>

    </div>
    <div style={{marginTop: "15px", marginBottom: "10px"}}>
    <ProgressSteps steps={[balanceCheck === true, isValid === true, isBurned === true]} />
    </div>
    <Flex>
    {isBurned ? 
        <CommitButton onClick={handleConfirm} disabled={isLoading || !isBurned} style={{marginTop: "7px", width: "100%"}}>
        {'Set Avatar'}
      </CommitButton>
      :
      <CommitButton style={{marginTop: "7px", width: "100%"}} disabled={isLoading}
      endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={async () => {
        const receipt = await fetchWithCatchTxError(() => {
          return kazama.burn(KAZAMA_TO_BURN)
        })
        if (receipt?.status) {
          toastSuccess(
            `${t('Burned successfully ..')}!`,
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('You can resume to step four ..')}
            </ToastDescriptionWithTx>,
          )
          setIsBurned(true)
        }
      }}
      >
      {pendingTx ? t('Burning') : t('Burn Kazama')}
      </CommitButton> 
  }
        </Flex>
    </StyledModal>
  )
}

export default SetProfileAvatar
