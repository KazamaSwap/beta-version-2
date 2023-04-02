import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains';
import { perpLangMap } from 'utils/getPerpetualLanguageCode';
import { perpTheme } from 'utils/getPerpetualTheme';
import { nftsBaseUrl } from 'views/Nft/market/constants';

import { ContextApi } from '@kazamaswap/localization';
import {
    ChartIcon, DropdownMenuItemType, EarnFillIcon, EarnIcon, HomeIcon, MenuItemsType, MoreIcon,
    NftFillIcon, NftIcon, ProposalIcon, RocketIcon, SwapFillIcon, SwapIcon, TrophyFillIcon,
    TrophyGoldIcon, TrophyIcon
} from '@kazamaswap/uikit';
import { DropdownMenuItems } from '@kazamaswap/uikit/src/components/DropdownMenu/types';

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (t: ContextApi['t'], isDark: boolean, languageCode?: string, chainId?: number) => ConfigMenuItemsType[] =
  (t, isDark, languageCode, chainId) =>
    [
//      {
//        label: t('Home'),
//        icon: HomeIcon,
//        href: '/',
//        items: []
//      },

      {
        label: t('Exchange'),
        initialOpenState: true,
        icon: ChartIcon,
        showItemsOnMobile: false,
        items: [
          {
            label: t('Overview'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
              text: t('SOON').toLocaleUpperCase(),
              color: 'warning',
            },
          },
          {
            label: t('Swap Tokens'),
            icon: TrophyGoldIcon,
            href: '/swap',
            status: {
              text: t('BETA').toLocaleUpperCase(),
              icon: TrophyGoldIcon,
              color: 'primary',
            },
          },
          {
            label: t('Limit Orders'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
              text: t('SOON').toLocaleUpperCase(),
              color: 'warning',
            },
            image: '/images/decorations/3d-coin.png',
          },
//          {
//            label: t('Limit'),
//           href: '/limit-orders',
//            supportChainIds: SUPPORT_ONLY_BSC,
//            image: '/images/decorations/3d-coin.png',
//          },
//          {
//            label: t('Perpetual'),
//            href: `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/BTCUSDT?theme=${perpTheme(
//              isDark,
//            )}`,
//            type: DropdownMenuItemType.EXTERNAL_LINK,
//          },
//          {
//            label: t('Bridge'),
//            href: 'https://bridge.pancakeswap.finance/',
//            type: DropdownMenuItemType.EXTERNAL_LINK,
//          },
        ].map((item) => addMenuItemSupported(item, chainId)),
      },
      {
        label: t('Earn'),
        initialOpenState: true,
        icon: EarnIcon,
        fillIcon: EarnFillIcon,
        image: '/images/decorations/pe2.png',
        items: [
          {
            label: t('Yield Farms'),
            icon: TrophyGoldIcon,
            href: '/farms',
            status: {
              text: t('BETA').toLocaleUpperCase(),
              color: 'primary',
            },            
          },
          {
            label: t('Staking Pools'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
              text: t('SOON').toLocaleUpperCase(),
              color: 'warning',
            },
          },
          {
            label: t('Senshi Pools'),
            icon: TrophyGoldIcon,
            status: {
              text: t('SOON').toLocaleUpperCase(),
              color: 'warning',
            },
            href: '#',
            
            // supportChainIds: SUPPORT_ONLY_BSC,
          },
        ].map((item) => addMenuItemSupported(item, chainId)),
      },
      {
        label: t('Win'),
        initialOpenState: true,
        icon: TrophyIcon,
        fillIcon: TrophyIcon,
        // supportChainIds: SUPPORT_ONLY_BSC,
        items: [
          {
            label: t('Kazama Crash'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            },
          },
          {
            label: t('Kazama Lottery'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
              text: t('SOON').toLocaleUpperCase(),
              color: 'warning',
            },            
          },
          {
            label: t('Pump Heist'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            },
          },
          {
            label: t('Claim Game'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            },
          },
          {
            label: t('Burn Game'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            },
          },
          {
            label: t('Rank Pots'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            },
          },
        ],
      },
      {
        label: t('NFT Market'),
        initialOpenState: false,
        href: `${nftsBaseUrl}`,
        icon: NftIcon,
        fillIcon: NftFillIcon,
        supportChainIds: SUPPORT_ONLY_BSC,
        items: [
          {
            label: t('Marketplace'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
              text: t('SOON').toLocaleUpperCase(),
              color: 'warning',
            },            
          },
          {
            label: t('Collections'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
              text: t('SOON').toLocaleUpperCase(),
              color: 'warning',
            },            
          },
//          {
//            label: t('Activity'),
//            href: `${nftsBaseUrl}/activity`,
//            status: {
//            text: t('SOON').toLocaleUpperCase(),
//            color: 'warning',
//            },
//          },
        ],
      },
      {
        label: t('Launchpad'),
        initialOpenState: false,
        href: `${nftsBaseUrl}`,
        icon: RocketIcon,
        fillIcon: NftFillIcon,
        supportChainIds: SUPPORT_ONLY_BSC,
        items: [
          {
            label: t('Overview'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            
            },
          },
          {
            label: t('Create Presale'),
            icon: TrophyGoldIcon,
            href: '#',
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            
            },
          },
        ],
      },
      {
       label: t('Governance'),
        initialOpenState: false,
        href: `${nftsBaseUrl}`,
        icon: ProposalIcon,
        fillIcon: NftFillIcon,
        supportChainIds: SUPPORT_ONLY_BSC,
        items: [
          {
            label: t('Overview'),
            icon: TrophyGoldIcon,
            href: `#`,
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            
            },
          },
          {
            label: t('Create Proposal'),
            icon: TrophyGoldIcon,
            href: `#`,
            status: {
            text: t('SOON').toLocaleUpperCase(),
            color: 'warning',
            
            },
          },
        ],
      },

