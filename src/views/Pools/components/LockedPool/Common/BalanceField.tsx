import { BalanceInput, Button, Flex, Image, Slider, Text } from '@kazamaswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@kazamaswap/localization'
import { Dispatch, useMemo, memo, SetStateAction, useCallback } from 'react'
import styled from 'styled-components'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'
import { useUserEnoughKazamaValidator } from '../hooks/useUserEnoughKazamaValidator'

const StyledButton = styled(Button)`
  flex-grow: 1;
`

interface PropsType {
  stakingAddress: string
  stakingSymbol: string
  stakingDecimals: number
  lockedAmount: string
  stakingMax: BigNumber
  setLockedAmount: Dispatch<SetStateAction<string>>
  usedValueStaked: number | undefined
  stakingTokenBalance: BigNumber
}

const BalanceField: React.FC<React.PropsWithChildren<PropsType>> = ({
  stakingAddress,
  stakingSymbol,
  stakingDecimals,
  lockedAmount,
  stakingMax,
  setLockedAmount,
  usedValueStaked,
  stakingTokenBalance,
}) => {
  const { t } = useTranslation()
  const { userNotEnoughKazama, notEnoughErrorMessage } = useUserEnoughKazamaValidator(lockedAmount, stakingTokenBalance)

  const percent = useMemo(() => {
    const amount = new BigNumber(lockedAmount)
    if (amount.gt(0)) {
      const convertedInput = amount.multipliedBy(getFullDecimalMultiplier(stakingDecimals))
      const percentage = Math.floor(convertedInput.dividedBy(stakingMax).multipliedBy(100).toNumber())
      return percentage > 100 ? 100 : percentage
    }
    return 0
  }, [lockedAmount, stakingDecimals, stakingMax])

  const handleStakeInputChange = useCallback(
    (input: string) => {
      setLockedAmount(input)
    },
    [setLockedAmount],
  )

  const handleChangePercent = useCallback(
    (sliderPercent: number) => {
      if (sliderPercent > 0) {
        const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent)
        const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingDecimals, stakingDecimals)

        setLockedAmount(amountToStake)
      } else {
        setLockedAmount('')
      }
    },
    [stakingMax, setLockedAmount, stakingDecimals],
  )

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('KAZAMA to lock')}
        </Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingAddress}.png`} width={24} height={24} alt={stakingSymbol} />
          <Text ml="4px" bold>
            {stakingSymbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        isWarning={userNotEnoughKazama}
        value={lockedAmount}
        color="success"
        onUserInput={handleStakeInputChange}
        currencyValue={`~ $${usedValueStaked || 0}`}
        decimals={stakingDecimals}
      />
      <Flex alignItems="center" justifyContent="flex-end" mt="4px" mb="12px">
        <Flex justifyContent="flex-end" flexDirection="column">
          {userNotEnoughKazama && (
            <Text fontSize="12px" color="failure">
              {notEnoughErrorMessage}
            </Text>
          )}
        </Flex>
      </Flex>
      <Text mt="8px" textAlign="end" color="textSubtle" fontSize="14px" mb="8px">
        {t('Balance: %balance%', { balance: getFullDisplayBalance(stakingMax, stakingDecimals) })}
      </Text>
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(25)}>
          25%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(50)}>
          50%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(75)}>
          75%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => handleChangePercent(99)}>
          {t('Max')}
        </StyledButton>
      </Flex>
    </>
  )
}

export default memo(BalanceField)
