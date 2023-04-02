import { UserResponse, BetResponse, HistoricalBetResponse, RoundResponse } from './responseType'

export interface UserResponseKAZAMA extends UserResponse<BetResponseKAZAMA> {
  totalKAZAMA: string
  totalKAZAMABull: string
  totalKAZAMABear: string
  averageKAZAMA: string
  totalKAZAMAClaimed: string
  netKAZAMA: string
}

export interface BetResponseKAZAMA extends BetResponse {
  claimedKAZAMA: string
  claimedNetKAZAMA: string
  user?: UserResponseKAZAMA
  round?: RoundResponseKAZAMA
}

export type HistoricalBetResponseKAZAMA = HistoricalBetResponse<UserResponseKAZAMA>

export type RoundResponseKAZAMA = RoundResponse<BetResponseKAZAMA>

export interface TotalWonMarketResponseKAZAMA {
  totalKAZAMA: string
  totalKAZAMATreasury: string
}

/**
 * Base fields are the all the top-level fields available in the api. Used in multiple queries
 */
export const roundBaseFields = `
  id
  epoch
  position
  failed
  startAt
  startBlock
  startHash
  lockAt
  lockBlock
  lockHash
  lockPrice
  lockRoundId
  closeAt
  closeBlock
  closeHash
  closePrice
  closeRoundId
  totalBets
  totalAmount
  bullBets
  bullAmount
  bearBets
  bearAmount
`

export const betBaseFields = `
 id
 hash  
 amount
 position
 claimed
 claimedAt
 claimedHash
 claimedBlock
 claimedKAZAMA
 claimedNetKAZAMA
 createdAt
 updatedAt
`

export const userBaseFields = `
  id
  createdAt
  updatedAt
  block
  totalBets
  totalBetsBull
  totalBetsBear
  totalKAZAMA
  totalKAZAMABull
  totalKAZAMABear
  totalBetsClaimed
  totalKAZAMAClaimed
  winRate
  averageKAZAMA
  netKAZAMA
`
