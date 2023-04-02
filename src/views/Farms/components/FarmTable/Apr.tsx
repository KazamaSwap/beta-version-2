import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Skeleton, Text, Flex } from '@kazamaswap/uikit'
import Balance from 'components/Balance'

export interface AprProps {
  value: string
  multiplier: string
  pid: number
  lpLabel: string
  lpSymbol: string
  lpRewardsApr: number
  tokenAddress?: string
  quoteTokenAddress?: string
  kazamaPrice: BigNumber
  originalValue: number
  hideButton?: boolean
  strikethrough?: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 15px;
    height: 15px;
    margin-top: 0px;
    margin-bottom: 0px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
`

const Apr: React.FC<React.PropsWithChildren<AprProps>> = ({
  value,
  pid,
  lpLabel,
  lpSymbol,
  multiplier,
  tokenAddress,
  quoteTokenAddress,
  kazamaPrice,
  originalValue,
  hideButton = false,
  strikethrough,
}) => {
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <ApyButton
          variant={hideButton ? 'text' : 'text-and-button'}
          pid={pid}
          lpSymbol={lpSymbol}
          lpLabel={lpLabel}
          multiplier={multiplier}
          kazamaPrice={kazamaPrice}
          apr={originalValue}
          displayApr={value}
          addLiquidityUrl={addLiquidityUrl}
          strikethrough={strikethrough}
        />
      ) : (
        <AprWrapper>
          <Flex flexDirection="column">
            <Flex>
            <Balance
            fontSize="16px"
            decimals={2}
            value={0}
            unit="%"
          />
            </Flex>
            <Flex>
            <Text fontSize="13px">Annualized</Text>
            </Flex>
          </Flex>
        </AprWrapper>
      )}
    </Container>
  ) : (
    <Container>
        <AprWrapper>
      <Text fontSize="16px" bold>
        {originalValue}%
        </Text>
        </AprWrapper>
    </Container>
  )
}

export default Apr