//      {
//        label: t('Governance'),
//        initialOpenState: true,
//        href: `${nftsBaseUrl}`,
//        icon: ProposalIcon,
//        fillIcon: NftFillIcon,
//        supportChainIds: SUPPORT_ONLY_BSC,
//        items: [
//          {
//            label: t('All Proposals'),
//            href: `/voting`,
//            status: {
//            text: t('SOON').toLocaleUpperCase(),
//            color: 'warning',
//            },
//          },
//          {
//            label: t('Create Proposal'),
//            href: `/voting/proposal/create`,
//            status: {
//            text: t('SOON').toLocaleUpperCase(),
//            color: 'warning',
//            },
//          },
//        ],
//      },
//      {
//        label: 'More',
//        href: '/info',
//        icon: MoreIcon,
//        hideSubNav: true,
//        items: [
//          {
//            label: t('Info'),
//            href: '/info',
//            supportChainIds: SUPPORT_ONLY_BSC,
//          },
//          {
//            label: t('IFO'),
//            href: '/ifo',
//            supportChainIds: SUPPORT_ONLY_BSC,
//            image: '/images/ifos/ifo-senshi.png',
//          },
//          {
//            label: t('Voting'),
//           href: '/voting',
//            supportChainIds: SUPPORT_ONLY_BSC,
//            image: '/images/voting/voting-senshi.png',
//          },
//         {
//            label: t('Leaderboard'),
//            href: '/teams',
//            supportChainIds: SUPPORT_ONLY_BSC,
//            image: '/images/decorations/leaderboard.png',
//          },
//          {
//            label: t('Blog'),
//            href: 'https://medium.com/pancakeswap',
//            type: DropdownMenuItemType.EXTERNAL_LINK,
//          },
//          {
//            label: t('Docs'),
//            href: 'https://docs.pancakeswap.finance',
//            type: DropdownMenuItemType.EXTERNAL_LINK,
//          },
//        ].map((item) => addMenuItemSupported(item, chainId)),
//      },
    ].map((item) => addMenuItemSupported(item, chainId))

export default config
