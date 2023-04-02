import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { useRouter } from 'next/router'
import Link from 'next/link'

const StyledNav = styled.nav`
  margin-top: 15px;
  margin-bottom: 15px;
`

const StyledItem = styled(ButtonMenuItem)`
text-transform: none;
`

const getActiveIndex = (pathname: string): number => {
  if (
    pathname.includes('/add') ||
    pathname.includes('/remove')     
  ) {
    return 1
  }
  return 0
}

const LiqNav = () => {
  const { pathname } = useRouter()
  const { t } = useTranslation()
  return (
    <StyledNav>
      <ButtonMenu activeIndex={getActiveIndex(pathname)} scale="sm" variant="subtle" fullWidth>
        <Link href="/add" passHref>
          <ButtonMenuItem id="swap-nav-link" as="a">
            {t('Add liquidity')}
          </ButtonMenuItem>
        </Link>
        <Link href="/remove" passHref>
          <ButtonMenuItem as="a">
            {t('Remove liquidity')}
          </ButtonMenuItem>
        </Link>
      </ButtonMenu>
    </StyledNav>
  )
}

export default LiqNav
