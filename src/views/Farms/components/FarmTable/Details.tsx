import styled from 'styled-components'
import { ChevronDownIcon, useMatchBreakpoints } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'

interface DetailsProps {
  actionPanelToggled: boolean
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 8px;
  color: ${({ theme }) => theme.colors.primary};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 0px;
  }
`

const Wrapper = styled.div`
display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    white-space: nowrap;
    -webkit-transition: all 0.1s ease 0s;
    transition: all 0.1s ease 0s;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    -webkit-letter-spacing: 0.5px;
    -moz-letter-spacing: 0.5px;
    -ms-letter-spacing: 0.5px;
    letter-spacing: 0.5px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border-radius: 6px;
    font-family: "Geogrotesque Wide",sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 13px;
    text-transform: uppercase;
    background: #1b2031;
    height: 28px;
    width: 30px;
    padding: 0px;
    position: relative;
    left: 6px;
    margin-left: auto;
`

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 20px;
  fill: #93acd3 !important;
`

const Details: React.FC<React.PropsWithChildren<DetailsProps>> = ({ actionPanelToggled }) => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Container>
      <Wrapper>
      {!isDesktop && t('Details')}
      <ArrowIcon toggled={actionPanelToggled} />
      </Wrapper>
    </Container>
  )
}

export default Details
