import { useState, useCallback } from 'react'
import {
  ModalContainer,
  ModalBody,
  Text,
  Button,
  Flex,
  InjectedModalProps,
  Checkbox,
  ModalHeader,
  CardFooter,
  ModalTitle,
  Heading,
  Box,
  KazamaLogoTextIcon,
  KazamaswapIcon,
  Card
} from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import styled from 'styled-components'

interface CheckType {
  key: string
  value?: boolean
  content: string
}

interface RiskDisclaimerProps extends InjectedModalProps {
  onSuccess: () => void
  checks: CheckType[]
  id: string
  subtitle?: string
}

export const KazamaTextSmall = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 30px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.65px; 
   font-weight: 400;
`

const StyledModal = styled(ModalContainer)`
  position: relative;
  overflow: visible;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

const GradientModalHeader = styled(ModalHeader)`
border-bottom: solid 2px #1B1A23;
  padding-bottom: 18px;
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const KazamaLogoBox = styled(Flex)`
width: 100%;
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 20px;
`

const KazamaTextField = styled(Text)`
display: flex;
text-align: center;
color: #fff;
`

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`
export const SmallerText = styled(Text)`
   font-size: 13px;
   padding-left: 4px;
   padding-right: 7px;
`

const SenshiTop = styled.div`
  position: absolute;
  top: -116px;
  left: 0px;
  text-align: center;
  width: 100%;
  -webkit-filter: drop-shadow(12px 12px 7px rgba(0,0,0,0.5));
`

const InfoWrapper = styled.div`
padding: 0.75rem;
border-radius: 14px;
border: 1px solid #1b2031;
margin-top: 10px;
`

// TODO: Copy from src/views/Predictions/components/RiskDisclaimer.tsx
// Will replace that with this modal.

const DisclaimerModal: React.FC<React.PropsWithChildren<RiskDisclaimerProps>> = ({
  id,
  onSuccess,
  onDismiss,
  checks,
}) => {
  const [checkState, setCheckState] = useState(checks || [])
  const { t } = useTranslation()

  const handleSetAcknowledgeRisk = useCallback(
    (currentKey) => {
      const newCheckState = checkState.map((check) => {
        if (currentKey === check.key) {
          return { ...check, value: !check.value }
        }

        return check
      })

      setCheckState(newCheckState)
    },
    [checkState],
  )

  const handleConfirm = useCallback(() => {
    onSuccess()
    onDismiss()
  }, [onSuccess, onDismiss])

  return (
    <StyledModal title={t('KazamaSwap BETA')} $minWidth="320px" id={id}>
        {/* <SenshiTop>
        <img src="/images/Senshi-PopUp.png" alt="Senshi" height="124px" width="168px" />
      </SenshiTop> */}
      <ModalBody p="24px" maxWidth={['100%', '100%', '100%', '425px']}>
          <KazamaTextField>
          We are currently in the final testing phase so before you proceed to the platform, we want to make sure that you are aware of some .
          </KazamaTextField>
          <InfoWrapper>
        <Box maxHeight="300px" overflowY="auto" pr="5px">
        <Text fontSize="12px" color="#93acd3" textAlign="center">
        Charts and history tables are disabled in the testnet because the subgraphs are very unstable on chapel (testnet).
      </Text>
        </Box>
        </InfoWrapper>
        <InfoWrapper>
        <Box maxHeight="300px" overflowY="auto" pr="5px">
        <Text fontSize="12px" color="#93acd3" textAlign="center">
        Users public profile pages are disabled on the testnet, including creating a rain and tipping users in chat.
      </Text>
        </Box>
        </InfoWrapper>
        <InfoWrapper>
        <Box maxHeight="300px" overflowY="auto" pr="5px">
        <Text fontSize="12px" color="#93acd3" textAlign="center">
        The testnet is purely intended to see the operation of components and properties of the KAZAMA token in action.
      </Text>
        </Box>
        </InfoWrapper>
        <InfoWrapper>
        <Box maxHeight="300px" overflowY="auto" pr="5px">
        <Text fontSize="12px" color="#93acd3" textAlign="center">
        Over time we activate more components on the test network such as yield farms and staking pools. All other components will be added after launch.
      </Text>
        </Box>
        </InfoWrapper>
        <InfoWrapper>
        {checkState.map((check) => (
            <label
              key={check.key}
              htmlFor={check.key}
              style={{ display: 'block', cursor: 'pointer'}}
            >
              <Flex alignItems="center">
                <div style={{ flex: 'none', alignSelf: 'flex-start' }}>
                  <Checkbox
                    id={check.key}
                    scale="sm"
                    checked={check.value}
                    onChange={() => handleSetAcknowledgeRisk(check.key)}
                  />
                </div>
                <SmallerText ml="8px">{check.content}</SmallerText>
              </Flex>
            </label>
          ))}
          </InfoWrapper>
          <Button
          id={`${id}-continue`}
          width="100%"
          onClick={handleConfirm}
          disabled={checkState.some((check) => !check.value)}
          marginTop="10px"
        >
          {t('Proceed to platform')}
        </Button>
      </ModalBody>
    </StyledModal>
  )
}

export default DisclaimerModal
