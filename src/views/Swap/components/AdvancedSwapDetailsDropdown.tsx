import useLastTruthy from 'hooks/useLast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUserSlippageTolerance } from 'state/user/hooks';
import styled from 'styled-components';

import { Card, KazamaFrontCard, Text, Flex, Box } from '@kazamaswap/uikit';

import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails';
import TradePrice from './TradePrice';

const DetailsCard = styled(KazamaFrontCard)`
  background-color: transparent;
  border-bottom: 3px solid #1B1A23;
  border-radius: 15px;
`

const Label = styled(Text)`
  font-size: 15px;
  color: #fff;
`

const PriceBox = styled.div`
display: flex;
justify-content: space-between;
`

const SlippageBox = styled.div`
display: flex;
justify-content: space-between;
padding-bottom: 7px;
margin-bottom: 7px;
`

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? 0 : 0)};
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  transition: transform 300ms ease-in-out;
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

// eslint-disable-next-line consistent-return
const slippageMessage = () => {
  if (allowedSlippage < 50) {
    return (
      <Flex style={{ background: "#FF5958", borderRadius: "7px", display: "inline-block", width: "145px", height: "20px", marginLeft: "auto" }}>
      <Text textAlign="center" fontSize="12px" color="#fff">{allowedSlippage / 100}% / Might fail
      </Text>
    </Flex>
    )
  }
   if (allowedSlippage < 600) {
    return (
      <Flex style={{ background: "#29304a", borderRadius: "7px", display: "inline-block", width: "145px", height: "20px", marginLeft: "auto" }}>
      <Text textAlign="center" fontSize="12px" color="#fff">{allowedSlippage / 100}% / Safe slippage
      </Text>
    </Flex>
    )
  }
   if (allowedSlippage > 500) {
    return (
      <Flex style={{ background: "#F3841E", borderRadius: "7px", display: "inline-block", width: "145px", height: "20px", marginLeft: "auto" }}>
      <Text textAlign="center" fontSize="12px" color="#fff">{allowedSlippage / 100}% / Might frontrun
      </Text>
    </Flex>
    )
  }
   if (allowedSlippage > 4900) {
    return (
      <Flex style={{ background: "#FF5958", borderRadius: "7px", display: "inline-block", width: "145px", height: "20px", marginLeft: "auto" }}>
      <Text textAlign="center" fontSize="12px" color="#fff">{allowedSlippage / 100}% / Unvalid value
      </Text>
    </Flex>
    )
  }
}

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <PriceBox>
        <Label>Price</Label>
        <TradePrice
     price={trade?.executionPrice}
     showInverted={showInverted}
     setShowInverted={setShowInverted} />
      </PriceBox>
      <SlippageBox>
      <Label>Slippage</Label>
      {slippageMessage()}
      </SlippageBox>

      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
