import { ChainId, Token, WBNB } from '@kazamaswap/sdk'
import { BUSD_BSC, KAZAMA_MAINNET, USDT_BSC } from './common'

export const bscTokens = {
  wbnb: WBNB[ChainId.BSC],
  kazama: KAZAMA_MAINNET[ChainId.BSC],
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new Token(
    ChainId.BSC,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'BNB',
    'BNB',
    'https://www.binance.com/',
  ),
  busd: BUSD_BSC,
  dai: new Token(
    ChainId.BSC,
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    18,
    'DAI',
    'Dai Stablecoin',
    'https://www.makerdao.com/',
  ),
  usdt: USDT_BSC,
  btcb: new Token(
    ChainId.BSC,
    '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    18,
    'BTCB',
    'Binance BTC',
    'https://bitcoin.org/',
  ),
  eth: new Token(
    ChainId.BSC,
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
    'https://ethereum.org/en/',
  ),
  usdc: new Token(
    ChainId.BSC,
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    18,
    'USDC',
    'Binance-Peg USD Coin',
    'https://www.centre.io/usdc',
  ),
  bsdx: new Token(
    ChainId.BSC,
    '0x351494731D28f35d648C200b35E628aecba3E577',
    18,
    'bSDX',
    'SwapDex Token',
    'https://www.swapdex.network',
  ),
  psg: new Token(
    ChainId.BSC,
    '0xBc5609612b7C44BEf426De600B5fd1379DB2EcF1',
    2,
    'PSG',
    'Paris Saint-Germain Token',
    'https://www.chiliz.com',
  ),
  cake: new Token(
    ChainId.BSC,
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    18,
    'PancakeSwap Token',
    'CAKE',
    'https://www.pancakeswap.finance/',
  ),
}
