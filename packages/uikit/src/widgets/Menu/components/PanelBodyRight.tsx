import React, { createElement, memo } from "react";
import styled from "styled-components";
import { Box } from "../../../components/Box";
// import { useLocation } from "react-router-dom";
import { HamburgerCloseIcon ,ChatCloudIcon, RainIcon, SvgProps } from "../../../components/Svg";
// import * as IconModule from "../icons";
import Accordion from "./Accordion";
import { MenuEntry, LinkLabel, LinkStatus } from "./MenuEntry";
import MenuLink from "./MenuLink";
import { PanelPropsRight, PushedPropsRight } from "../types";
import MenuItem from "../../../components/MenuItem";
import ChatCloud from "./ChatCloud";
import { Text } from "../../../components/Text"
import { Flex } from "../../../components/Box"
import { Tag } from "../../../components/Tag"
import StyledTag from "../../../components/Tag/StyledTag";

interface Props extends PanelPropsRight, PushedPropsRight {
  isMobile: boolean;
}

// const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  padding-bottom: 10px;
`;

const MenuButton = styled.div`
  color: ${({ theme }) => theme.colors.text};
  padding: 0 8px;
  border-radius: 8px;
  background: none;
  cursor: pointer;
  height: 40px;
  display: flex;
  border: none;
  margin-right: 10px;
  margin-left: 10px;
`;

const IconButton = styled.div`
  color: ${({ theme }) => theme.colors.text};
  padding: 0 8px;
  border-radius: 8px;
  background: none;
  cursor: not-allowed;
  height: 40px;
  display: flex;
  border: none;
  margin-right: 20px;
  margin-left: 10px;
`;

const Hamburger = styled(HamburgerCloseIcon)`
  transform: rotate(180deg);
  fill: #93acd3;
  :hover {
    fill: rgba(255, 255, 255, 0.884) !important;
  }
`;

const HamburgerWrapper = styled.div`
display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    white-space: nowrap;
    -webkit-transition: all 0.1s ease 0s;
    transition: all 0.1s ease 0s;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border-radius: 6px;
    font-size: 13px;
    padding: 0px;
    position: relative;
    flex: 1;
`;

const ChatWrapper = styled(Box)`
    margin-bottom: 8px;
    background: #343142;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 12px;
    padding-bottom: 12px;
`;

const UsernameWrapper = styled.div`
  margin-right: 5px;
`;

const TopItemsWrapper = styled.div`
display: inline-flex;
`;

const Left = styled.div`
left: 0;
`;

const Right = styled.div`
margin-left: auto;
`;

const RainWrapper = styled.div`
margin-right: 10px;
background: #1C2532;
padding: 5px;
border-radius: 7px;
flex: 2;
`;

const StyledRainIcon = styled(RainIcon)`
fill: #93acd3;
:hover {
  fill: rgba(255, 255, 255, 0.884) !important;
}
padding-bottom: 4px;
`

const ChatText = styled(Text)`
   word-wrap: break-word;
   white-space:pre-wrap;
`;



const PanelBodyRight: React.FC<Props> = ({ isPushedRight, pushNav, isMobile, links, activeItem, activeSubItem }) => {

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined;
  const handleClickNav = () => pushNav(!isPushedRight);
  return (
    <><Container>
      <TopItemsWrapper>
      <Left>
      <HamburgerWrapper onClick={handleClickNav}>
        <MenuButton aria-label="Toggle menu" onClick={handleClickNav}>
          {isPushedRight ? (
            <Hamburger width="24px" color="textSubtle" />
          ) : (
            <ChatCloudIcon width="24px" color="textSubtle" />
          )}
        </MenuButton>
      </HamburgerWrapper>
      </Left>
        <Right>
        <HamburgerWrapper>
        <IconButton>
      <StyledRainIcon width={18}/>
      </IconButton>
      </HamburgerWrapper>
      </Right>
      </TopItemsWrapper>
    </Container>
    </>
  );
};

export default PanelBodyRight;
