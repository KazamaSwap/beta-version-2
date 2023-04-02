import { Token } from '@kazamaswap/sdk'
import { bscTokens, bscTestnetTokens } from '@kazamaswap/tokens'
import { bscWarningTokens } from 'config/constants/warningTokens'

const { bake } = bscTestnetTokens
const { pokemoney, free, safemoon } = bscWarningTokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  bake,
}

export default SwapWarningTokens
