import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Flex,
  Text,
  Button,
  Modal,
  LinkExternal,
  CalculateIcon,
  IconButton,
  Skeleton,
  AutoRenewIcon,
  Message,
  MessageText,
  ErrorIcon,
  ArrowDownIcon
} from '@kazamaswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from '@kazamaswap/localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
  margin-top: 7px;
  margin-bottom: 5px;
`

const StyledInputWrapper = styled.div`
padding: 0.75rem;
background: #1b2031;
border-radius: 14px;
border: 1px solid #11141e;
text-align: center;
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-down {
    fill: #fff !important;
  }
  .icon-up-down {
    display: none;
    fill: #fff !important;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const InfoWrapper = styled.div`
padding: 0.75rem;
border-radius: 14px;
border: 1px solid #1b2031;
margin-top: 10px;
`

const StyledSwitchButton = styled(SwitchIconButton)`
border-radius: 50%;
background: #191e2e;
z-index: 100;
border: 1px solid #11141e;
`

const StyledActions = styled.div`
padding-top: 10px !important;
padding-bottom: 10px !important;
`

interface DepositModalProps {
  max: BigNumber
  stakedBalance: BigNumber
  multiplier?: string
  lpPrice: BigNumber
  lpLabel?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  kazamaPrice?: BigNumber
  showActiveBooster?: boolean
}

const DepositModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  max,
  stakedBalance,
  onConfirm,
  onDismiss,
  tokenName = '',
  multiplier,
  displayApr,
  lpPrice,
  lpLabel = '',
  apr,
  addLiquidityUrl,
  kazamaPrice,
  showActiveBooster,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const lpTokensToStake = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const usdToStake = lpTokensToStake.times(lpPrice)

  const interestBreakdown = getInterestBreakdown({
    principalInUSD: !lpTokensToStake.isNaN() ? usdToStake.toNumber() : 0,
    apr,
    earningTokenPrice: kazamaPrice.toNumber(),
  })

  const annualRoi = kazamaPrice.times(interestBreakdown[3])
  const annualRoiAsNumber = annualRoi.toNumber()
  const formattedAnnualRoi = formatNumber(annualRoiAsNumber, annualRoi.gt(10000) ? 0 : 2, annualRoi.gt(10000) ? 0 : 2)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        linkLabel={t('Get %symbol%', { symbol: lpLabel })}
        stakingTokenBalance={stakedBalance.plus(max)}
        stakingTokenSymbol={tokenName}
        stakingTokenPrice={lpPrice.toNumber()}
        earningTokenPrice={kazamaPrice.toNumber()}
        apr={apr}
        multiplier={multiplier}
        displayApr={displayApr}
        linkHref={addLiquidityUrl}
        isFarm
        initialValue={val}
        onBack={() => setShowRoiCalculator(false)}
      />
    )
  }

  return (
    <Modal title={t('Stake LP tokens')} onDismiss={onDismiss}>
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={t('Stake')}
      />
      {showActiveBooster ? (
        <Message variant="warning" icon={<ErrorIcon width="24px" color="warning" />} mt="32px">
          <MessageText>
            {t('The yield booster multiplier will be updated based on the latest staking conditions.')}
          </MessageText>
        </Message>
      ) : null}
              <div style={{ padding: '0 1rem', marginTop: '-1.25rem', marginBottom: '-1.25rem', textAlign: 'center' }}>
          <StyledSwitchButton variant="light" scale="sm">
          <ArrowDownIcon />
          </StyledSwitchButton>
        </div>
        <StyledInputWrapper style={{textAlign: 'center'}}>
        {Number.isFinite(annualRoiAsNumber) ? (
            <><AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay></>
        ) : (
          <Text fontSize="20px">-</Text>
        )}
                <Text mr="8px" color="textSubtle" fontSize="13px">
          {t('Annual ROI at current rates')}
        </Text>
        </StyledInputWrapper>
        <InfoWrapper style={{textAlign: 'center'}}>
  <Text fontSize="12px" color="#93acd3">
  Annual ROI rates may change over time depending on whether there is more or less staking activity from others.
  </Text>
        </InfoWrapper>

      <StyledActions>
        {pendingTx ? (
          <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
            {t('Confirming ..')}
          </Button>
        ) : (
          <Button
            width="100%"
            disabled={!lpTokensToStake.isFinite() || lpTokensToStake.eq(0) || lpTokensToStake.gt(fullBalanceNumber)}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val)
              onDismiss?.()
              setPendingTx(false)
            }}
          >
            {t('Confirm stake')}
          </Button>
        )}
      </StyledActions>
    </Modal>
  )
}

export default DepositModal
