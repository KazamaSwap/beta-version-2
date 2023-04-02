import styled from 'styled-components'
import { Card, CardBody, Heading, ArrowBackIcon, IconButton } from '@kazamaswap/uikit'
import { useRouter } from 'next/router'
import { useTranslation } from '@kazamaswap/localization'
import { PredictionSupportedSymbol } from 'state/types'
import { useConfig } from 'views/Predictions/context/ConfigProvider'

interface NotificationProps {
  title: string
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: center;
`

const CardWrapper = styled.div`
  width: 320px;
`

const SenshiDecoration = styled.div`
  position: relative;
  top: 12px;
  text-align: center;
  width: 100%;
  z-index: 5;
  cursor: pointer;
`

const BackButtonStyle = styled(IconButton)`
  position: relative;
  top: 120px;
  width: 40%;
`

const BackButton = () => {
  const { t } = useTranslation()

  return (
    <BackButtonStyle variant="primary" width="100%">
      <ArrowBackIcon color="white" mr="8px" />
      {t('Back')}
    </BackButtonStyle>
  )
}

const Notification: React.FC<React.PropsWithChildren<NotificationProps>> = ({ title, children }) => {
  const router = useRouter()
  const { token } = useConfig()

  return (
    <Wrapper>
      <CardWrapper>
        <BackButton />
        <SenshiDecoration
          onClick={() => {
            if (token.symbol === PredictionSupportedSymbol.KAZAMA) {
              router.query.token = PredictionSupportedSymbol.BNB
            } else if (token.symbol === PredictionSupportedSymbol.BNB) {
              router.query.token = PredictionSupportedSymbol.KAZAMA
            }

            router.push(router)
          }}
        >
          <img src="/images/decorations/hiccup-senshi.png" alt="senshi decoration" height="121px" width="130px" />
        </SenshiDecoration>
        <Card>
          <CardBody>
            <Heading mb="24px">{title}</Heading>
            {children}
          </CardBody>
        </Card>
      </CardWrapper>
    </Wrapper>
  )
}

export default Notification
