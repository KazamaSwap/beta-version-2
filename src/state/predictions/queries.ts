import {
  roundBaseFields as roundBaseFieldsBNB,
  betBaseFields as betBaseFieldsBNB,
  userBaseFields as userBaseFieldsBNB,
} from './bnbQueries'
import {
  roundBaseFields as roundBaseFieldsKAZAMA,
  betBaseFields as betBaseFieldsKAZAMA,
  userBaseFields as userBaseFieldsKAZAMA,
} from './kazamaQueries'

export const getRoundBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'KAZAMA' ? roundBaseFieldsKAZAMA : roundBaseFieldsBNB

export const getBetBaseFields = (tokenSymbol: string) => (tokenSymbol === 'KAZAMA' ? betBaseFieldsKAZAMA : betBaseFieldsBNB)

export const getUserBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'KAZAMA' ? userBaseFieldsKAZAMA : userBaseFieldsBNB
