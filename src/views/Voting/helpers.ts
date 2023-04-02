import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import fromPairs from 'lodash/fromPairs'
import groupBy from 'lodash/groupBy'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { bscTokens, bscTestnetTokens } from '@kazamaswap/tokens'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { getKazamaVaultAddress } from 'utils/addressHelpers'
import { ADMINS, KAZAMA_SPACE, SNAPSHOT_VERSION } from './config'
import { getScores } from './getScores'
import * as strategies from './strategies'

export const isCoreProposal = (proposal: Proposal) => {
  return ADMINS.includes(proposal.author.toLowerCase())
}

export const filterProposalsByType = (proposals: Proposal[], proposalType: ProposalType) => {
  if (proposals) {
    switch (proposalType) {
      case ProposalType.COMMUNITY:
        return proposals.filter((proposal) => !isCoreProposal(proposal))
      case ProposalType.CORE:
        return proposals.filter((proposal) => isCoreProposal(proposal))
      case ProposalType.ALL:
      default:
        return proposals
    }
  } else {
    return []
  }
}

export const filterProposalsByState = (proposals: Proposal[], state: ProposalState) => {
  return proposals.filter((proposal) => proposal.state === state)
}

export interface Message {
  address: string
  msg: string
  sig: string
}

const STRATEGIES = [
  { name: 'kazama', params: { symbol: 'KAZAMA', address: bscTestnetTokens.kazama.address, decimals: 18, max: 300 } },
]
const NETWORK = '97'

/**
 * Generates metadata required by snapshot to validate payload
 */
export const generateMetaData = () => {
  return {
    plugins: {},
    network: 97,
    strategies: STRATEGIES,
  }
}

/**
 * Returns data that is required on all snapshot payloads
 */
export const generatePayloadData = () => {
  return {
    version: SNAPSHOT_VERSION,
    timestamp: (Date.now() / 1e3).toFixed(),
    space: KAZAMA_SPACE,
  }
}

/**
 * General function to send commands to the snapshot api
 */
export const sendSnapshotData = async (message: Message) => {
  const response = await fetch(SNAPSHOT_HUB_API, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.error_description)
  }

  const data = await response.json()
  return data
}

export const VOTING_POWER_BLOCK = {
  v0: 24391127,
  v1: 24391127,
}

/**
 *  Get voting power by single user for each category
 */
interface GetVotingPowerType {
  total: number
  voter: string
  poolsBalance?: number
  kazamaBalance?: number
  kazamaPoolBalance?: number
  kazamaBnbLpBalance?: number
  kazamaVaultBalance?: number
//  ifoPoolBalance?: number
  lockedKazamaBalance?: number
  lockedEndTime?: number
}

export const getVotingPower = async (
  account: string,
  poolAddresses: string[],
  blockNumber?: number,
): Promise<GetVotingPowerType> => {
  if (blockNumber && (blockNumber >= VOTING_POWER_BLOCK.v0 || blockNumber >= VOTING_POWER_BLOCK.v1)) {
    const kazamaVaultAddress = getKazamaVaultAddress()
    const version = blockNumber >= VOTING_POWER_BLOCK.v1 ? 'v1' : 'v0'

    const [
      kazamaBalance,
      kazamaBnbLpBalance,
      kazamaPoolBalance,
      kazamaVaultBalance,
      poolsBalance,
      total,
      lockedKazamaBalance,
      lockedEndTime,
//      ifoPoolBalance,
    ] = await getScores(
      KAZAMA_SPACE,
      [
        strategies.kazamaBalanceStrategy(version),
        strategies.kazamaBnbLpBalanceStrategy(version),
        strategies.kazamaPoolBalanceStrategy(version),
        strategies.kazamaVaultBalanceStrategy(version),
        strategies.createPoolsBalanceStrategy(poolAddresses, version),
        strategies.createTotalStrategy(poolAddresses, version),
        strategies.lockedKazama(kazamaVaultAddress, 'lockedAmount'),
        strategies.lockedKazama(kazamaVaultAddress, 'lockEndTime'),
//        strategies.ifoPoolBalanceStrategy,
      ],
      NETWORK,
      [account],
      blockNumber,
    )

    const versionOne =
      version === 'v0'
        ? {}
        : {}

    return {
      ...versionOne,
      voter: account,
      total: total[account] ? total[account] : 0,
      poolsBalance: poolsBalance[account] ? poolsBalance[account] : 0,
      kazamaBalance: kazamaBalance[account] ? kazamaBalance[account] : 0,
      kazamaPoolBalance: kazamaPoolBalance[account] ? kazamaPoolBalance[account] : 0,
      kazamaBnbLpBalance: kazamaBnbLpBalance[account] ? kazamaBnbLpBalance[account] : 0,
      kazamaVaultBalance: kazamaVaultBalance[account] ? kazamaVaultBalance[account] : 0,
      lockedKazamaBalance: lockedKazamaBalance[account]
        ? new BigNumber(lockedKazamaBalance[account]).div(BIG_TEN.pow(18)).toNumber()
        : 0,
      lockedEndTime: lockedEndTime[account] ? lockedEndTime[account] : 0,
    }
  }

  const [total] = await getScores(KAZAMA_SPACE, STRATEGIES, NETWORK, [account], blockNumber)

  return {
    total: total[account] ? total[account] : 0,
    voter: account,
  }
}

export const calculateVoteResults = (votes: Vote[]): { [key: string]: Vote[] } => {
  if (votes) {
    const result = groupBy(votes, (vote) => vote.proposal.choices[vote.choice - 1])
    return result
  }
  return {}
}

export const getTotalFromVotes = (votes: Vote[]) => {
  if (votes) {
    return votes.reduce((accum, vote) => {
      let power = parseFloat(vote.metadata?.votingPower)

      if (!power) {
        power = 0
      }

      return accum + power
    }, 0)
  }
  return 0
}

/**
 * Get voting power by a list of voters, only total
 */
export async function getVotingPowerByKazamaStrategy(voters: string[], blockNumber: number) {
  const strategyResponse = await getScores(KAZAMA_SPACE, STRATEGIES, NETWORK, voters, blockNumber)

  const result = fromPairs(
    voters.map((voter) => {
      const defaultTotal = strategyResponse.reduce(
        (total, scoreList) => total + (scoreList[voter] ? scoreList[voter] : 0),
        0,
      )

      return [voter, defaultTotal]
    }),
  )

  return result
}
