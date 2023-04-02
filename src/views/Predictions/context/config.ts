import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_CAKE, GRAPH_API_PREDICTION_BNB } from 'config/constants/endpoints'
import { getAddress } from 'utils/addressHelpers'
import { bscTokens, bscTestnetTokens } from '@kazamaswap/tokens'
import { BigNumber } from '@ethersproject/bignumber'

const DEFAULT_MIN_PRICE_USD_DISPLAYED = BigNumber.from(10000)

export default {
  BNB: {
    address: getAddress(addresses.predictionsBNB),
    api: GRAPH_API_PREDICTION_BNB,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleBNB),
    minPriceUsdDisplayed: DEFAULT_MIN_PRICE_USD_DISPLAYED,
    displayedDecimals: 2,
    token: bscTestnetTokens.bnb,
  },
  KAZAMA: {
    address: getAddress(addresses.predictionsKAZAMA),
    api: GRAPH_API_PREDICTION_CAKE,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleKAZAMA),
    minPriceUsdDisplayed: DEFAULT_MIN_PRICE_USD_DISPLAYED,
    displayedDecimals: 2,
    token: bscTestnetTokens.kazama,
  },
}
