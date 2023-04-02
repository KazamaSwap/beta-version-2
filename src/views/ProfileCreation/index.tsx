import ProfileWrapper from 'components/Layout/ProfileWrapper';
import PageLoader from 'components/Loader/PageLoader';
import { NextLinkFromReactRouter } from 'components/NextLink';
import { FetchStatus } from 'config/constants/types';
import { formatDistance, parseISO } from 'date-fns';
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice';
import useCatchTxError from 'hooks/useCatchTxError';
import { useProfileContract } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import { useGetKazamaBalance } from 'hooks/useTokenBalance';
import { useRouter } from 'next/router';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { NftLocation } from 'state/nftMarket/types';
import { useProfile } from 'state/profile/hooks';
import styled from 'styled-components';
import { getKazamaProfileAddress } from 'utils/addressHelpers';
import { getUserRoute, isValidRoute, setUserNameRoute } from 'utils/apiRoutes';
import { getErc721Contract } from 'utils/contractHelpers';
import ProgressSteps from 'views/Migration/components/ProgressSteps';
import { nftsBaseUrl } from 'views/Nft/market/constants';
import { useSigner } from 'wagmi';

import { formatUnits } from '@ethersproject/units';
import { useTranslation } from '@kazamaswap/localization';
import {
    AutoRenewIcon, Box, Button, Card, CardBody, CardFooter, Checkbox, CheckmarkIcon, Flex, Heading,
    Input as UIKitInput, ProfileCreationModal, Skeleton, Text, useModal, WarningIcon
} from '@kazamaswap/uikit';
import { useSignMessage, useWeb3React } from '@kazamaswap/wagmi';

