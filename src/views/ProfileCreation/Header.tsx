import { useContext } from 'react'
import styled from 'styled-components'
import { Breadcrumbs, Heading, Text, Link, Button, Flex, Card } from '@kazamaswap/uikit'
import { useTranslation, TranslateFunction } from '@kazamaswap/localization'
import SunburstSvg from 'components/Sunburst/SunburstSvg'
import PageSection from 'components/PageSection'
import ProfileWrapper, { PageMeta } from 'components/Layout/Page'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Wrapper = styled.div`
  margin-top: 32px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  padding-left: 24px;
`

const BgWrapper = styled.div`
background: url(https://ibb.co/C0c2yYN) no-repeat center center fixed; 
-webkit-background-size: cover;
-moz-background-size: cover;
-o-background-size: cover;
background-size: cover;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

export const KazamaTextSmall = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 30px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.65px; 
   font-weight: 400;
`

export const KazamaTextBig = styled(Text)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 64px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 2.00px; 
   font-weight: 400;
`

const StyledSunburst = styled(SunburstSvg)`
  height: 350%;
  width: 350%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 600%;
    width: 600%;
  }
`

export const KazamaTextButton = styled(Button)`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

const TopWrapper = styled(Flex)`
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 150px;
`

const ControlContainer = styled(Card)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  overflow: visible;
  transform: translateY(-187px);
  background: #1B1A23;
  margin-bottom: 15px;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: flex-start;
    transform: translateY(-150px);
  }
`

const steps = (t: TranslateFunction) => [
  t('Set Profile Picture'),
  t('Set Name'),
]

const Header: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { currentStep } = useContext(ProfileCreationContext)
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <><PageMeta />
    {/* <PageSection
      innerProps={{ style: HomeSectionContainerStyles }}
      background="linear-gradient(180deg,#EE1A78 0%,#2e2b3a 100%)"
      index={2}
      hasCurvedDivider={false}
      mt="64px"
    >
      <BgWrapper>
        <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
          <StyledSunburst />
        </Flex>
      </BgWrapper>
       <TopWrapper>
        <Heading mb="50px" scale="xl" color="white">
          <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
            <KazamaTextBig>
              Profile Setup
            </KazamaTextBig>
          </Flex>
          <Flex alignItems="center" mb="15px" justifyContent="center" width="100%" height="100%">
            <KazamaTextSmall>
              Cost: 1.5 KAZAMA
            </KazamaTextSmall>
          </Flex>
          <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
            <KazamaTextSmall>
            <Link href="/profile">
          <KazamaTextButton scale="md" variant="primary">
            {t('Click to Cancel Setup')}
          </KazamaTextButton>
        </Link>
            </KazamaTextSmall>
          </Flex>
        </Heading>
      </TopWrapper> 
    </PageSection> */}
    <Wrapper>
        <Breadcrumbs>
          {steps(t).map((translationKey, index) => {
            return (
              <Text key={t(translationKey)} color={index <= currentStep ? 'text' : 'textDisabled'}>
                {translationKey}
              </Text>
            )
          })}
        </Breadcrumbs>
      </Wrapper>
      </>
  )
}

export default Header
