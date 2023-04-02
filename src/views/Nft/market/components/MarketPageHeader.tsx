import PageHeader, { PageHeaderProps } from 'components/PageHeader'
import useTheme from 'hooks/useTheme'

const MarketPageHeader: React.FC<React.PropsWithChildren<PageHeaderProps>> = (props) => {
  const { theme } = useTheme()
  const background = theme.isDark
    ? 'linear-gradient(#201c29,#25202F)'
    : 'linear-gradient(#201c29,#25202F)'
  return <PageHeader background={background} {...props} />
}

export default MarketPageHeader
