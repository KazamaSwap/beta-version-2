import React, { createElement, memo } from "react";
import styled from "styled-components";
// import { useLocation } from "react-router-dom";
import { ChatCloudIcon, SvgProps } from "../../../components/Svg";
// import * as IconModule from "../icons";
import Accordion from "./Accordion";
import { MenuEntry, LinkLabel, LinkStatus } from "./MenuEntry";
import MenuLink from "./MenuLink";
import { PanelPropsRight, PushedPropsRight } from "../types";
import MenuItem from "../../../components/MenuItem";

interface Props extends PanelPropsRight, PushedPropsRight {
  isMobile: boolean;
}

// const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
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
    justify-content: left;
    white-space: nowrap;
    -webkit-transition: all 0.1s ease 0s;
    transition: all 0.1s ease 0s;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    -webkit-letter-spacing: 0.5px;
    -moz-letter-spacing: 0.5px;
    -ms-letter-spacing: 0.5px;
    letter-spacing: 0.5px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border-radius: 6px;
    font-family: "Geogrotesque Wide",sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 13px;
    text-transform: uppercase;
    background: #292435;

    width: 100%;
    padding: 0px;
    position: relative;
    left: 6px;
    margin-left: auto;
`;

const ChatCloud: React.FC<Props> = ({ isPushedRight, pushNav, isMobile }) => {

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined;
  const handleClickNav = () => pushNav(!isPushedRight);
  return (
    <Container>
     <MenuButton aria-label="Toggle menu" onClick={handleClickNav}>
        {isPushedRight ? (
          <ChatCloudIcon width="24px" color="textSubtle" />
        ) : (
          <ChatCloudIcon width="24px" color="textSubtle" />
        )}
      </MenuButton>
    </Container>
  );
};

export default ChatCloud;
