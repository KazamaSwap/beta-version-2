import { useState, useEffect } from 'react'
import { Text, Flex, Skeleton, Image } from '@kazamaswap/uikit'
import { useFarmAuctionContract } from 'hooks/useContract'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useTranslation } from '@kazamaswap/localization'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { ethersToBigNumber } from 'utils/bigNumber'
import Balance from 'components/Balance'
import styled from 'styled-components'

const BurnedText = styled(Text)`
  font-size: 52px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
  }
`

const AuctionKazamaBurn: React.FC<React.PropsWithChildren> = () => {
  const [burnedKazamaAmount, setBurnedKazamaAmount] = useState(0)
  const { t } = useTranslation()
  const farmAuctionContract = useFarmAuctionContract(false)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const kazamaPriceBusd = usePriceKazamaBusd()

  const burnedAmountAsUSD = kazamaPriceBusd.times(burnedKazamaAmount)

  useEffect(() => {
    const fetchBurnedKazamaAmount = async () => {
      try {
        const amount = await farmAuctionContract.totalCollected()
        const amountAsBN = ethersToBigNumber(amount)
        setBurnedKazamaAmount(getBalanceNumber(amountAsBN))
      } catch (error) {
        console.error('Failed to fetch burned auction kazama', error)
      }
    }
    if (isIntersecting && burnedKazamaAmount === 0) {
      fetchBurnedKazamaAmount()
    }
  }, [isIntersecting, burnedKazamaAmount, farmAuctionContract])
  return (
    <Flex flexDirection={['column-reverse', null, 'row']}>
      <Flex flexDirection="column" flex="2" ref={observerRef}>
        {burnedKazamaAmount !== 0 ? (
          <Balance fontSize="64px" bold value={burnedKazamaAmount} decimals={0} unit=" KAZAMA" />
        ) : (
          <Skeleton width="256px" height="64px" />
        )}
        <BurnedText textTransform="uppercase" bold color="secondary">
          {t('Burned')}
        </BurnedText>
        <Text fontSize="24px" bold>
          {t('through community auctions so far!')}
        </Text>
        {!burnedAmountAsUSD.isNaN() && !burnedAmountAsUSD.isZero() ? (
          <Text color="textSubtle">
            ~${burnedAmountAsUSD.toNumber().toLocaleString('en', { maximumFractionDigits: 0 })}
          </Text>
        ) : (
          <Skeleton width="128px" />
        )}
      </Flex>
      <Image width={350} height={320} src="/images/burnt-kazama.png" alt={t('Burnt KAZAMA')} />
    </Flex>
  )
}

export default AuctionKazamaBurn
