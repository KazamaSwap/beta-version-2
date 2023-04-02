import { useState } from 'react'
import { JSBI, Pair, Percent } from '@kazamaswap/sdk'
import {
  Button,
  Box,
  Text,
  LiqCardFooter,
  ChevronUpIcon,
  ChevronDownIcon,
  Card,
  CardBody,
  Flex,
  Heading,
  CardProps,
  AddIcon,
  TooltipText,
  useTooltip,
  useMatchBreakpoints
} from '@kazamaswap/uikit'
import ProgressBar from "@ramonak/react-progress-bar"
import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@kazamaswap/localization'
import useTotalSupply from 'hooks/useTotalSupply'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useWeb3React } from '@kazamaswap/wagmi'
import { BIG_INT_ZERO } from 'config/constants/exchange'

import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { AutoColumn } from '../Layout/Column'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed } from '../Layout/Row'
import Dots from '../Loader/Dots'
import { formatAmount } from '../../utils/formatInfoNumbers'
import { useLPApr } from '../../state/swap/hooks'
import CellLayout from '../../views/Lottery/components/PreviousRoundCard/CellLayout'

const CellInner = styled.div`
  padding: 8px 0px;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  padding-right: 8px;
`

const RoundIdCell = styled(CellInner)`
  width: 100px;
  & > h2 {
    font-size: 16px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 190px;
  }
`

const WinningNumbersCell = styled(CellInner)`
  width: 180px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 220px;
  }
`

const ActionCell = styled(CellInner)`
  width: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 80px;
  }
`

const StyledTr = styled(Flex)`
  padding: 0px 10px;
  max-width: 100%;
  background: #111923;
  border-radius: 10px;
  justify-content: space-between;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.35);
  }
`

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const FixedCardBody = styled(Card)`
  min-width: 375px;
  max-width: 375px;
`

export const KazamaText = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 24px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

export const KazamaTextButton = styled(Text)`
font-family: 'Luckiest Guy', cursive;
font-style: regular;
font-size: 18px;
-webkit-text-fill-color: white;
-webkit-text-stroke-color: black;
-webkit-text-stroke-width: 1.00px; 
font-weight: 400;
`

export const PairedCard = styled(Box)`
background: #2e2b3a;
border-radius: 13px;
padding: 10px;
`

export const UsdWrapper = styled.div`
background: #1C2532;
border-radius: 5px;
padding: 5px 5px 5px 5px;
width: 100%;
align-items: center;
`

interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
}

