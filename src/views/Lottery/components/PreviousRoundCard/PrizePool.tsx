import { Text } from '@kazamaswap/uikit'
import { useLottery } from 'state/lottery/hooks'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import { getBalanceNumber } from 'utils/formatBalance'

const PrizePool = () => {
  const { currentRound } = useLottery()
  const { amountCollectedInKazama } = currentRound
  const kazamaPriceBusd = usePriceKazamaBusd()
  const prizeInBusd = amountCollectedInKazama.times(kazamaPriceBusd)

    return (
      <>
          {prizeInBusd.isNaN() ? (
          <>
          <Text fontSize="14px" color="warning" bold>$0,00</Text>
           </>
          ) : (
          <>
          <Balance
           fontSize="14px"
           color="warning"
           unit=""
           prefix='$'
           value={getBalanceNumber(prizeInBusd)}
           decimals={0}
            />
              </>
                      )}
      </>
    )
  }

export default PrizePool
