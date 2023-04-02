import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem } from '@kazamaswap/uikit'
import { useTranslation } from '@kazamaswap/localization'
import { useRouter } from 'next/router'
import Link from 'next/link'

const StyledNav = styled.nav`
  margin-bottom: 0px;
`

const StyledItem = styled(ButtonMenuItem)`
text-transform: none;
`

const getActiveIndex = (pathname: string): number => {
  if (
    pathname.includes('/add')
  ) {
    return 1
  }
  return 0
}

const Nav = () => {
  const { pathname } = useRouter()
  const { t } = useTranslation()
  return (
    <StyledNav>
      <ButtonMenu activeIndex={getActiveIndex(pathname)} scale="sm" variant="subtle">
        <Link href="/swap" passHref>
          <ButtonMenuItem id="swap-nav-link" as="a">
            {t('Swap')}
          </ButtonMenuItem>
        </Link>
        {/* <Link href="#" passHref>
          <ButtonMenuItem id="limit-nav-link" as="a">
            {t('Limit')}
          </ButtonMenuItem>
        </Link> */}
        <Link href="/add" passHref>
          <ButtonMenuItem id="add-liquidity-input-tokena" as="a">
            {t('Liquidity')}
          </ButtonMenuItem>
        </Link>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
