import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@kazamaswap/localization'
import { Flex, Heading, Text, useMatchBreakpoints } from '@kazamaswap/uikit'
import Balance from 'components/Balance'
import { ActionContainer, ActionContent, ActionTitles } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { usePriceKazamaBusd } from 'state/farmsV1/hooks'
import { EarnedProps } from '../../../Farm/Cells/Earned'

const Container = styled(ActionContainer)`
  flex: 2;
  height: 100%;
`

const Earned: React.FC<React.PropsWithChildren<EarnedProps>> = ({ earnings }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const earningsBigNumber = new BigNumber(earnings)
  const kazamaPrice = usePriceKazamaBusd()
  let earningsBusd = 0
  let displayBalance = earnings.toLocaleString()

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earningsBusd = earningsBigNumber.multipliedBy(kazamaPrice).toNumber()
    displayBalance = earningsBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }

  if (isMobile) {
    return (
      <Flex justifyContent="space-between">
        <Text>{`KAZAMA ${t('Earned')}`}</Text>
        <Flex height="20px" alignItems="center">
          {Number(displayBalance) ? (
            <Balance fontSize="16px" value={Number(displayBalance)} />
          ) : (
            <Text fontSize="16px">0</Text>
          )}
        </Flex>
      </Flex>
    )
  }

  return (
    <Container>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {`KAZAMA ${t('Earned')}`}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Heading color={earningsBigNumber.gt(0) ? 'text' : 'textDisabled'}>{displayBalance}</Heading>
          <Balance
            fontSize="12px"
            color={earningsBusd > 0 ? 'textSubtle' : 'textDisabled'}
            decimals={2}
            value={earningsBusd}
            unit=" USD"
            prefix="~"
          />
        </div>
      </ActionContent>
    </Container>
  )
}

export default Earned
