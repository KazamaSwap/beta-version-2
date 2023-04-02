import BigNumber from 'bignumber.js';
import Balance from 'components/Balance';
import React from 'react';
import { usePriceKazamaBusd } from 'state/farms/hooks';
import styled from 'styled-components';
import { BIG_ZERO } from 'utils/bigNumber';

import { Flex, Skeleton, Text } from '@kazamaswap/uikit';

export interface EarnedProps {
  pid: number
  earnings: number
}

interface EarnedPropsWithLoading extends EarnedProps {
  userDataReady: boolean
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const UsdAmount = styled.span`
  display: flex;
  align-items: center;
`

const Earned: React.FunctionComponent<React.PropsWithChildren<EarnedPropsWithLoading>> = ({
  userDataReady,
  earnings,
}) => {
  const kazamaPrice = usePriceKazamaBusd()
  const usdValue = new BigNumber(earnings)
  const usdEarnings = usdValue.times(kazamaPrice)


  let earningsColor;
  if (earnings > 0)  {
    earningsColor = "#fff";
  } else {
    earningsColor = "#fff"
  }

  const usdEarningsValue = () => {
    if (usdEarnings.isGreaterThan(0)) {
      return (
      <Balance
            fontSize="13px"
            decimals={2}
            // @ts-ignore
            value={usdEarnings}
            prefix="$"
          />
      )      
    }
    return (
      <Balance
            fontSize="13px"
            decimals={2}
            value={0}
            prefix="$"
          />      
    )
  }

  const kazamaEarnings = () => {
    if (earnings > 0) {
      return (
        <Balance
        fontSize="16px"
        decimals={2}
        value={earnings}
      />   
      )
    }
      return (
        <Balance
        fontSize="16px"
        decimals={3}
        value={0}
      />          
      )
    }

  if (userDataReady) {
    return <>
    <Flex flexDirection="column">
      <Flex>
      {kazamaEarnings()}
      </Flex>
      <Flex mt="3px">
      {usdEarningsValue()}
      </Flex>
    </Flex>
    </>
  }

  return (
    <Amount earned={0}>
      {/* <Skeleton width={60} /> */} 0.00
    </Amount>
  )
}

export default Earned
