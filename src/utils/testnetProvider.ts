import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const BSC_TEST_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://data-seed-prebsc-2-s2.binance.org:8545/'

export const bscTestRpcProvider = new StaticJsonRpcProvider(BSC_TEST_NODE)

export default null
