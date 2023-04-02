import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Heading, Box, Text } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { LotteryRound, LotteryRoundGraphEntity } from 'state/types'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import { useGetLotteryGraphDataById } from 'state/lottery/hooks'
import { getGraphLotteries } from 'state/lottery/getLotteriesData'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import RewardBrackets from '../RewardBrackets'

const NextDrawWrapper = styled(Flex)`
  background: #2e293a;
  padding: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;

    & > div:first-child {
      display: none;
    }
  }
`

const TotalPlayers: React.FC<React.PropsWithChildren<{ lotteryNodeData: LotteryRound; lotteryId: string; yourTickets: string }>> =
  ({ lotteryNodeData, lotteryId, yourTickets }) => {
    const { t } = useTranslation()
    const [fetchedLotteryGraphData, setFetchedLotteryGraphData] = useState<LotteryRoundGraphEntity>()
    const lotteryGraphDataFromState = useGetLotteryGraphDataById(lotteryId)
    const kazamaPriceBusd = usePriceKazamaBusd()

    useEffect(() => {
      const getGraphData = async () => {
        const fetchedGraphData = await getGraphLotteries(undefined, undefined, { id_in: [lotteryId] })
        setFetchedLotteryGraphData(fetchedGraphData[0])
      }
      if (!lotteryGraphDataFromState) {
        getGraphData()
      }
    }, [lotteryGraphDataFromState, lotteryId])

    let prizeInBusd = new BigNumber(NaN)
    if (lotteryNodeData) {
      const { amountCollectedInKazama } = lotteryNodeData
      prizeInBusd = amountCollectedInKazama.times(kazamaPriceBusd)
    }

    const getTotalUsers = (): string => {
      if (!lotteryGraphDataFromState && fetchedLotteryGraphData) {
        return fetchedLotteryGraphData?.totalUsers?.toLocaleString()
      }

      if (lotteryGraphDataFromState) {
        return lotteryGraphDataFromState?.totalUsers?.toLocaleString()
      }

      return null
    }

    return (
              <Text fontSize="14px" display="inline">
                {t('Total players')}:{' '}
                {lotteryNodeData && (lotteryGraphDataFromState || fetchedLotteryGraphData) ? (
                  getTotalUsers()
                ) : (
                  <Skeleton height={14} width={31} />
                )}
              </Text>
    )
  }

export default TotalPlayers
