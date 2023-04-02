import BigNumber from 'bignumber.js';
import Balance from 'components/Balance';
import RoiCalculatorModal from 'components/RoiCalculatorModal';
import { useFarmUser, useLpTokenPrice } from 'state/farms/hooks';
import styled from 'styled-components';

import { useTranslation } from '@kazamaswap/localization';
import { CalculateIcon, Flex, IconButton, Text, useModal } from '@kazamaswap/uikit';

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;
  font-size: 16px;
  text-transform: bold;

  &:hover {
    opacity: 0.5;
  }
`

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpSymbol: string
  lpLabel?: string
  multiplier: string
  kazamaPrice?: BigNumber
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  strikethrough?: boolean
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  pid,
  lpLabel,
  lpSymbol,
  kazamaPrice,
  apr,
  multiplier,
  displayApr,
  addLiquidityUrl,
  strikethrough,
}) => {
  const { t } = useTranslation()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const { tokenBalance, stakedBalance } = useFarmUser(pid)
  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      linkLabel={t('Get %symbol%', { symbol: lpLabel })}
      stakingTokenBalance={stakedBalance.plus(tokenBalance)}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpPrice.toNumber()}
      earningTokenPrice={kazamaPrice.toNumber()}
      apr={apr}
      multiplier={multiplier}
      displayApr={displayApr}
      linkHref={addLiquidityUrl}
      isFarm
    />,
  )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <Flex flexDirection="column">
      <Flex>
      <ApyLabelContainer
      alignItems="center"
    
      style={strikethrough && { textDecoration: 'line-through' }}
    >
      {displayApr}%
      {/* {variant === 'text-and-button' && (
        <IconButton variant="text" scale="sm" ml="4px">
          <CalculateIcon width="18px" />
        </IconButton>
      )} */}
      </ApyLabelContainer>
      </Flex>
      <Flex mt="3px">
      <Text fontSize="13px">Annualized</Text>
      </Flex>
    </Flex>
  )
}

export default ApyButton
