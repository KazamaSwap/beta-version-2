import { ReactNode } from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text } from '@kazamaswap/uikit'
import Balance from 'components/Balance'
import { useTranslation } from '@kazamaswap/localization'
import { FlexGap } from 'components/Layout/Flex'

interface TopFarmsStyleProps {
  title: ReactNode
  percentage: number
  index: number
  visible: boolean
  isApy?: boolean
}

const StyledWrapper = styled(Flex)<{ index: number }>`
  position: relative;
`

const AbsoluteWrapper = styled(Flex)<{ visible: boolean; index: number; topOffset: string }>`
  position: absolute;
  flex-direction: row;
  padding: 10px 10px 10px 10px;
  background: #292734;
  min-width: 200px;
  min-height: 90px;

  ${({ index, theme }) =>
    index > 0
      ? `
         ${theme.mediaQueries.sm} {
           height: 80px;
           top: 0;
           padding-left: 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
           border-right: 1px ${theme.colors.inputSecondary} solid;
           border-top: 1px ${theme.colors.inputSecondary} solid;
           border-bottom: 1px ${theme.colors.inputSecondary} solid;
           border-radius: 10px;
         }
       `
      : `padding-right: 16px;`}
`

const TopFarmsStyle: React.FC<React.PropsWithChildren<TopFarmsStyleProps>> = ({
  title,
  percentage,
  index,
  visible,
  isApy,
}) => {
  const { t } = useTranslation()

  const topOffset = () => {
    if (index >= 0 && index < 2) {
      return '0px'
    }

    if (index >= 2 && index < 3) {
      return '80px'
    }

    return '160px'
  }

  return (
    <StyledWrapper index={index}>
      <AbsoluteWrapper index={index} visible={visible} topOffset={topOffset()}>
        {title ? (
          <Text bold mb="8px" fontSize="12px" color="secondary">
            {title}
          </Text>
        ) : (
          <Skeleton width={80} height={12} mb="8px" />
        )}
        {percentage ? (
          <FlexGap gap="4px">
            {isApy && t('Up to')}
            <Balance lineHeight="1.1" fontSize="16px" bold unit="%" value={percentage} />
          </FlexGap>
        ) : (
          <Skeleton width={60} height={16} />
        )}
        {percentage ? (
          <Text fontSize="16px" color="textSubtle">
            {isApy ? t('APY') : t('APR')}
          </Text>
        ) : (
          <Skeleton width={30} height={16} mt="4px" />
        )}
      </AbsoluteWrapper>
    </StyledWrapper>
  )
}

export default TopFarmsStyle
