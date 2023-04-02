import { bscTokens, serializeToken } from '@kazamaswap/tokens'
import { KAZAMA_BNB_LP_MAINNET } from '../lp'
import { SerializedFarmConfig } from '../types'

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'CAKE',
    lpAddress: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    token: bscTokens.kazama,
    quoteToken: bscTokens.wbnb,
  },
].map((p) => ({ ...p, token: serializeToken(p.token), quoteToken: serializeToken(p.quoteToken) }))

export default farms
