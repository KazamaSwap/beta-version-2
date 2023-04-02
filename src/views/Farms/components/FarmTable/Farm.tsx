import styled from 'styled-components'
import { useFarmUser } from 'state/farms/hooks'
import { useTranslation } from '@kazamaswap/localization'
import { Text } from '@kazamaswap/uikit'
import { Token } from '@kazamaswap/sdk'
import { getBalanceNumber } from 'utils/formatBalance'
import { TokenPairImage } from 'components/TokenImage'
import { useKazamaBusdPrice, useEverGrowBusdPrice, useSdxBusdPrice, useBNBBusdPrice, useEthBusdPrice, useBtcBusdPrice, useXenBusdPrice } from 'hooks/useBUSDPrice'

export interface FarmProps {
  label: string
  pid: number
  token: Token
  quoteToken: Token
}

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  margin-left: 10px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`



const Farm: React.FunctionComponent<React.PropsWithChildren<FarmProps>> = ({ token, quoteToken, label, pid }) => {
  const { stakedBalance } = useFarmUser(pid)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="success" fontSize="12px" bold>
          {t('Active stake')}
        </Text>
      )
    }
    return (
      <Text color="warning" fontSize="12px" bold >
      {t('No active stake')}
    </Text>      
    )
  }

  return (
    <Container>
      <TokenWrapper>
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={44} height={44} />
      </TokenWrapper>
      <div>
        <Text bold>{label}</Text>
        {handleRenderFarming()}
      </div>
    </Container>
  )
}

export default Farm