const useLPValues = (account, pair, currency0, currency1) => {
  const token0Price = useBUSDPrice(currency0)
  const token1Price = useBUSDPrice(currency1)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const token0USDValue =
    token0Deposited && token0Price
      ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(6)))
      : null
  const token1USDValue =
    token1Deposited && token1Price
      ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(6)))
      : null
  const totalUSDValue = token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null

  return { token0Deposited, token1Deposited, totalUSDValue, poolTokenPercentage, userPoolBalance, token0USDValue, token1USDValue }
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const { totalUSDValue, poolTokenPercentage, token0Deposited, token1Deposited, userPoolBalance } = useLPValues(
    account,
    pair,
    currency0,
    currency1,
  )

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, BIG_INT_ZERO) ? (
        <Card>
          <CardBody>
            <AutoColumn gap="16px">
              <FixedHeightRow>
                <RowFixed>
                  <Text color="secondary" bold>
                    {t('LP tokens in your wallet')}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <RowFixed>
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                  <Text small color="textSubtle">
                    {currency0.symbol}-{currency1.symbol} LP
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Flex flexDirection="column" alignItems="flex-end">
                    <Text>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                    {Number.isFinite(totalUSDValue) && (
                      <Text small color="success">{`~ ${totalUSDValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD`}</Text>
                    )}
                  </Flex>
                </RowFixed>
              </FixedHeightRow>
              <AutoColumn gap="4px">
                {poolData && (
                  <FixedHeightRow>
                    <TooltipText ref={targetRef} color="textSubtle" small>
                      {t('LP reward APR')}:
                    </TooltipText>
                    {tooltipVisible && tooltip}
                    <Text>{formatAmount(poolData.lpApr7d)}%</Text>
                  </FixedHeightRow>
                )}
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Share of Pool')}:
                  </Text>
                  <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Pooled %asset%', { asset: currency0.symbol })}:
                  </Text>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Pooled %asset%', { asset: currency1.symbol })}:
                  </Text>
                  {token1Deposited ? (
                    <RowFixed>
                      <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
          </CardBody>
        </Card>
      ) : (
        <LightCard>
          <Text fontSize="14px" style={{ textAlign: 'center' }}>{' '}
            {t(
              "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
            )}
          </Text>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, ...props }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )
  const [showMore, setShowMore] = useState(true)

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl

  const { totalUSDValue, poolTokenPercentage, token0Deposited, token1Deposited, userPoolBalance, token0USDValue, token1USDValue } = useLPValues(
    account,
    pair,
    currency0,
    currency1,
  )

  return (
    <>
    <StyledTr style={{marginBottom: "3px"}}>
          <td key='prize-pool'>
            <CellInner style={{ width: '200px' }}>
            {token0Deposited ? (
              <Flex flexDirection="row">
              <Flex alignItems="center">
              <CurrencyLogo size="28px" currency={currency0} />
              </Flex>
              <Flex>
                <Flex flexDirection="column" ml="10px">
                  <Flex>
                  <Text color="#93acd3">Pooled {currency0.symbol}</Text>
                  </Flex>
                  <Flex>
                  <Text>{token0Deposited?.toSignificant(5)}</Text>
                  </Flex>
                  <Flex>
                  <Text fontSize="12px" color="#fff">{`$${token0USDValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USD`}
              </Text>
                  </Flex>
                </Flex>
              </Flex>
              </Flex>
                            ) : (
                              '-'
                            )}
            </CellInner>
          </td>
          <td key='prize-pool'>
          <CellInner style={{ width: '200px' }}>
            {token1Deposited ? (
              <Flex flexDirection="row">
              <Flex alignItems="center">
              <CurrencyLogo size="28px" currency={currency1} />
              </Flex>
              <Flex>
                <Flex flexDirection="column" ml="10px">
                  <Flex>
                  <Text color="#93acd3">Pooled {currency1.symbol}</Text>
                  </Flex>
                  <Flex>
                  <Text>{token1Deposited?.toSignificant(5)}</Text>
                  </Flex>
                  <Flex>
                  <Text fontSize="12px" color="#fff">{`$${token1USDValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USD`}</Text>
                  </Flex>
                </Flex>
              </Flex>
              </Flex>
                            ) : (
                              '-'
                            )}
            </CellInner>
          </td>
      <td key='prize-pool'>
            <CellInner style={{ width: '200px' }}>
            <Text color="#93acd3">LP Tokens</Text>
                <div>
                  <Flex flexDirection="column">
                    <Flex>
                    <Text fontSize="15px" color="textSubtle">
              {userPoolBalance?.toSignificant(4)}
            </Text>
                    </Flex>
                    <Flex>
                    {Number.isFinite(totalUSDValue) && (
              <Text fontSize="12px" color="#fff">{`$${totalUSDValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USD`}</Text>
            )}
                    </Flex>

                    {/* <Flex>
                    {Number.isFinite(totalUSDValue) && (
              <Text small color="success">{`$${totalUSDValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USD`}</Text>
            )}
                    </Flex> */}
                  </Flex>
                </div>
            </CellInner>
          </td>
      {isLargerScreen && (
        <>

          <td key='prize-pool'>
            <CellInner style={{ width: '200px' }}>
            <Text color="#93acd3">Share Of Pool</Text>
            <Flex flexDirection="column">
              <Flex>
              {poolTokenPercentage
                  ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '< 0.01' : poolTokenPercentage.toFixed(2)}% / 100.00%`
                  : '-'}
              </Flex>
              <Flex mt="10px">
              <ProgressBar baseBgColor="rgba(238, 26, 121, 0.151)" transitionTimingFunction="ease-in-out" isLabelVisible={false} bgColor="#EE1A78" width="125px" height="10px" completed={33} maxCompleted={100}/>
              </Flex>
            </Flex>
            </CellInner>
          </td>
          <td key='prize-pool'>
            <CellInner style={{ width: '200px' }}>
            <Text color="#93acd3">Share Of Pool</Text>
            <Flex flexDirection="column">
              <Flex>
              {poolTokenPercentage
                  ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '< 0.01' : poolTokenPercentage.toFixed(2)}% / 100.00%`
                  : '-'}
              </Flex>
              <Flex mt="10px">
              <ProgressBar baseBgColor="#201c29" transitionTimingFunction="ease-in-out" bgColor="#EE1A78" width="125px" height="10px" completed={24} maxCompleted={100}/>
              </Flex>
            </Flex>
            </CellInner>
          </td>
        </>
      )}
    </StyledTr>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
</>
  )
}
