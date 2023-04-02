import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {
  CardBody,
  Card,
  Heading,
  Flex,
  Skeleton,
  Text,
  Box,
  Button,
  useModal,
  CardRibbon,
  useMatchBreakpoints,
  ExpandableLabel,
  ChevronUpIcon
} from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { LotteryRound, LotteryRoundGraphEntity } from 'state/types'
import { getGraphLotteries } from 'state/lottery/getLotteriesData'
import { useGetLotteryGraphDataById, useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import { getDrawnDate } from 'views/Lottery/helpers'
import WinningNumbers from '../WinningNumbers'
import ViewTicketsModal from '../ViewTicketsModal'
import CellLayout from './CellLayout'
import FooterExpanded from './FooterExpanded'

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const CellInner = styled.div`
  padding: 16px 0px;
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

const StyledTr = styled.tr`
  padding: 0px 16px;
  cursor: pointer;
  max-width: 100%;
  background: #241f2e;
  &:not(:last-child) {
    border-bottom: 1px solid #1B1A23;
  }
  &:hover {
    background-color: #2e2b3a;
    overflow: hidden;
  }
`

const RoundCard: React.FC<React.PropsWithChildren<{ lotteryNodeData: LotteryRound; lotteryId: string }>> =
  ({ lotteryNodeData, lotteryId }) => {
    const { t,
      currentLanguage: { locale }, } = useTranslation()

    const userLotteryData = useGetUserLotteriesGraphData()
    const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)
    const [fetchedLotteryGraphData, setFetchedLotteryGraphData] = useState<LotteryRoundGraphEntity>()
    const lotteryGraphDataFromState = useGetLotteryGraphDataById(lotteryId)
    const { isLg, isXl, isXxl } = useMatchBreakpoints()
    const isLargerScreen = isLg || isXl || isXxl
    const tableWrapperEl = useRef<HTMLDivElement>(null)
    const scrollToTop = (): void => {
      tableWrapperEl.current.scrollIntoView({
        behavior: 'smooth',
      })
    }

    const [onPresentViewTicketsModal] = useModal(
      <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryNodeData?.status} />,
    )

    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
      if (!lotteryId) {
        setIsExpanded(false)
      }
    }, [lotteryId])

    useEffect(() => {
      const getGraphData = async () => {
        const fetchedGraphData = await getGraphLotteries(undefined, undefined, { id_in: [lotteryId] })
        setFetchedLotteryGraphData(fetchedGraphData[0])
      }
      if (!lotteryGraphDataFromState) {
        getGraphData()
      }
    }, [lotteryGraphDataFromState, lotteryId])

    const getTotalUsers = (): string => {
      if (!lotteryGraphDataFromState && fetchedLotteryGraphData) {
        return fetchedLotteryGraphData?.totalUsers?.toLocaleString()
      }

      if (lotteryGraphDataFromState) {
        return lotteryGraphDataFromState?.totalUsers?.toLocaleString()
      }

      return null
    }

    const kazamaPriceBusd = usePriceKazamaBusd()
    let prizeInBusd = new BigNumber(NaN)
    if (lotteryNodeData) {
      const { amountCollectedInKazama } = lotteryNodeData
      prizeInBusd = amountCollectedInKazama.times(kazamaPriceBusd)
    }

    return (
      <>
        <Card>
        <td key='winning-numbers'>
            <WinningNumbersCell>
              {lotteryId ? (
                lotteryNodeData?.finalNumber ? (
                  <WinningNumbers
                    rotateText={false}
                    number={lotteryNodeData?.finalNumber.toString()}
                    size="100%"
                    fontSize={isLargerScreen ? '18px' : '14px'}
                  />
                ) : (
                  <Skeleton
                    width={['160px', null, null, '220px']}
                    height={['24px', null, null, '36px']}
                    mr={[null, null, null, '32px']}
                  />
                )
              ) : (
                <Flex />
              )}
            </WinningNumbersCell>
          </td>







          
          {/* <td key='round-id'>
            <RoundIdCell>
              <Heading scale='md'>Round #{lotteryId}</Heading>
              {lotteryNodeData?.endTime ? (
                <Text fontSize="12px" color='textSubtle' style={{ letterSpacing: '-.3px' }}>
                  {t('Drawn')} {getDrawnDate(locale, lotteryNodeData.endTime)}
                </Text>
              ) : (
                <Skeleton width="185px" height="21px" />
              )}
            </RoundIdCell>
          </td> */}


          {/* <td key='winning-numbers'>
            <WinningNumbersCell>
              {lotteryId ? (
                lotteryNodeData?.finalNumber ? (
                  <WinningNumbers
                    rotateText={false}
                    number={lotteryNodeData?.finalNumber.toString()}
                    size="100%"
                    fontSize={isLargerScreen ? '18px' : '14px'}
                  />
                ) : (
                  <Skeleton
                    width={['160px', null, null, '220px']}
                    height={['24px', null, null, '36px']}
                    mr={[null, null, null, '32px']}
                  />
                )
              ) : (
                <Flex />
              )}
            </WinningNumbersCell>
          </td> */}


          {/* {isLargerScreen && (
            <>
              <td key='prize-pool'>
                <CellInner style={{ width: '200px' }}>
                  <CellLayout label='Prize pool'>
                    <div>
                      {prizeInBusd.isNaN() ? (
                        <Skeleton my="7px" height={40} width={200} />
                      ) : (
                        <Heading scale="sm" lineHeight="1" color="text">
                          {formatNumber(getBalanceNumber(lotteryNodeData?.amountCollectedInKazama), 0, 0)} {' KAZAMA'}
                        </Heading>
                      )}
                      {prizeInBusd.isNaN() ? (
                        <Skeleton my="2px" height={14} width={90} />
                      ) : (
                        <Balance
                          fontSize="14px"
                          color="success"
                          unit=""
                          prefix='~$'
                          value={getBalanceNumber(prizeInBusd)}
                          decimals={0}
                        />
                      )}
                    </div>
                  </CellLayout>
                </CellInner>
              </td> */}


              {/* <td key='your-tickets'>
                <CellInner>
                  <CellLayout label='Your tickets'>
                    <div>
                    {
                      userDataForRound ? (
                        <>
                        <Text display="inline" bold>
                          {userDataForRound.totalTickets}
                        </Text>
                        <div>
                        <Button
                          onClick={onPresentViewTicketsModal}
                          p="1"
                          variant="secondaryWarning"
                          scale="xs"
                        >
                            {t('View Tickets')}
                          </Button>
                          </div>
                          </>
                      ) : (
                        <Text display="inline" bold>
                          0
                        </Text>
                      )
                    }
                    </div>
                  </CellLayout>
                </CellInner>
              </td> */}


              {/* <td key='total-players'>
                <CellInner>
                  <CellLayout label='Total players'>
                    <Text display="inline" bold>
                      {lotteryNodeData && (lotteryGraphDataFromState || fetchedLotteryGraphData) ? (
                        getTotalUsers()
                      ) : (
                        <Skeleton height={14} width={31} />
                      )}
                    </Text>
                  </CellLayout>
                </CellInner>
              </td>              
            </>
          )} */}

          {/* <td key='action'>
            <ActionCell>
              <ExpandableLabel
                expanded={isExpanded}
                onClick={() => {
                  if (lotteryId) {
                    setIsExpanded(!isExpanded)
                  }
                }}
              >
                 {isLargerScreen && (isExpanded ? t('Hide') : t('Details'))} 
              </ExpandableLabel>
            </ActionCell>
          </td> */}
          
        </Card>

        {/* {isExpanded && (
          <tr>
            <td colSpan={isLargerScreen ? 6 : 3}>
              <FooterExpanded lotteryNodeData={lotteryNodeData} lotteryId={lotteryId} yourTickets={userDataForRound?.totalTickets || '0'} />
            </td>
          </tr>
        )} */}

      </>
    )
  }

export default RoundCard
