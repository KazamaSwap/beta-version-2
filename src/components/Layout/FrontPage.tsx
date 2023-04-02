import styled from 'styled-components'
import { useTranslation } from '@kazamaswap/localization'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import { useKazamaBusdPrice } from 'hooks/useBUSDPrice'
import Container from './Container'

const StyledPage = styled(Container)`

  padding-top: 16px;
  padding-bottom: 16px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

export const PageMeta: React.FC<React.PropsWithChildren<{ symbol?: string }>> = ({ symbol }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { pathname } = useRouter()
  const kazamaPriceUsd = useKazamaBusdPrice()
  const kazamaPriceUsdDisplay = kazamaPriceUsd ? `$${kazamaPriceUsd.toFixed(3)}` : '...'

  const pageMeta = getCustomMeta(pathname, t, locale) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  let pageTitle = kazamaPriceUsdDisplay ? [title, kazamaPriceUsdDisplay].join(' - ') : title
  if (symbol) {
    pageTitle = [symbol, title].join(' - ')
  }

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string
}

const FrontPage: React.FC<React.PropsWithChildren<PageProps>> = ({ children, symbol, ...props }) => {
  return (
    <>
      <PageMeta symbol={symbol} />
      <StyledPage {...props}>
        {children}
      </StyledPage>
    </>
  )
}

export default FrontPage
