import ChatComponent from 'components/ChatLayout';
import NavBarBurned from 'components/NavBarStats/KazamaBurned';
import NavBarBurnGame from 'components/NavBarStats/NavBarBurnGame';
import NavBarClaimGame from 'components/NavBarStats/NavBarClaimGame';
import NavBarRankPots from 'components/NavBarStats/NavBarRankPots';
import { NetworkSwitcher } from 'components/NetworkSwitcher';
import { NextLinkFromReactRouter } from 'components/NextLink';
import PhishingWarningBanner from 'components/PhishingWarningBanner';
import { useEverGrowBusdPrice, useKazamaBusdPrice } from 'hooks/useBUSDPrice';
import useTheme from 'hooks/useTheme';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { usePhishingBannerManager } from 'state/user/hooks';
import styled from 'styled-components';
import KazamaDataRow from 'views/Home/components/KazamaDataRow';
import TradingTokens from 'views/Home/components/TradingTokens';
import TopBarEarnings from 'views/Home/components/UserBanner/TopBarEarnings';

import { languageList, useTranslation } from '@kazamaswap/localization';
import { Box, Menu as UikitMenu, Text } from '@kazamaswap/uikit';

import { footerLinks } from './config/footerConfig';
import GlobalSettings from './GlobalSettings';
import { SettingsMode } from './GlobalSettings/types';
import { useMenuItems } from './hooks/useMenuItems';
import UserMenu from './UserMenu';
import UserRewards from './UserMenu/UserRewards';
import { getActiveMenuItem, getActiveSubMenuItem } from './utils';

const ItemWrapper = styled(Box)`
-webkit-align-items: center;
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
background-color: #1b2031;
cursor: pointer;
display: -webkit-inline-box;
display: -webkit-inline-flex;
display: -ms-inline-flexbox;
display: inline-flex;
height: 45px;
border-radius: 8px;
padding-left: 10px;
padding-right: 10px;
padding-top: 5px;
padding-bottom: 5px;
position: relative;
border-bottom: 1px solid rgba(0, 0, 0, 0.35);
margin-right: 15px;
width: 150px;
`

const PanelItemWrapper = styled(Box)`
-webkit-align-items: center;
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
background-color: #1b2031;
cursor: pointer;
display: -webkit-inline-box;
display: -webkit-inline-flex;
display: -ms-inline-flexbox;
display: inline-flex;
border-radius: 8px;
padding-left: 10px;
padding-right: 10px;
padding-top: 10px;
padding-bottom: 10px;
position: relative;
border-bottom: 1px solid rgba(0, 0, 0, 0.35);
width: 100%;
margin-left: 10px;
margin-right: 10px;
margin-bottom: 5px;
width: 215px;
`

const ItemWrapperEarnings = styled(Box)`
-webkit-align-items: center;
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
box-shadow: inset 0px -2px 0px rgb(0 0 0 / 10%);
cursor: pointer;
display: -webkit-inline-box;
display: -webkit-inline-flex;
display: -ms-inline-flexbox;
display: inline-flex;
height: 40px;
border-radius: 8px;
padding-left: 8px;
padding-right: 8px;
padding-top: 5px;
padding-bottom: 5px;
position: relative;
border-bottom: 1px solid #201c29;
margin-right: 15px;
`

const BoxSpacing = styled(Box)`
margin-right: 15px;
`

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const kazamaPriceUsd = useKazamaBusdPrice()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  const [showPhishingWarningBanner] = usePhishingBannerManager()
  
  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'light')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <>
      <UikitMenu
        linkComponent={(linkProps) => {
          return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
        }}
        rightSide={
          <>
                      {/* <ItemWrapperEarnings>
              <TopBarEarnings />
            </ItemWrapperEarnings> */}
               {/* <TopBarEarnings />  */}
               {/* <NetworkSwitcher />  */}
             {/* <UserRewards /> */}
             <UserMenu />
             {/* <SubgraphHealthIndicator subgraphName="kazamaswap/ks-market-chapel" /> */}
{/* 
             <NetworkSwitcher />
             <GlobalSettings mode={SettingsMode.GLOBAL} /> */}
             <GlobalSettings mode={SettingsMode.SWAP_LIQUIDITY} />
          </>
        }
        
        leftSide={
          <>
          {/* <TopBarTimer />  */}
          {/* <Box>
              <NavBarBurned />
            </Box> */}
          </>
        }
        
        banner={showPhishingWarningBanner && <PhishingWarningBanner />}
        chat={typeof window !== 'undefined' && <ChatComponent />}

        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        kazamaPriceUsd={kazamaPriceUsd}
        links={menuItems}
        subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        footerLinks={getFooterLinks}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        buyKazamaLabel={t('Buy KAZAMA')}
        {...props}
      />
    </>
    
  )
}

export default Menu
