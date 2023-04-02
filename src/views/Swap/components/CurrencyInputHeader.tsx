import TransactionsModal from 'components/App/Transactions/TransactionsModal';
import SwapSettings from 'components/Menu/GlobalSettings/SwapSettings';
import SubNav from 'components/Menu/SubNav';
import RefreshIcon from 'components/Svg/RefreshIcon';
import toNumber from 'lodash/toNumber';
import { useCallback } from 'react';
import { useExpertModeManager, useGasPrice } from 'state/user/hooks';
import styled from 'styled-components';

import {
    ChartDisableIcon, ChartIcon, Flex, GasIcon, Heading, HistoryIcon, IconButton, NotificationDot,
    Text, useModal
} from '@kazamaswap/uikit';

import { SettingsMode } from '../../../components/Menu/GlobalSettings/types';

interface Props {
  title: string
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const CurrencyInputContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 5px 20px 0px 20px;
  width: 100%;
  border-bottom: 0px solid ${({ theme }) => theme.colors.cardBorder};
`

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
  background: transparent;
`

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  subtitle,
  setIsChartDisplayed,
  isChartDisplayed,
  hasAmount,
  onRefreshPrice,
}) => {
  const [expertMode] = useExpertModeManager()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const handleOnClick = useCallback(() => onRefreshPrice?.(), [onRefreshPrice])
  const gasPrice = toNumber(useGasPrice())

  const CurrentGasPrice = () => {
    if (gasPrice === 11000000000) {
      return (
        <Text fontSize="13px">11 Gwei</Text>
      )
    }
    if (gasPrice === 10000000000) {
      return (
        <Text fontSize="13px">10 Gwei</Text>
      )
    }
    if (gasPrice === 9000000000) {
      return (
        <Text fontSize="13px">9 Gwei</Text>
      )
    }
    return (
<Text fontSize="13px">N/A</Text>     
    )
  }

  return (
    <div style={{marginLeft: "15px", marginRight: "15px", marginTop: "15px", marginBottom: "10px"}}>
    <div style={{display: "flex", flexDirection: "row"}}>
    <div style={{display: "flex", alignItems: "center"}}>
     <SubNav />
     </div>
     <div style={{display: "flex", flexDirection: "row", marginLeft: "auto", textAlign: "center"}}>
       <div style={{display: "flex", alignItems: "center"}}>
       <GasIcon width={16} mr="4px" fill="#7CFF67 !important"/> 
       </div>
       <div style={{display: "flex", alignItems: "center", marginRight: "7px"}}>
       {CurrentGasPrice()}
       </div>
     </div>
     <div style={{display: "flex", alignItems: "center"}}>
     <SwapSettings color="textSubtle" mr="0" mode={SettingsMode.SWAP_LIQUIDITY} />
     </div>
    </div>
    </div>
  )
}

export default CurrencyInputHeader
