import { NextLinkFromReactRouter } from 'components/NextLink';
import useGetTokenBalance from 'hooks/useTokenBalance';
import { Pie, PieChart } from 'recharts';
import { useProfileForAddress } from 'state/profile/hooks';
import styled from 'styled-components';
import { getBalanceAmount } from 'utils/formatBalance';
import truncateHash from 'utils/truncateHash';

import { Box, Flex, ProfileAvatar, Skeleton, Text } from '@kazamaswap/uikit';

import {
    CRAB, DOLPHIN, FISH, HOLDER, KRAKEN, ORCA, SHARK, SHRIMP, SPACENAUT, TURTLE, WHALE
} from './constants';

const StyledFlex = styled(Flex)`
  align-items: center;
  transition: opacity 200ms ease-in;

  &:hover {
    opacity: 0.5;
  }
`

const AvatarWrapper = styled.div`
width: 43px;
height: 43px;
background-position: center;
background-repeat: no-repeat;
background-size: 50%;
margin-left: -45px;
margin-top: 5px;
`

const RankIconWrapper = styled.div`
background: #1C2532;
border: 2px solid #111923;
border-radius: 50%;
width: 25px;
height: 25px;
margin-top: -15px;
text-align: center;
z-index: 100;
margin-left: 3px;
`

const ProfileCell: React.FC<React.PropsWithChildren<{ accountAddress: string }>> = ({ accountAddress }) => {
  const { profile, isFetching } = useProfileForAddress(accountAddress)
  let profileName = profile?.username || truncateHash(accountAddress)
  let avatarUrl = profile?.nft?.image?.thumbnail
  const BURN_ADDRESS = '0x0000000000000000000000000000000000000000'
  const DISTRIBUTOR_ADDRESS = '0x8c7377f9f6cf9c24c7a16847e8e219904ed6b807'

  if (accountAddress === BURN_ADDRESS) {
    profileName = "Burn Address"
    avatarUrl = "http://192.241.141.17/testnet/0x7899562ea30623E04cDAAB016D55bfD533505a56/ignis-senshi-1000.png"
  }

  if (accountAddress === DISTRIBUTOR_ADDRESS) {
    profileName = "USD Distributor"
  }


  return (
    <NextLinkFromReactRouter to={`/profile/${accountAddress}`}>
      <StyledFlex>
        {!isFetching ? (
            <>
            {/* <PieChart width={49} height={49}>
            <Pie
              dataKey="value"
              data={RankProgress}
              cx={19}
              stroke="transparent"
              startAngle={0}
              cy={20}
              innerRadius={21}
              outerRadius={24}
              fill={progressColor} />
          </PieChart> */}
          <ProfileAvatar
              width={40}
              height={40}
              src={avatarUrl} />
              </>
        ) : (
          <ProfileAvatar
          width={40}
          height={40}
          src={avatarUrl} />
        )}
        <Box display="inline" ml="15px">
          {isFetching ? <Text fontSize="13px" lineHeight="1.25">{truncateHash(accountAddress)}</Text> : <Text fontSize="13px" lineHeight="1.25">{profileName.length > 20 ? truncateHash(profileName, 3) : profileName}</Text>}
        </Box>
      </StyledFlex>
    </NextLinkFromReactRouter>
  )
}

export default ProfileCell