import profileABI from '../../config/abi/kazamaProfile.json';
import useDebounce from '../../hooks/useDebounce';
import multicall from '../../utils/multicall';
import { useNftsForAddress } from '../Nft/market/hooks/useNftsForAddress';
import { REGISTER_COST, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from './config';
import ConfirmProfileCreationModal from './ConfirmProfileCreationModal';
import useProfileCreation from './contexts/hook';
import ProfileCreationProvider, {
    ProfileCreationContext
} from './contexts/ProfileCreationProvider';
import Header from './Header';
import NextStepButton from './NextStepButton';
import SelectionCard from './SelectionCard';

enum ExistingUserState {
  IDLE = 'idle', // initial state
  CREATED = 'created', // username has already been created
  NEW = 'new', // username has not been created
}

interface ProfileCreationProps {
  onDismiss?: () => void
}

const Link = styled(NextLinkFromReactRouter)`
  color: ${({ theme }) => theme.colors.primary};
`

const NftWrapper = styled.div`
  margin-bottom: 24px;
`

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

const ProfilePicture: React.FC = () => {
  const { account } = useWeb3React()
  const [isApproved, setIsApproved] = useState(false)
  const [userProfileCreationNfts, setUserProfileCreationNfts] = useState(null)
  const { selectedNft, actions } = useContext(ProfileCreationContext)
  const profileContract = useProfileContract(false)
  const { isLoading: isProfileLoading, profile } = useProfile()
  const { nfts, isLoading: isUserNftLoading } = useNftsForAddress(account, profile, isProfileLoading)

  useEffect(() => {
    const fetchUserKazamaCollectibles = async () => {
      try {
        const nftsByCollection = Array.from(
          nfts.reduce((acc, value) => {
            acc.add(value.collectionAddress)
            return acc
          }, new Set<string>()),
        )

        if (nftsByCollection.length > 0) {
          const nftRole = await profileContract.NFT_ROLE()
          const collectionsNftRoleCalls = nftsByCollection.map((collectionAddress) => {
            return {
              address: profileContract.address,
              name: 'hasRole',
              params: [nftRole, collectionAddress],
            }
          })
          const collectionRolesRaw = await multicall(profileABI, collectionsNftRoleCalls)
          const collectionRoles = collectionRolesRaw.flat()
          setUserProfileCreationNfts(
            nfts.filter((nft) => collectionRoles[nftsByCollection.indexOf(nft.collectionAddress)]),
          )
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (!isUserNftLoading) {
      fetchUserKazamaCollectibles()
    }
  }, [nfts, profileContract, isUserNftLoading])

  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { data: signer } = useSigner()

  const handleApprove = async () => {
    const contract = getErc721Contract(selectedNft.collectionAddress, signer)
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(contract, 'approve', [getKazamaProfileAddress(), selectedNft.tokenId])
    })
    if (receipt?.status) {
      toastSuccess(t('Enabled'), t('Please progress to the next step.'))
      setIsApproved(true)
    }
  }

  if (userProfileCreationNfts?.length === 0) {
    return (
      <>
        <Heading scale="xl" mb="24px">
          {t('Oops!')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {t('We couldn’t find any Kazama Collectibles in your wallet.')}
        </Text>
        <Text as="p">
          {t(
            'You need a Kazama Collectible to finish setting up your profile. If you sold or transferred your starter collectible to another wallet, you’ll need to get it back or acquire a new one somehow. You can’t make a new starter with this wallet address.',
          )}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 1 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Set Profile Picture')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose collectible')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose a profile picture from the eligible collectibles (NFT) in your wallet, shown below.')}
          </Text>
          {/* <Text as="p" color="textSubtle" mb="24px">
            {t('Only approved Kazama Collectibles can be used.')}
            <Link to={`${nftsBaseUrl}/collections`} style={{ marginLeft: '4px' }}>
              {t('See the list >')}
            </Link>
          </Text> */}
          <NftWrapper>
            {userProfileCreationNfts ? (
              userProfileCreationNfts
                .filter((walletNft) => walletNft.location === NftLocation.WALLET)
                .map((walletNft) => {
                  return (
                    <SelectionCard
                      name="profilePicture"
                      key={`${walletNft.collectionAddress}#${walletNft.tokenId}`}
                      value={walletNft.tokenId}
                      image={walletNft.image.thumbnail}
                      isChecked={walletNft.tokenId === selectedNft.tokenId}
                      onChange={(value: string) => actions.setSelectedNft(value, walletNft.collectionAddress)}
                    >
                      <Text bold>{walletNft.name}</Text>
                    </SelectionCard>
                  )
                })
            ) : (
              <Skeleton width="100%" height="64px" />
            )}
          </NftWrapper>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Allow collectible to be locked')}
          </Heading>
          <Text as="p" color="textSubtle" mb="16px">
            {t(
              "The collectible you've chosen will be locked in a smart contract while it’s being used as your profile picture. Don't worry - you'll be able to get it back at any time.",
            )}
          </Text>
          <Button
            isLoading={isApproving}
            disabled={isApproved || isApproving || selectedNft.tokenId === null}
            onClick={handleApprove}
            endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            id="approveStarterCollectible"
          >
            {t('Enable')}
          </Button>
        </CardBody>
      </Card>
      {/* <NextStepButton onClick={actions.nextStep} disabled={selectedNft.tokenId === null || !isApproved || isApproving}>
        {t('Next Step')}
      </NextStepButton> */}
    </>
  )
}

const UserName: React.FC<React.PropsWithChildren> = () => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const { selectedNft, userName, actions, minimumKazamaRequired, allowance } = useProfileCreation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastError } = useToast()
  const { signMessageAsync } = useSignMessage()
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
  const debouncedUsernameToCheck = useDebounce(usernameToCheck, 200)

  useEffect(() => {
    const fetchUsernameToCheck = async (abortSignal) => {
      try {
        setIsLoading(true)
        if (!debouncedUsernameToCheck) {
          setIsValid(false)
          setMessage('')
          fetchAbortSignal.current = null
        } else {
          const res = await fetch(isValidRoute, {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: userName,
            })
          })
          console.log("debug",userName.length, res)
          const data = await res.json();
  
          if (data.status) {
            setIsValid(true)
            setMessage('')
          } else {
            setIsValid(false)
            setMessage(data?.error?.message)
          }   

          fetchAbortSignal.current = null

          // if (res.ok) {
          //   setIsValid(true)
          //   setMessage('')
          // } else {
          //   const data = await res.json()
          //   setIsValid(false)
          //   setMessage(data?.error?.message)
          // }
        }
      } catch (e) {
        setIsValid(false)
        if (e instanceof Error && e.name !== 'AbortError') {
          setMessage(t('Error fetching data'))
          console.error(e)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (fetchAbortSignal.current) {
      fetchAbortSignal.current.abort()
    }

    fetchAbortSignal.current = new AbortController()

    fetchUsernameToCheck(fetchAbortSignal.current.signal)
  }, [debouncedUsernameToCheck, t])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    actions.setUserName(value)
    setUsernameToCheck(value)
  }

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
          signature,
        }),
      })

      if (response.ok) {
        setExistingUserState(ExistingUserState.CREATED)
      } else {
        const data = await response.json()
        toastError(t('Error'), data?.error?.message)
      }
    } catch (error) {
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcknowledge = () => setIsAcknowledged(!isAcknowledged)

  // Perform an initial check to see if the wallet has already created a username
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(getUserRoute, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: account,
          }),
        })
        const data = await response.json()

        if (response.ok) {
          const dateCreated = formatDistance(parseISO(data.created_at), new Date())
          setMessage(t('Created %dateCreated% ago', { dateCreated }))

          actions.setUserName(data.username)
          setExistingUserState(ExistingUserState.CREATED)
          setIsValid(true)
        } else {
          setExistingUserState(ExistingUserState.NEW)
        }
      } catch (error) {
        toastError(t('Error'), t('Unable to verify username'))
      }
    }

    if (account) {
      fetchUser()
    }
  }, [account, setExistingUserState, setIsValid, setMessage, actions, toastError, t])

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
                minLength={USERNAME_MIN_LENGTH}
                maxLength={USERNAME_MAX_LENGTH}
                disabled={isUserCreated}
                placeholder={t('Enter your name...')}
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
          <Button onClick={handleConfirm} disabled={!isValid || isUserCreated || isLoading || !isAcknowledged}>
            {t('Confirm')}
          </Button>
        </CardBody>
      </Card>
      <Button
        onClick={onPresentConfirmProfileCreation}
        disabled={!isValid || !isUserCreated}
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


const ProfileCreation: React.FC<React.PropsWithChildren<ProfileCreationProps>> = ({ onDismiss}) => {
  const { account } = useWeb3React()
  const { isInitialized, isLoading, hasProfile } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (account && hasProfile) {
      router.push(`/profile/${account.toLowerCase()}`)
    }
  }, [account, hasProfile, router])

  if (!isInitialized || isLoading) {
    return <PageLoader />
  }

  return (
    <>
<ProfileCreationModal title="Create Profile .." onDismiss={onDismiss} >
      <ProfileCreationProvider>
          {/* <Header /> */}
          <Box maxHeight="300x" overflowY="auto" pr="5px">
          <ProfileWrapper>
          <UserName />
          <ProfilePicture />

          </ProfileWrapper>
        </Box>
      </ProfileCreationProvider>
      <CardFooter>
      <Button
      >
        Complete Profile
      </Button>
      </CardFooter>
      </ProfileCreationModal>
    </>
  )
}

export default ProfileCreation
