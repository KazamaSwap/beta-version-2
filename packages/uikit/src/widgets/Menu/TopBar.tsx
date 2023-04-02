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
import Panel from "./components/Panel";
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, SIDEBAR_WIDTH_FULL, SIDEBAR_RIGHT_WIDTH_FULL, SIDEBAR_WIDTH_REDUCED, SIDEBAR_RIGHT_WIDTH_REDUCED, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE, SIDEBARS_WIDTH_FULL } from "./config";
import { TopBarProps } from "./types";
import LangSelector from "../../components/LangSelector/LangSelector";
import KazamaDataRow from "../../../../../src/views/Home/components/KazamaDataRow"
import { MenuContext } from "./context";


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
  background-image: linear-gradient(#241f2e, #25202F);
  padding-left: 16px;
  padding-right: 16px;
  min-height: 70px;
`;

const FixedContainer = styled.div<{ isPushed: boolean; isPushedRight: boolean; showMenu: boolean; totalMenuHeight: number; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  right: 0;
  height: ${({ height }) => `${height}px`};
  z-index: 20;
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin-left: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
    margin-right: ${({ isPushedRight }) => `${isPushedRight ? SIDEBAR_RIGHT_WIDTH_FULL : SIDEBAR_RIGHT_WIDTH_REDUCED}px`};
    max-width: ${({ isPushed }) => `calc(100% - ${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px)`};
  }
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`;

const MenuWrapper = styled(Box)`
  background: #25202F;
`;

const ContentWrapper = styled.div`
width: 100%;

`;

const TopBar: React.FC<React.PropsWithChildren<TopBarProps>> = ({
  linkComponent = "a",
  banner,
  rightSide,
  kazamaPriceUsd,
  children,
}) => {
  const { isMobile, isMd } = useMatchBreakpoints();
  const isSmallerScreen = isMobile || isMd;
  const [isPushed, setIsPushed] = useState(!isSmallerScreen);
  const [isPushedRight, setIsPushedRight] = useState(!isSmallerScreen);
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

  // const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly);
  // const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly);

  return (
    <MenuContext.Provider value={{ linkComponent }}>
      <Wrapper>
        <FixedContainer isPushed={isPushed} isPushedRight={isPushedRight} totalMenuHeight={totalTopMenuHeight} showMenu={showMenu} height={totalTopMenuHeight}>
          <StyledNav>
          <Logo isPushed={isPushed} togglePush={() => setIsPushed((prevState: boolean) => !prevState)} isDark={false} href={""} />
            <Flex alignItems="center" height="100%">
               {/* {!isMobile && !isMd && (
                <Box mr="12px">
                  <KazamaPrice showSkeleton={false} kazamaPriceUsd={kazamaPriceUsd} />
                </Box>
              )}  */}
              {rightSide}
            </Flex>
          </StyledNav>
          {!isMobile && !isMd && (
        <MenuWrapper>
              {/* <KazamaDataRow />    */}
        </MenuWrapper>
              )} 
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
        {/* {isMobile && <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />} */}
      </Wrapper>
    </MenuContext.Provider>
  );
};

export default TopBar;
