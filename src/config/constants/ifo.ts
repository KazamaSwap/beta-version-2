import { Token, ChainId } from '@kazamaswap/sdk'
import { bscTokens } from '@kazamaswap/tokens'
import { KAZAMA_BNB_LP_MAINNET } from './lp'
import { Ifo } from './types'

export const kazamaBnbLpToken = new Token(ChainId.BSC, KAZAMA_BNB_LP_MAINNET, 18, 'KAZAMA-BNB LP')

const ifos: Ifo[] = [

]

export default ifos
