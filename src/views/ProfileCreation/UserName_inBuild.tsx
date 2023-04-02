import { FetchStatus } from 'config/constants/types';
import { formatDistance, parseISO } from 'date-fns';
import useToast from 'hooks/useToast';
import { useGetKazamaBalance } from 'hooks/useTokenBalance';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import fetchWithTimeout from 'utils/fetchWithTimeout';

import { formatUnits } from '@ethersproject/units';
import { useTranslation } from '@kazamaswap/localization';
import {
    AutoRenewIcon, Button, Card, CardBody, Checkbox, CheckmarkIcon, Flex, Heading,
    Input as UIKitInput, Skeleton, Text, useModal, WarningIcon
} from '@kazamaswap/uikit';
import { useSignMessage, useWeb3React } from '@kazamaswap/wagmi';

import useDebounce from '../../hooks/useDebounce';
import { isValidRoute, setUserNameRoute } from '../../utils/apiRoutes';
import { REGISTER_COST, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from './config';
import ConfirmProfileCreationModal from './ConfirmProfileCreationModal';
import useProfileCreation from './contexts/hook';

enum ExistingUserState {
  IDLE = 'idle', // initial state
  CREATED = 'created', // username has already been created
  NEW = 'new', // username has not been created
}

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
`

const Input = styled(UIKitInput)`
  padding-right: 40px;
`

const Indicator = styled(Flex)`
  align-items: center;
  height: 24px;
  justify-content: center;
  margin-top: -12px;
  position: absolute;
  right: 16px;
  top: 50%;
  width: 24px;
`

const UserName: React.FC<React.PropsWithChildren> = () => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const { selectedNft, actions, minimumKazamaRequired, allowance } = useProfileCreation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastError, toastSuccess } = useToast()
  const { signMessageAsync } = useSignMessage()
  const [userName, setUserName] = useState<string>(undefined)
  const [existingUserState, setExistingUserState] = useState<ExistingUserState>(ExistingUserState.IDLE)
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const fetchAbortSignal = useRef<AbortController>(null)
  const { balance: kazamaBalance, fetchStatus } = useGetKazamaBalance()
  const hasMinimumKazamaRequired = fetchStatus === FetchStatus.Fetched && kazamaBalance.gte(REGISTER_COST)
  const [onPresentConfirmProfileCreation] = useModal(
    <ConfirmProfileCreationModal
      userName={userName}
      selectedNft={selectedNft}
      account={account}
      minimumKazamaRequired={minimumKazamaRequired}
      allowance={allowance}
    />,
    false,
  )
  const isUserCreated = existingUserState === ExistingUserState.CREATED

  const [usernameToCheck, setUsernameToCheck] = useState<string>(undefined)

  const handleChange = (event) => {
    const { value } = event.target
    setUserName(value)
    setUsernameToCheck(value)
  }

  useEffect(() => {
    const fetchUsernameToCheck = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(isValidRoute, {
          method: 'post',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userName,
          })
        })
        const data = await res.json();

        if (data.status) {
          setIsValid(true)
        } else {
          setIsValid(false)
        }        
      } catch (e) {
        setIsValid(false)
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    if (userName?.length > 2) {
      fetchUsernameToCheck()
    } else {
      setIsValid(false)
    }
  }, [userName])

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      const signature = await signMessageAsync({ message: userName })
      const response = await fetch(setUserNameRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          username: userName,
          signature
        }),
      })
      const data = await response.json();
      console.log(data)
      toastSuccess('Success', data.message)
    } catch (error) {
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcknowledge = () => setIsAcknowledged(!isAcknowledged)

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 2 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Set Your Name')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Set Your Name')}
          </Heading>
          <Text as="p" color="textSubtle" mb="24px">
            {t(
              'Your name must be at least 3 and at most 15 standard letters and numbers long. You can’t change this once you click Confirm.',
            )}
          </Text>

          <InputWrap>
          <Input
            onChange={handleChange}
            isWarning={userName && !isValid}
            isSuccess={userName && isValid}
            minLength={3}
            maxLength={20}
            // disabled={isUserCreated}
            placeholder="Enter your name..."
            value={userName}
          />
          <Indicator>
            {isLoading && <AutoRenewIcon spin />}
            {!isLoading && isValid && userName && <CheckmarkIcon color="success" />}
            {!isLoading && !isValid && userName && <WarningIcon color="failure" />}
          </Indicator>
        </InputWrap>
          
          <Text color="textSubtle" fontSize="14px" py="4px" mb="16px" style={{ minHeight: '30px' }}>
            {message}
          </Text>
          <Text as="p" color="failure" mb="8px">
            {t(
              "Only reuse a name from other social media if you're OK with people viewing your wallet. You can't change your name once you click Confirm.",
            )}
          </Text>
          <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
            <Flex alignItems="center">
              <div style={{ flex: 'none' }}>
                <Checkbox id="checkbox" scale="sm" checked={isAcknowledged} onChange={handleAcknowledge} />
              </div>
              <Text ml="8px">{t('I understand that people can view my wallet if they know my username')}</Text>
            </Flex>
          </label>
          <Button onClick={handleConfirm} disabled={!isValid || isLoading || !isAcknowledged}>
            {t('Confirm')}
          </Button>
        </CardBody>
      </Card>
      <Button
        onClick={onPresentConfirmProfileCreation}
        disabled={!isValid}
        id="completeProfileCreation"
      >
        {t('Complete Profile')}
      </Button>
      {!hasMinimumKazamaRequired && (
        <Text color="failure" mt="16px">
          {t('A minimum of %num% KAZAMA is required', { num: formatUnits(REGISTER_COST) })}
        </Text>
      )}
    </>
  )
}

export default UserName
