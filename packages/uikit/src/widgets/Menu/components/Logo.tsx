import React, { useContext } from "react";
import { isMobile } from "react-device-detect";
import styled, { keyframes } from "styled-components";
import Flex from "../../../components/Box/Flex";
import {  HamburgerIcon, HamburgerCloseIcon, LogoIcon, KazamaswapIcon, KazamaIcon, KazamaLogoTextIcon } from "../../../components/Svg";
import { MenuContext } from "../context";
import MenuButton from "./MenuButton";

interface Props {
  isPushed: boolean;
  isDark: boolean;
  href: string;
  togglePush: () => void;
}

const blink = keyframes`
  0%,  100% { transform: scaleY(1); }
  50% { transform:  scaleY(0.1); }
`;

const StyledLink = styled("a")`
  display: flex;
  align-items: center;
  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 210px;
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }
  }
`;

const Logo: React.FC<React.PropsWithChildren<Props>> = ({ isPushed, togglePush, isDark, href }) => {
  const { linkComponent } = useContext(MenuContext);
  const isAbsoluteUrl = href.startsWith("http");
  const innerLogo = (
    <>
    {isMobile ? 
    <LogoIcon className="mobile-icon" aria-label="Toggle menu" onClick={togglePush} />
    :
    <KazamaLogoTextIcon ml="10px" width="175px" />
  }
    </>
  );

  return (
    <Flex>
        {/* <MenuButton aria-label="Toggle menu" onClick={togglePush} mr="5px">
        {isPushed ? (
          <HamburgerCloseIcon width="24px" color="textSubtle" />
        ) : (
          <HamburgerIcon width="24px" color="textSubtle" />
        )}
      </MenuButton> */}
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href} aria-label="KazamaSwap">
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink href={href} as={linkComponent} aria-label="KazamaSwap">
          {innerLogo}
        </StyledLink>
      )}
    </Flex>
  );
};

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark);
