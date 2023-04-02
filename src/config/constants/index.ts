// used to construct the list of all pairs we consider by default in the frontend

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
]

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export { default as ifosConfig } from './ifo'
export { default as poolsConfig } from './pools'

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

export const NOT_ON_SALE_SELLER = '0x0000000000000000000000000000000000000000'
export const NO_PROXY_CONTRACT = '0x0000000000000000000000000000000000000000'

export const DISTRIBUTOR = '0x8C7377F9F6cf9C24c7A16847e8E219904eD6B807'
export const CLAIM_GAME = '0x59425d488390b17Ee270E18E40EDC9ebeF57F478'
export const RANKPOTS_GAME = '0xe0F3D27E5006EDA78FE3015D065eb227106C9bD0'
export const KAZAMA = '0xe0F3D27E5006EDA78FE3015D065eb227106C9bD0'
export const KAZAMA_TESTNET = '0x4680b07e987f2b734a02A93439fa39Df5AdE5D2d'

export const FARM_AUCTION_HOSTING_IN_SECONDS = 604800

export const PREDICTION_TOOLTIP_DISMISS_KEY = 'prediction-switcher-dismiss-tooltip'

// Gelato uses this address to define a native currency in all chains
export const GELATO_NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const EXCHANGE_DOCS_URLS = 'https://docs.pancakeswap.finance/products/pancakeswap-exchange'
