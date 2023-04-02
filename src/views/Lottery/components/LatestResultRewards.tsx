import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text, KazamaLotteryMessage, KazamaLotteryMessageText, Box } from '@kazamaswap/uikit'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from '@kazamaswap/localization'
import { LotteryRound } from 'state/types'
import LatestResultDetail from './LastResultDetail'
import HowToPlay from './HowToPlay'

const WarningWrapper = styled(Box)`
  margin-bottom: 15px;
`

const Wrapper = styled(Flex)`
  width: 100%;
  flex-direction: row;
`

const RewardsInner = styled.div`
  display: grid;
  grid-template-rows: repeat(1, auto);
  row-gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-rows: repeat(4, 1fr);
  }
`


export const BoxWrapper = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0;
  gap: 1em;

  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

interface RewardMatchesProps {
  lotteryNodeData: LotteryRound
  isHistoricRound?: boolean
}

interface RewardsState {
  isLoading: boolean
  kazamaToBurn: BigNumber
  rewardsLessTreasuryFee: BigNumber
  rewardsBreakdown: string[]
  countWinnersPerBracket: string[]
}

const LatestResultRewards: React.FC<React.PropsWithChildren<RewardMatchesProps>> = ({
  lotteryNodeData,
  isHistoricRound,
}) => {
  const { t } = useTranslation()
  const [state, setState] = useState<RewardsState>({
    isLoading: true,
    kazamaToBurn: BIG_ZERO,
    rewardsLessTreasuryFee: BIG_ZERO,
    rewardsBreakdown: null,
    countWinnersPerBracket: null,
  })

  useEffect(() => {
    if (lotteryNodeData) {
      const { treasuryFee, amountCollectedInKazama, rewardsBreakdown, countWinnersPerBracket } = lotteryNodeData

      const feeAsPercentage = new BigNumber(treasuryFee).div(100)
      const kazamaToBurn = feeAsPercentage.div(100).times(new BigNumber(amountCollectedInKazama))
      const amountLessTreasuryFee = new BigNumber(amountCollectedInKazama).minus(kazamaToBurn)
      setState({
        isLoading: false,
        kazamaToBurn,
        rewardsLessTreasuryFee: amountLessTreasuryFee,
        rewardsBreakdown,
        countWinnersPerBracket,
      })
    } else {
      setState({
        isLoading: true,
        kazamaToBurn: BIG_ZERO,
        rewardsLessTreasuryFee: BIG_ZERO,
        rewardsBreakdown: null,
        countWinnersPerBracket: null,
      })
    }
  }, [lotteryNodeData])

  const getKazamaRewards = (bracket: number) => {
    const shareAsPercentage = new BigNumber(state.rewardsBreakdown[bracket]).div(100)
    return state.rewardsLessTreasuryFee.div(100).times(shareAsPercentage)
  }

  const { isLoading, countWinnersPerBracket, kazamaToBurn } = state

  const LatestResultRewardsBracket = [5, 4, 3, 2, 1, 0]

  return (
    <Wrapper>
    <BoxWrapper>
      <RewardsInner>
        {LatestResultRewardsBracket.map((bracketIndex) => (
          <LatestResultDetail
            key={bracketIndex}
            rewardBracket={bracketIndex}
            kazamaAmount={!isLoading && getKazamaRewards(bracketIndex)}
            numberWinners={!isLoading && countWinnersPerBracket[bracketIndex]}
            isHistoricRound={isHistoricRound}
            isLoading={isLoading}
          />
        ))}
        <LatestResultDetail rewardBracket={0} kazamaAmount={kazamaToBurn} isBurn isLoading={isLoading} />
      </RewardsInner>
      {/* <HowToPlay /> */}
      </BoxWrapper>
    </Wrapper>
  )
}

export default LatestResultRewards
