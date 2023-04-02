import { FooterLinkType, TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon } from '@kazamaswap/uikit'
import { ContextApi } from '@kazamaswap/localization'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('Kazama Community'),
    items: [
      {
        label: '—',
      },
      {
        icon: 'DiscordIcon',
        label: t('Discord Server'),
        href: 'http://discord.gg/s49n7XBkXz',
      },
      {
        label: t('Reddit Community'),
        href: 'https://www.reddit.com/r/KazamaSwap/',
      },
      {
        label: t('Telegram Channel'),
        href: 'https://t.me/KazamaSwap',
      },
      {
        label: t('Twitter'),
        href: 'https://twitter.com/KazamaSwap',
      },
    ],
  },
  {
    label: t('Learn More'),
    items: [
      {
        label: '—',
      },
      {
        label: t('About KazamaSwap'),
        href: '#',
      },
      {
        label: t('About Kazama Token'),
        href: '#',
      },
      {
        label: t('Documentation'),
        href: '#',
      },
    ],
  },
  {
    label: t('Resources'),
    items: [
      {
        label: '—',
      },
      {
        label: t('Kazama Store'),
        href: '#',
      },
      {
        label: t('CoinMarketCap'),
        href: '#',
      },
      {
        label: t('CoinGecko'),
        href: '#',
      },
      {
        label: t('GitHub'),
        href: '#',
      },
    ],
  },
]
