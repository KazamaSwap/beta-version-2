import Balance from 'components/Balance';
import styled from 'styled-components';

import { useTranslation } from '@kazamaswap/localization';
import { HelpIcon, Skeleton, Text, useTooltip } from '@kazamaswap/uikit';

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Multiplier: React.FunctionComponent<React.PropsWithChildren<MultiplierProps>> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : 
  <Balance
  fontSize="16px"
  color="textSubtle"
  decimals={0}
  value={0}
  unit="x"
/>
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Text>
        {t(
          'The Multiplier represents the proportion of KAZAMA rewards each farm receives, as a proportion of the KAZAMA produced each block.',
        )}
      </Text>
      <Text my="24px">
        {t('For example, if a 1x farm received 1 KAZAMA per block, a 40x farm would receive 40 KAZAMA per block.')}
      </Text>
      <Text>{t('This amount is already included in all APR calculations for the farm.')}</Text>
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      <MultiplierWrapper>
        <Text fontSize="16px" style={{color: "#fff"}}>
        {displayMultiplier}
        </Text>
        </MultiplierWrapper>
      {/* <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip} */}
    </Container>
  )
}

export default Multiplier
