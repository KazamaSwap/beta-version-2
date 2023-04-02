import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text, KazamaFrontCard, Card } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import HowToPlay from './HowToPlay'

const BracketCard = styled(KazamaFrontCard)`
 background-image: linear-gradient(#1B1A23,#292734);
 border-radius: 10px;
 padding: 10px 10px 10px 10px;
 margin: 0px 10px 15px 15px;
 border: 2px solid #1B1A23;
  }
`

interface LatestResultDetailProps {
  kazamaAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const LatestResultDetail: React.FC<React.PropsWithChildren<LatestResultDetailProps>> = ({
  rewardBracket,
  kazamaAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
  isLoading,
}) => {
  const { t } = useTranslation()
  const kazamaPriceBusd = usePriceKazamaBusd()

  const getRewardText = () => {
    const numberMatch = rewardBracket + 1
    if (isBurn) {
      return t('Burn')
    }
    if (rewardBracket === 5) {
      return t('Match all %numberMatch%', { numberMatch })
    }
    return t('Match first %numberMatch%', { numberMatch })
  }

  return (
    <BracketCard>
    <Flex flexDirection="column">
      {isLoading ? (
        <Skeleton mb="4px" mt="8px" height={16} width={80} />
      ) : (
        <Text bold color={isBurn ? 'warning' : 'secondary'}>
          {getRewardText()}
        </Text>
      )}
      <>
        {isLoading || kazamaAmount.isNaN() ? (
          <Skeleton my="4px" mr="10px" height={20} width={110} />
        ) : (
          <Balance fontSize="20px" bold unit=" KAZAMA" value={getBalanceNumber(kazamaAmount)} decimals={0} />
        )}
        {isLoading || kazamaAmount.isNaN() ? (
          <>
            <Skeleton mt="4px" mb="16px" height={12} width={70} />
          </>
        ) : (
          <Balance
            fontSize="13px"
            color="success"
            prefix="~$"
            value={getBalanceNumber(kazamaAmount.times(kazamaPriceBusd))}
            decimals={0}
          />
        )}
        {isHistoricRound && kazamaAmount && (
          <>
            {numberWinners !== '0' && (
              <Text fontSize="12px" color="textSubtle">
                {getFullDisplayBalance(kazamaAmount.div(parseInt(numberWinners, 10)), 18, 2)} KAZAMA {t('each')}
              </Text>
            )}
            <Text fontSize="12px" color="text">
              {numberWinners} {t('Winning Tickets')}
            </Text>
          </>
        )}
      </>
    </Flex>
    </BracketCard>
  )
}

export default LatestResultDetail
