import { useCallback } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Card, CardBody, Flex, Skeleton, Text, ArrowForwardIcon } from '@kazamaswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@kazamaswap/localization'
import { usePriceKazamaBusd } from 'state/farms/hooks'
import useToast from 'hooks/useToast'
import { useSenshimaster } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { harvestFarm } from 'utils/calls'
import Balance from 'components/Balance'
import { useGasPrice } from 'state/user/hooks'
import { ToastDescriptionWithTx } from 'components/Toast'
import useFarmsWithBalance from 'views/Home/hooks/useFarmsWithBalance'
import { getEarningsText } from './EarningsText'

const StyledCard = styled(Card)`
  width: 100%;
  height: fit-content;
`

const HarvestCard = () => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { farmsWithStakedBalance, earningsSum: farmEarningsSum } = useFarmsWithBalance()

  const senshiMasterContract = useSenshimaster()
  const kazamaPriceBusd = usePriceKazamaBusd()
  const gasPrice = useGasPrice()
  const earningsBusd = new BigNumber(farmEarningsSum).multipliedBy(kazamaPriceBusd)
  const numTotalToCollect = farmsWithStakedBalance.length
  const numFarmsToCollect = farmsWithStakedBalance.filter((value) => value.pid !== 0).length
  const hasKazamaPoolToCollect = numTotalToCollect - numFarmsToCollect > 0

  const earningsText = getEarningsText(numFarmsToCollect, hasKazamaPoolToCollect, earningsBusd, t)
  const [preText, toCollectText] = earningsText.split(earningsBusd.toString())

  const harvestAllFarms = useCallback(async () => {
    for (let i = 0; i < farmsWithStakedBalance.length; i++) {
      const farmWithBalance = farmsWithStakedBalance[i]
      // eslint-disable-next-line no-await-in-loop
      const receipt = await fetchWithCatchTxError(() => {
        return harvestFarm(senshiMasterContract, farmWithBalance.pid, gasPrice)
      })
      if (receipt?.status) {
        toastSuccess(
          `${t('Harvested')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'KAZAMA' })}
          </ToastDescriptionWithTx>,
        )
      }
    }
  }, [farmsWithStakedBalance, senshiMasterContract, toastSuccess, t, fetchWithCatchTxError, gasPrice])

  return (
    <StyledCard>
      <CardBody>
        <Flex flexDirection={['column', null, null, 'row']} justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column" alignItems={['center', null, null, 'flex-start']}>
            {preText && (
              <Text mb="4px" color="textSubtle">
                {preText}
              </Text>
            )}
            {!earningsBusd.isNaN() ? (
              <Balance
                decimals={earningsBusd.gt(0) ? 2 : 0}
                fontSize="24px"
                bold
                prefix={earningsBusd.gt(0) ? '$' : '$'}
                lineHeight="1.1"
                value={earningsBusd.toNumber()}
              />
            ) : (
              <Skeleton width={96} height={24} my="2px" />
            )}
            <Text mb={['16px', null, null, '0']} color="textSubtle">
              {toCollectText}
            </Text>
          </Flex>
          {numTotalToCollect <= 0 ? (
            <NextLinkFromReactRouter to="farms">
              <Button width={['100%', null, null, 'auto']} variant="secondary">
                <Text color="primary" bold>
                  {t('Start earning')}
                </Text>
                <ArrowForwardIcon ml="4px" color="primary" />
              </Button>
            </NextLinkFromReactRouter>
          ) : (
            <Button
              width={['100%', null, null, 'auto']}
              id="harvest-all"
              isLoading={pendingTx}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              disabled={pendingTx}
              onClick={harvestAllFarms}
            >
              <Text color="invertedContrast" bold>
                {pendingTx ? t('Harvesting') : t('Harvest all')}
              </Text>
            </Button>
          )}
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default HarvestCard
