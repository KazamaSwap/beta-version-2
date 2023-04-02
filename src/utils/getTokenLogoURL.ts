import { ChainId, Token } from '@kazamaswap/sdk'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.BSC_TESTNET]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
}

const getTokenLogoURL = (token?: Token) => {
  if (token && mapping[token.chainId]) {
    return `/images/tokens/${token.address}.png`
  }
  return null
}

export default getTokenLogoURL
