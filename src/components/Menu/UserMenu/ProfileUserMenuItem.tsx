import styled from 'styled-components'
import NextLink from 'next/link'
import { Flex, Skeleton, UserMenuItem, Tag, Text, useModal } from '@kazamaswap/uikit'
import { useWeb3React } from '@kazamaswap/wagmi'
import { useTranslation } from '@kazamaswap/localization'
import ProfileModal from 'views/Profile'

interface ProfileUserMenuItemProps {
  isLoading: boolean
  hasProfile: boolean
  disabled: boolean
}

const Dot = styled.div`
  background-color: ${({ theme }) => theme.colors.failure};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`

const ProfileUserMenuItem: React.FC<React.PropsWithChildren<ProfileUserMenuItemProps>> = ({
  isLoading,
  hasProfile,
  disabled,
}) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [onProfileModal] =  useModal(<ProfileModal />)

  if (isLoading) {
    return (
      <UserMenuItem>
        <Skeleton height="24px" width="35%" />
      </UserMenuItem>
    )
  }

  if (!hasProfile) {
    return (
      <NextLink href={`/profile/${account?.toLowerCase()}`} passHref>
          <Flex alignItems="center" width="100%">
          <Text paddingLeft="9px" paddingRight="9px" fontSize="15px">
            Your Profile
          </Text>
            {/* <Tag variant="warning" style={{ background: 'none' }} outline>
      {t('SOON')}
    </Tag> */}
          </Flex>
      </NextLink>
    )
  }

  return (
    <NextLink href={`/profile/${account?.toLowerCase()}`} passHref>
      <Text paddingLeft="9px" fontSize="15px">
            Your Profile
          </Text>
    </NextLink>
  )
}

export default ProfileUserMenuItem
