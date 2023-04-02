import BigNumber from 'bignumber.js';
import Balance from 'components/Balance';
import PrizeBalanceSmall from 'components/PrizeBalanceSmall';
import * as S from 'components/Styled';
import { usePriceKazamaBusd } from 'state/farms/hooks';
import styled from 'styled-components';
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance';

import { useTranslation } from '@kazamaswap/localization';
import { Card, Flex, Image, KazamaFrontCard, Skeleton, Text } from '@kazamaswap/uikit';

import HowToPlay from './HowToPlay';

const Header = styled(S.StyledHeading)`
font-size: 20px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
    min-height: auto;
  }
`

export const WrapperContainer = styled(Flex)`
background: #241f2e;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 7px;
  border: 1px solid #1B1A23;
  gap: 1em;
  & > * {
    width: 100%;
    padding-left: 20px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

interface RewardBracketDetailProps {
  kazamaAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<React.PropsWithChildren<RewardBracketDetailProps>> = ({
  rewardBracket,
  kazamaAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
  isLoading,
}) => {
  const { t } = useTranslation()
  const kazamaPriceBusd = usePriceKazamaBusd()

  return (
    <WrapperContainer>
      <>
      {/* {StackIcon()} */}
      <Flex flexDirection="column">
                <Flex>
                  <Text fontSize="13px">Kazama</Text>
                </Flex>
                <Flex>
        {isLoading || kazamaAmount.isNaN() ? (
          <Skeleton my="4px" mr="10px" height={20} width={110} />
        ) : (
          <PrizeBalanceSmall fontSize="13px" bold unit=" " value={getBalanceNumber(kazamaAmount)} decimals={0} />
        )}
        </Flex>
        </Flex>
        <Flex flexDirection="column">
                <Flex>
                  <Text fontSize="13px">USD Value</Text>
                </Flex>
                <Flex>
        {isLoading || kazamaAmount.isNaN() ? (
          <>
            <Skeleton mt="4px" mb="16px" height={12} width={70} />
          </>
        ) : (
          <PrizeBalanceSmall
            fontSize="13px"
            color="text"
            prefix="$"
            value={getBalanceNumber(kazamaAmount.times(kazamaPriceBusd))}
            decimals={0}
          />
        )}
        </Flex>
        </Flex>
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
    </WrapperContainer>
  )
}

export default RewardBracketDetail
