import { Flex, Button, Text } from '@kazamaswap/uikit'
import { useState } from 'react'
import styled from 'styled-components'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from '@kazamaswap/localization'
import { useGasPriceManager } from 'state/user/hooks'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@kazamaswap/sdk'

export const KazamaTextButton = styled(Button)`
color: #fff;
font-weight: 600;
font-size: 14px;
border-radius: 8px;
`

const InfoWrapper = styled.div`
padding: 0.75rem;
    border-radius: 14px;
    border: 1px solid #1b2031;
    margin-top: 3px;
    width: 100%;
`

const GasSettings = () => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const [gasPrice, setGasPrice] = useState(GAS_PRICE_GWEI.instant)

  return (
      <InfoWrapper>
      {chainId === ChainId.BSC || ChainId.BSC_TESTNET && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text>{t('Transaction Speed (GWEI)')}</Text>
        </Flex>
      )}
            <Text fontSize="12px" color="#93acd3" mb="2px">
            Higher GWEI = higher speed = higher fees
              </Text>
      <Flex flexWrap="wrap" justifyContent="space-between">
        <KazamaTextButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'tertiary'}
        >
          {t('Default (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
        </KazamaTextButton>
        <KazamaTextButton
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'tertiary'}
        >
          {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
        </KazamaTextButton>
        <KazamaTextButton
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'tertiary'}
        >
          {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
        </KazamaTextButton>
      </Flex>
      </InfoWrapper>
  )
}

export default GasSettings
