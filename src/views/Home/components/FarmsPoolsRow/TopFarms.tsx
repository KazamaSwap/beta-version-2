import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { PocketWatchIcon, Flex, SwapVertIcon, IconButton, Card, Box, CardBody, CardRibbon, Button, CardFooter } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { DeserializedPool } from 'state/types'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useGetTopFarmsByApr from 'views/Home/hooks/useGetTopFarmsByApr'
import useGetTopPoolsByApr from 'views/Home/hooks/useGetTopPoolsByApr'
import pools, { vaultPoolConfig } from 'config/constants/pools'
import { useVaultApy } from 'hooks/useVaultApy'
import { TokenPairImage } from 'components/TokenImage'
import Pool from 'views/Pool'
import LiqFlex from 'components/Layout/Flex'
import TopFarmsStyle from './TopFarmsStyle'
import RowHeading from './RowHeading'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
    grid-template-columns: repeat(5, auto);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
  }
`

const StyledCardFooter = styled(CardFooter)`
  z-index: 2;
  background: none;
  border-radius: 0px 0px 15px 15px;
`

export const KazamaTextButton = styled(Button)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const StyledCardBody = styled(CardBody)`
padding: 5px;
background-image: linear-gradient(#21202c ,#292734);
position: relative;
overflow: hidden;
padding-top: 7px;
padding-bottom: 8px;
padding-left: 5px;
z-index: 10;
border-top: 1px ${({ theme }) => theme.colors.cardBorder} solid;
border-bottom: 2px ${({ theme }) => theme.colors.cardBorder} solid;
border-left: 1px ${({ theme }) => theme.colors.cardBorder} solid;
border-right: 2px ${({ theme }) => theme.colors.cardBorder} solid;
border-radius: 10px;
margin-bottom: 10px;
-webkit-filter: drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.301));
&:hover {
  transform: scale(1.01);
}
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;
  z-index: 100;
  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

const TopFarms = () => {
  const [showFarms, setShowFarms] = useState(false)
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { topFarms, fetched } = useGetTopFarmsByApr(isIntersecting)
  const { topPools } = useGetTopPoolsByApr(fetched && isIntersecting)
  const { lockedApy } = useVaultApy()

  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const isLoaded = topFarms[0] && topPools[0]

  const startTimer = useCallback(() => {
    timer.current = setInterval(() => {
      setShowFarms((prev) => !prev)
    }, 6000)
  }, [timer])

  useEffect(() => {
    if (isLoaded) {
      startTimer()
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [timer, isLoaded, startTimer])

  const getPoolText = (pool: DeserializedPool) => {
    if (pool.vaultKey) {
      return vaultPoolConfig[pool.vaultKey].name
    }

    return t('Stake %stakingSymbol% - Earn %earningSymbol%', {
      earningSymbol: pool.earningToken.symbol,
      stakingSymbol: pool.stakingToken.symbol,
    })
  }

  return (
    <div ref={observerRef}>
      <StyledCardBody>
      <StyledCardRibbon text={t(' TOP FARMS')} />
      <Flex flexDirection="column" mt="24px">
        <Box height={['240px', null, '80px']}>
        {/* <TokenPairImage variant="inverted" primaryToken={topFarms} secondaryToken={quoteToken} width={40} height={40} /> */}
            {topFarms.map((topFarm, index) => (
              <TopFarmsStyle
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                title={topFarm?.lpSymbol}
                percentage={topFarm?.apr + topFarm?.lpRewardsApr}
                index={index}
                visible={showFarms}
              />
            ))}
        </Box>
      </Flex>
      <StyledCardFooter>
        <KazamaTextButton width="100%">
        <PocketWatchIcon color="invertedContrast" width="35px" mr="7px" />
          Go To Farms
        </KazamaTextButton>
      </StyledCardFooter>
      </StyledCardBody>
    </div>
  )
}

export default TopFarms
