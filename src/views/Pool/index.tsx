import 'swiper/css';
import 'swiper/css/pagination';

import LiqFlex from 'components/Layout/Flex';
import { PageMeta } from 'components/Layout/Page';
import PageSection from 'components/PageSection';
import Link from 'next/link';
import { useMemo } from 'react';
import { useProtocolTransactions } from 'state/info/hooks';
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters';
import styled from 'styled-components';
import { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import TopSliderBar from 'views/Home/components/TopSliderBar';
import LiqTransTable from 'views/Info/components/InfoTables/LiqTransTable';
import KazamaLiqOverall from 'views/Info/components/KazamaTopInfo/KazamaLiqOverall';
import LiqChart from 'views/Info/Overview/LiqChart';

import { useTranslation } from '@kazamaswap/localization';
import { AddIcon, Button, CardBody, CardFooter, Flex, Text } from '@kazamaswap/uikit';
import { useWeb3React } from '@kazamaswap/wagmi';

import { AppHeader, FullAppBody } from '../../components/App';
import FullPositionCard from '../../components/KazamaPositionCard';
import Dots from '../../components/Loader/Dots';
import { PairState, usePairs } from '../../hooks/usePairs';
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks';
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks';
import LiquidityPage from '../LiquidityPage';

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-85px);
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    transform: translateY(-240px);
  }
`

const StyledBox = styled.div`
  border-radius: 10px;
  height: 340px;
  min-width: 266px;
  cursor: pointer;
  margin-bottom: 50px;
`

export const TopContainer = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 1em;


  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

const TransactionWrapper = styled.div`
  background: #111923;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
`

const TransactionsContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-85px);
  z-index: 1;
  margin-top: 25px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    transform: translateY(-240px);
  }
`

export const KazamaHeaderText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 3.00px; 
   font-weight: 400;
   margin-bottom: 48px;
`

export const KazamaText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 28px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

export const KazamaLoadingText = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 22px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`


export default function Pool() {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [transactions] = useProtocolTransactions()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          <KazamaText>
          {t('Connect wallet')}
          </KazamaText>
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <KazamaText>{t('Loading ..')}</KazamaText>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        <KazamaText>
        {t('No liquidity found.')}
        </KazamaText>
      </Text>
    )
  }

  return (
    <><><>
      <PageMeta />
    </>
    </>
    <LiquidityPage>
          <LiqChart />
          <Text>Your liquidity</Text>
  <Flex flexDirection="column" alignItems="center">
    <LiqFlex>
      {renderBody()}
      {account && !v2IsLoading}
    </LiqFlex>
    <Text color="textSubtle">
      {t("Don't see a pool you joined?")}
    </Text>
    <Link href="/find" passHref>
      <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
        <KazamaTextButton>
          {t('Find other LP tokens')}
        </KazamaTextButton>
      </Button>
    </Link>
  </Flex>
<CardFooter style={{ textAlign: 'center' }}>
  <Link href="/add" passHref>
    <Button id="join-pool-button" width="33%">
      <KazamaTextButton>
        {t('+ Create New Pair')}
      </KazamaTextButton>
    </Button>
  </Link>
</CardFooter>
          <TransactionWrapper>
          <LiqTransTable transactions={transactions} />
          </TransactionWrapper>
      </LiquidityPage>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
      </>
  )
}
