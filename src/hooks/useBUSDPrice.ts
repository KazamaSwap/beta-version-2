import { ChainId, Currency, CurrencyAmount, JSBI, Pair, Price, Token, WNATIVE } from '@kazamaswap/sdk'
import { FAST_INTERVAL } from 'config/constants'
import { BUSD, KAZAMA, bscTestnetTokens } from '@kazamaswap/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import useSWR from 'swr'
import getLpAddress from 'utils/getLpAddress'
import { multiplyPriceByAmount } from 'utils/prices'
import { useProvider } from 'wagmi'
import { usePairContract } from './useContract'
import { PairState, usePairs } from './usePairs'

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = currency?.wrapped
  const wnative = WNATIVE[chainId]
  const busd = BUSD[chainId]

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [wrapped?.equals(busd) ? undefined : wrapped, busd],
      [chainId ? wnative : undefined, busd],
    ],
    [wnative, busd, chainId, currency, wrapped],
  )
  const [[bnbPairState, bnbPair], [busdPairState, busdPair], [busdBnbPairState, busdBnbPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }

    const isBUSDPairExist =
      busdPair &&
      busdPairState === PairState.EXISTS &&
      busdPair.reserve0.greaterThan('0') &&
      busdPair.reserve1.greaterThan('0')

    // handle wbnb/bnb
    if (wrapped.equals(wnative)) {
      if (isBUSDPairExist) {
        const price = busdPair.priceOf(wnative)
        return new Price(currency, busd, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(busd)) {
      return new Price(busd, busd, '1', '1')
    }

    const isBnbPairExist =
      bnbPair &&
      bnbPairState === PairState.EXISTS &&
      bnbPair.reserve0.greaterThan('0') &&
      bnbPair.reserve1.greaterThan('0')
    const isBusdBnbPairExist =
      busdBnbPair &&
      busdBnbPairState === PairState.EXISTS &&
      busdBnbPair.reserve0.greaterThan('0') &&
      busdBnbPair.reserve1.greaterThan('0')

    const bnbPairBNBAmount = isBnbPairExist && bnbPair?.reserveOf(wnative)
    const bnbPairBNBBUSDValue: JSBI =
      bnbPairBNBAmount && isBUSDPairExist && isBusdBnbPairExist
        ? busdBnbPair.priceOf(wnative).quote(bnbPairBNBAmount).quotient
        : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (isBUSDPairExist && busdPair.reserveOf(busd).greaterThan(bnbPairBNBBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, busd, price.denominator, price.numerator)
    }
    if (isBnbPairExist && isBusdBnbPairExist) {
      if (busdBnbPair.reserveOf(busd).greaterThan('0') && bnbPair.reserveOf(wnative).greaterThan('0')) {
        const bnbBusdPrice = busdBnbPair.priceOf(busd)
        const currencyBnbPrice = bnbPair.priceOf(wnative)
        const busdPrice = bnbBusdPrice.multiply(currencyBnbPrice).invert()
        return new Price(currency, busd, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    wnative,
    busd,
    bnbPair,
    busdBnbPair,
    busdPairState,
    busdPair,
    bnbPairState,
    busdBnbPairState,
  ])
}

export const usePriceByPairs = (currencyA?: Currency, currencyB?: Currency) => {
  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
  const pairAddress = getLpAddress(tokenA, tokenB)
  const pairContract = usePairContract(pairAddress)
  const provider = useProvider({ chainId: currencyA.chainId })

  const { data: price } = useSWR(
    currencyA && currencyB && ['pair-price', currencyA, currencyB],
    async () => {
      const reserves = await pairContract.connect(provider).getReserves()
      if (!reserves) {
        return null
      }
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      const pair = new Pair(
        CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
        CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
      )

      return pair.priceOf(tokenB)
    },
    { dedupingInterval: FAST_INTERVAL, refreshInterval: FAST_INTERVAL },
  )

  return price
}

 export const useKazamaBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  // Default bsc kazama, if no kazama address found
  const KazamaBusdPrice = useBUSDPrice(KAZAMA[chainId])
 return KazamaBusdPrice
 }

 export const useEverGrowBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  // Default bsc kazama, if no kazama address found
  const EverGrowBusdPrice = useBUSDPrice(bscTestnetTokens.egc)
 return EverGrowBusdPrice
 }

 export const useSdxBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  // Default bsc kazama, if no kazama address found
  const SdxBusdPrice = useBUSDPrice(bscTestnetTokens.sdxb)
 return SdxBusdPrice
 }

 export const useEthBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  // Default bsc kazama, if no kazama address found
  const EthBusdPrice = useBUSDPrice(bscTestnetTokens.eth)
 return EthBusdPrice
 }

 export const useBtcBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  // Default bsc kazama, if no kazama address found
  const BtcBusdPrice = useBUSDPrice(bscTestnetTokens.btc)
 return BtcBusdPrice
 }

 export const useXenBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  // Default bsc kazama, if no kazama address found
  const XenBusdPrice = useBUSDPrice(bscTestnetTokens.xen)
 return XenBusdPrice
 }

 export const useYxdBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  // Default bsc kazama, if no kazama address found
  const YxdBusdPrice = useBUSDPrice(bscTestnetTokens.xyd)
 return YxdBusdPrice
 }

 export const useRabbitBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  // Default bsc kazama, if no kazama address found
  const RabbitBusdPrice = useBUSDPrice(bscTestnetTokens.rabbit)
 return RabbitBusdPrice
 }


export const useBUSDCurrencyAmount = (currency?: Currency, amount?: number): number | undefined => {
  const busdPrice = useBUSDPrice(currency)
  if (!amount) {
    return undefined
  }
  if (busdPrice) {
    return multiplyPriceByAmount(busdPrice, amount)
  }
  return undefined
}

export const useBUSDKazamaAmount = (amount: number): number | undefined => {
  const kazamaBusdPrice = useKazamaBusdPrice()
  if (kazamaBusdPrice) {
    return multiplyPriceByAmount(kazamaBusdPrice, amount)
  }
  return undefined
}

export const useBNBBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  const bnbBusdPrice = useBUSDPrice(WNATIVE[chainId])
  return bnbBusdPrice
}
