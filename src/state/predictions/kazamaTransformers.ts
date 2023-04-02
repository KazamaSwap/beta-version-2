import { Bet, BetPosition, Round, PredictionUser } from 'state/types'
import numberOrNull from 'utils/numberOrNull'

import { RoundResponseKAZAMA } from './kazamaQueries'

const getRoundPosition = (positionResponse: string) => {
  if (positionResponse === 'Bull') {
    return BetPosition.BULL
  }

  if (positionResponse === 'Bear') {
    return BetPosition.BEAR
  }

  if (positionResponse === 'House') {
    return BetPosition.HOUSE
  }

  return null
}

export const transformBetResponseKAZAMA = (betResponse): Bet => {
  const bet = {
    id: betResponse.id,
    hash: betResponse.hash,
    block: numberOrNull(betResponse.block),
    amount: betResponse.amount ? parseFloat(betResponse.amount) : 0,
    position: betResponse.position === 'Bull' ? BetPosition.BULL : BetPosition.BEAR,
    claimed: betResponse.claimed,
    claimedAt: numberOrNull(betResponse.claimedAt),
    claimedBlock: numberOrNull(betResponse.claimedBlock),
    claimedHash: betResponse.claimedHash,
    claimedBNB: betResponse.claimedKAZAMA ? parseFloat(betResponse.claimedKAZAMA) : 0,
    claimedNetBNB: betResponse.claimedNetKAZAMA ? parseFloat(betResponse.claimedNetKAZAMA) : 0,
    createdAt: numberOrNull(betResponse.createdAt),
    updatedAt: numberOrNull(betResponse.updatedAt),
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponseKAZAMA(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseKAZAMA(betResponse.round)
  }

  return bet
}

export const transformUserResponseKAZAMA = (userResponse): PredictionUser => {
  const {
    id,
    createdAt,
    updatedAt,
    block,
    totalBets,
    totalBetsBull,
    totalBetsBear,
    totalKAZAMA,
    totalKAZAMABull,
    totalKAZAMABear,
    totalBetsClaimed,
    totalKAZAMAClaimed,
    winRate,
    averageKAZAMA,
    netKAZAMA,
  } = userResponse || {}

  return {
    id,
    createdAt: numberOrNull(createdAt),
    updatedAt: numberOrNull(updatedAt),
    block: numberOrNull(block),
    totalBets: numberOrNull(totalBets),
    totalBetsBull: numberOrNull(totalBetsBull),
    totalBetsBear: numberOrNull(totalBetsBear),
    totalBNB: totalKAZAMA ? parseFloat(totalKAZAMA) : 0,
    totalBNBBull: totalKAZAMABull ? parseFloat(totalKAZAMABull) : 0,
    totalBNBBear: totalKAZAMABear ? parseFloat(totalKAZAMABear) : 0,
    totalBetsClaimed: numberOrNull(totalBetsClaimed),
    totalBNBClaimed: totalKAZAMAClaimed ? parseFloat(totalKAZAMAClaimed) : 0,
    winRate: winRate ? parseFloat(winRate) : 0,
    averageBNB: averageKAZAMA ? parseFloat(averageKAZAMA) : 0,
    netBNB: netKAZAMA ? parseFloat(netKAZAMA) : 0,
  }
}

export const transformRoundResponseKAZAMA = (roundResponse: RoundResponseKAZAMA): Round => {
  const {
    id,
    epoch,
    failed,
    position,
    startAt,
    startBlock,
    startHash,
    lockAt,
    lockBlock,
    lockHash,
    lockPrice,
    lockRoundId,
    closeAt,
    closeBlock,
    closeHash,
    closePrice,
    closeRoundId,
    totalBets,
    totalAmount,
    bullBets,
    bullAmount,
    bearBets,
    bearAmount,
    bets = [],
  } = roundResponse

  return {
    id,
    failed,
    startHash,
    lockHash,
    lockRoundId,
    closeRoundId,
    closeHash,
    position: getRoundPosition(position),
    epoch: numberOrNull(epoch),
    startAt: numberOrNull(startAt),
    startBlock: numberOrNull(startBlock),
    lockAt: numberOrNull(lockAt),
    lockBlock: numberOrNull(lockBlock),
    lockPrice: lockPrice ? parseFloat(lockPrice) : 0,
    closeAt: numberOrNull(closeAt),
    closeBlock: numberOrNull(closeBlock),
    closePrice: closePrice ? parseFloat(closePrice) : 0,
    totalBets: numberOrNull(totalBets),
    totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
    bullBets: numberOrNull(bullBets),
    bullAmount: bullAmount ? parseFloat(bullAmount) : 0,
    bearBets: numberOrNull(bearBets),
    bearAmount: bearAmount ? parseFloat(bearAmount) : 0,
    bets: bets.map(transformBetResponseKAZAMA),
  }
}
