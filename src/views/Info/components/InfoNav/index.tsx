import { Box, ButtonMenu, ButtonMenuItem, Flex } from '@kazamaswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@kazamaswap/localization'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Search from 'views/Info/components/InfoSearch'
import { NetworkSwitcher } from 'components/NetworkSwitcher'

const NavWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
  justify-content: space-between;
  padding: 20px 16px;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 40px;
    flex-direction: row;
  }
`

const InfoNav = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const isPools = router.pathname === '/info/pools'
  const isTokens = router.pathname === '/info/tokens'
  let activeIndex = 0
  if (isPools) {
    activeIndex = 1
  }
  if (isTokens) {
    activeIndex = 2
  }
  return (
      <><Box>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem as={NextLinkFromReactRouter} to="/info">
          {t('Overview')}
        </ButtonMenuItem>
        <ButtonMenuItem as={NextLinkFromReactRouter} to="/info/pools">
          {t('Pools')}
        </ButtonMenuItem>
        <ButtonMenuItem as={NextLinkFromReactRouter} to="/info/tokens">
          {t('Tokens')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Box><Box width={['100%', '100%', '250px']}>
       Search <Search />
       <NetworkSwitcher />
      </Box></>

  )
}

export default InfoNav
