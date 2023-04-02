import styled from 'styled-components'
import { Box, Text } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import LineChartLoaderSVG from './LineChartLoaderSVG'
import BarChartLoaderSVG from './BarChartLoaderSVG'
import CandleChartLoaderSVG from './CandleChartLoaderSVG'

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 24px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const LoadingText = styled(Box)`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
`

const LoadingIndicator = styled(Box)`
  height: 100%;
  position: relative;
`

export const BarChartLoader: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  return (
    <LoadingIndicator>
      <BarChartLoaderSVG />
      {/* <LoadingText>
        <Text color="textSubtle" fontSize="20px">
          <KazamaTextButton>
          {t('Loading chart data...')}
          </KazamaTextButton>
        </Text>
      </LoadingText> */}
    </LoadingIndicator>
  )
}

export const LineChartLoader: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  return (
    <LoadingIndicator>
      <LineChartLoaderSVG />
      {/* <LoadingText>
        <Text color="textSubtle" fontSize="24px">
        <KazamaTextButton>
          {t('Loading chart data ...')}
        </KazamaTextButton>
        </Text>
      </LoadingText> */}
    </LoadingIndicator>
  )
}

export const CandleChartLoader: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  return (
    <LoadingIndicator>
      <CandleChartLoaderSVG />
      {/* <LoadingText>
        <Text color="textSubtle" fontSize="20px">
          {t('Loading chart data...')}
        </Text>
      </LoadingText> */}
    </LoadingIndicator>
  )
}
