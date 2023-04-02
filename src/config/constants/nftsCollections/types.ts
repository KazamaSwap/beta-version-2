import { Address } from '../types'

export enum KazamaCollectionKey {
  KAZAMA = 'kazama',
  SQUAD = 'kazamaSquad',
}

export type KazamaCollection = {
  name: string
  description?: string
  slug: string
  address: Address
}

export type KazamaCollections = {
  [key in KazamaCollectionKey]: KazamaCollection
}
