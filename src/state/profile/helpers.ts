import { Profile } from 'state/types'
import { API_PROFILE } from 'config/constants/endpoints'
import { KazamaProfile } from 'config/abi/types/KazamaProfile'
import profileABI from 'config/abi/kazamaProfile.json'
import { NftToken } from 'state/nftMarket/types'
import { getNftApi } from 'state/nftMarket/helpers'
import { multicallv2 } from 'utils/multicall'
import { getKazamaProfileAddress } from 'utils/addressHelpers'
import axios from 'axios'
import { getUserRoute, setAvatarRoute } from 'utils/apiRoutes'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const transformProfileResponse = (
  profileResponse: Awaited<ReturnType<KazamaProfile['getUserProfile']>>,
): Partial<Profile> => {
  const { 0: userId, 1: numberPoints, 2: collectionAddress, 3: tokenId, 4: isActive } = profileResponse

  return {
    userId: userId.toNumber(),
    points: numberPoints.toNumber(),
    collectionAddress,
    tokenId: tokenId.toNumber(),
    isActive,
  }
}

export const getUsername = async (address: string): Promise<string> => {

  try {
    const response = await fetch(getUserRoute, {
      method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: address,
          }),
    });

    const { username = '' } = await response.json()

    return username
  } catch (error) {
    return ''
  }
}

export const getProfile = async (address: string): Promise<GetProfileResponse> => {
  try {
    const profileCalls = ['hasRegistered', 'getUserProfile'].map((method) => {
      return { address: getKazamaProfileAddress(), name: method, params: [address] }
    })
    const profileCallsResult = await multicallv2({
      abi: profileABI,
      calls: profileCalls,
      options: { requireSuccess: false },
    })
    const [[hasRegistered], profileResponse] = profileCallsResult
    if (!hasRegistered) {
      return { hasRegistered, profile: null }
    }

    const { userId, points, tokenId, collectionAddress, isActive } = transformProfileResponse(profileResponse)
    const [ username, nftRes] = await Promise.all([
      getUsername(address),
      isActive ? getNftApi(collectionAddress, tokenId.toString()) : Promise.resolve(null),
    ])

    let nftToken: NftToken

    // If the profile is not active the tokenId returns 0, which is still a valid token id
    // so only fetch the nft data if active
    if (nftRes) {
      nftToken = {
        tokenId: nftRes.tokenId,
        name: nftRes.name,
        collectionName: nftRes.collection.name,
        collectionAddress,
        description: nftRes.description,
        attributes: nftRes.attributes,
        createdAt: nftRes.createdAt,
        updatedAt: nftRes.updatedAt,
        image: {
          original: nftRes.image?.original,
          thumbnail: nftRes.image?.thumbnail,
        },
      }
      await fetch(setAvatarRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          avatarImage: nftRes.image?.thumbnail
        }),
      })
    }

    const profile = {
      userId,
      points,
      tokenId,
      username,
      collectionAddress,
      isActive,
      nft: nftToken,
    } as Profile

    return { hasRegistered, profile }
  } catch (e) {
    console.error(e)
    return null
  }
}