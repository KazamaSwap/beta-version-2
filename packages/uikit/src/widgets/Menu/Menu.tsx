import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import BottomNav from "../../components/BottomNav";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import Footer from "../../components/Footer";
import MenuItems from "../../components/MenuItems/MenuItems";
import { SubMenuItems } from "../../components/SubMenuItems";
import { useMatchBreakpoints } from "../../contexts";
import KazamaPrice from "../../components/KazamaPrice/KazamaPrice";
import Logo from "./components/Logo";
import ChatCloud from "./components/ChatCloud";
import Panel from "./components/Panel";
import PanelRight from "./components/PanelRight";
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, SIDEBAR_WIDTH_FULL, SIDEBAR_RIGHT_WIDTH_FULL, SIDEBAR_WIDTH_REDUCED, SIDEBAR_RIGHT_WIDTH_REDUCED, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE, SIDEBARS_WIDTH_FULL } from "./config";
import { NavProps } from "./types";
import LangSelector from "../../components/LangSelector/LangSelector";
import { MenuContext } from "./context";
import TopBar from "./TopBar";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  background-image: linear-gradient(#11141e, #141824);
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);
  transform: translate3d(0, 0, 0);
  padding-left: 16px;
  padding-right: 16px;
  min-height: 70px;
`;

const LogoWrapper = styled.nav`
background-color: #202a39;
border-radius: 10px;
-webkit-clip-path: polygon(25% 0%,100% 0%,75% 100%,0% 100%);
clip-path: polygon(25% 0%,100% 0%,75% 100%,0% 100%);
padding: 42px 23px 16px 150px;
margin: -44px 0 -15px -152px;
overflow: hidden;
width: 500px;
`;

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  width: 100%;
  z-index: 20;
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
`;


const Inner = styled.div<{ isPushed: boolean; isPushedRight: boolean; showMenu: boolean; totalMenuHeight: number }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin-left: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
    margin-right: ${({ isPushedRight }) => `${isPushedRight ? SIDEBAR_RIGHT_WIDTH_FULL : SIDEBAR_RIGHT_WIDTH_REDUCED}px`};
    max-width: ${({ isPushed }) => `calc(100% - ${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px)`};
    max-width: ${({ isPushedRight }) => `calc(100% - ${isPushedRight ? SIDEBAR_RIGHT_WIDTH_FULL : SIDEBAR_RIGHT_WIDTH_REDUCED}px)`};
  }
`;

const ItemWrapperNav = styled.div`
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #0D131C;
    box-shadow: inset 0px -2px 0px rgb(0 0 0 / 10%);
    cursor: pointer;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    height: 50px;
    border-radius: 7px;
    min-width: 155px;
    padding-left: 8px;
    padding-right: 8px;
    position: relative;
    border-bottom: 1px solid #201c29;
`;

const Menu: React.FC<React.PropsWithChildren<NavProps>> = ({
  linkComponent = "a",
  banner,
  chat,
  top,
  rightSide,
  leftSide,
  inMiddle,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  kazamaPriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyKazamaLabel,
  children,
}) => {
  const { isMobile, isMd } = useMatchBreakpoints();
  const isSmallerScreen = isMobile || isMd;
  const [isPushed, setIsPushed] = useState(!isSmallerScreen);
  const [isPushedRight, setIsPushedRight] = useState(!isSmallerScreen);
  const [showChat, setShowChat] = useState(!isSmallerScreen);
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;

  const totalTopMenuHeight = banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(true);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  // const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly);
  // const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly);

  return (
    <MenuContext.Provider value={{ linkComponent }}>
      <Wrapper>
         <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>

          <StyledNav>
            <Flex>
            <Logo isPushed={isPushed} togglePush={() => setIsPushed((prevState: boolean) => !prevState)} isDark={isDark} href={homeLink?.href ?? "/"} />
            <Box ml="25px" width="100%">
            {leftSide}
            </Box>
            </Flex>
            {inMiddle}
            <Flex alignItems="center" height="100%">
               {/* {!isMobile && !isMd && (
                <Box mr="12px">
                  <KazamaPrice showSkeleton={false} kazamaPriceUsd={kazamaPriceUsd} />
                </Box>
              )}   */}
              {isMobile && (
                <Box>
              <ChatCloud
                            isPushedRight={isPushedRight}
                            isMobile={isSmallerScreen}
                            isDark={isDark}
                            toggleTheme={toggleTheme}
                            langs={langs}
                            setLang={setLang}
                            currentLang={currentLang}
                            kazamaPriceUsd={kazamaPriceUsd}
                            pushNav={setIsPushedRight}
                            links={links}
                            activeItem={activeItem}
                            activeSubItem={activeSubItem}
                             />
                </Box>
              )}
               
                {/* <Box mt="4px">
                <LangSelector
                  currentLang={currentLang}
                  langs={langs}
                  setLang={setLang}
                  buttonScale="xs"
                  color="textSubtle"
                  hideLanguage
                />
              </Box>   */}
              {rightSide}
            </Flex>
           
          </StyledNav>
        </FixedContainer> 
        {/* {subLinks && (
          <Flex justifyContent="space-around">
            <SubMenuItems items={subLinksWithoutMobile} mt={`${totalTopMenuHeight + 1}px`} activeItem={activeSubItem} />

            {subLinksMobileOnly?.length > 0 && (
              <SubMenuItems
                items={subLinksMobileOnly}
                mt={`${totalTopMenuHeight + 1}px`}
                activeItem={activeSubItem}
                isMobileOnly
              />
            )}
          </Flex>
        )} */}
        <BodyWrapper>
          <Panel
            isPushed={isPushed}
            isMobile={isSmallerScreen}
            showMenu={showMenu}
            totalMenuHeight={totalTopMenuHeight}
            isDark={isDark}
            toggleTheme={toggleTheme}
            langs={langs}
            setLang={setLang}
            currentLang={currentLang}
            kazamaPriceUsd={kazamaPriceUsd}
            pushNav={setIsPushed}
            links={links}
            activeItem={activeItem}
            activeSubItem={activeSubItem}
            topContent={top}
          />
             <PanelRight
            chatLayout={chat}
            showChat={showChat}
            isPushedRight={isPushedRight}
            isMobile={isSmallerScreen}
            showMenu={showMenu}
            totalMenuHeight={totalTopMenuHeight}
            isDark={isDark}
            toggleTheme={toggleTheme}
            langs={langs}
            setLang={setLang}
            currentLang={currentLang}
            kazamaPriceUsd={kazamaPriceUsd}
            pushNav={setIsPushedRight}
            links={links}
            activeItem={activeItem}
            activeSubItem={activeSubItem}
          /> 
          <Inner isPushed={isPushed} isPushedRight={isPushedRight} showMenu={showMenu} totalMenuHeight={totalTopMenuHeight}>
            {children}
            <Footer
              items={footerLinks}
              isDark={isDark}
              toggleTheme={toggleTheme}
              langs={langs}
              setLang={setLang}
              currentLang={currentLang}
              kazamaPriceUsd={kazamaPriceUsd}
              buyKazamaLabel={buyKazamaLabel}
              mb={[`${MOBILE_MENU_HEIGHT}px`, null, "0px"]}
            />
          </Inner>
        </BodyWrapper>
        {/* {isMobile && <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />} */}
      </Wrapper>
    </MenuContext.Provider>
  );
};

export default Menu;
