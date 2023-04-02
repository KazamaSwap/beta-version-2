import { BigNumber } from '@ethersproject/bignumber'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { bscTokens, bscTestnetTokens, serializeToken } from '@kazamaswap/tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = BigNumber.from('20000000000000')
export const DURATION_FACTOR = BigNumber.from('31536000')

export const vaultPoolConfig = {
  [VaultKey.KazamaVaultV1]: {
    name: <Trans>Auto KAZAMA</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 380000,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTestnetTokens.kazama.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.KazamaVault]: {
    name: <Trans>KAZAMA</Trans>,
    description: <Trans>ja</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 725000,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTestnetTokens.kazama.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.KazamaFlexibleSideVault]: {
    name: <Trans>Flexible KAZAMA</Trans>,
    description: <Trans>Flexible staking on the side.</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 2000000,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTestnetTokens.kazama.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO KAZAMA',
    description: <Trans>Stake KAZAMA to participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 1500000,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTestnetTokens.kazama.address}.svg`,
      secondarySrc: `/images/tokens/ifo-pool-icon.svg`,
    },
  },
} as const

export const livePools: SerializedPoolConfig[] = [
  {
    sousId: 0,
    stakingToken: bscTestnetTokens.kazama,
    earningToken: bscTestnetTokens.kazama,
    contractAddress: {
      97: '0x457b755E80E0D94a2FcD4947e82547a9e7D78D18',
      56: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '37.50',
    isFinished: false,
  },
].map((p) => ({
  ...p,
  stakingToken: serializeToken(p.stakingToken),
  earningToken: serializeToken(p.earningToken),
}))

// known finished pools
const finishedPools = [

].map((p) => ({
  ...p,
  isFinished: true,
  stakingToken: serializeToken(p.stakingToken),
  earningToken: serializeToken(p.earningToken),
}))

export default [...livePools, ...finishedPools]
