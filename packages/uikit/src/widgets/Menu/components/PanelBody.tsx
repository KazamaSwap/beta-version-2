import React, { createElement, ReactElement, memo } from "react";
import styled from "styled-components";
// import { useLocation } from "react-router-dom";
import { HamburgerCloseIcon, HamburgerIcon, SvgProps } from "../../../components/Svg";
// import * as IconModule from "../icons";
import Accordion from "./Accordion";
import { MenuEntry, LinkLabel, LinkStatus } from "./MenuEntry";
import MenuLink from "./MenuLink";
import { PanelProps, PushedProps } from "../types";
import MenuItem from "../../../components/MenuItem";
import { Box } from "../../../components/Box";
import { Button } from "../../../components/Button"

interface Props extends PanelProps, PushedProps {
  isMobile: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

const KazamaLotteryButton = styled(Button)`
position: relative;
    margin: 1rem;
    padding: 0.5rem 0;
    background: linear-gradient(267.29deg,rgba(38,34,48,.3),rgba(143,45,62,.3));
    border: 2px solid #EE1A78;
    box-sizing: border-box;
    border-radius: 5px;
    height: 2.75rem;
    transition: all .2s ease-in-out;
    width: 100%;
`;

const ButtonWrapper = styled.div`
cursor: pointer;
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
-webkit-align-items: center;
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
height: 48px;
padding: 0 16px;
font-size: 17px;
font-weight: bold;
background-image: transparent;
box-shadow: none;
-webkit-box-flex: 1;
-webkit-flex-grow: 1;
-ms-flex-positive: 1;
flex-grow: 1;
-webkit-flex-shrink: 0;
-ms-flex-negative: 0;
flex-shrink: 0;
`

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
    justify-content: right;
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
    padding: 0px;
    position: relative;
    left: 6px;
    margin-left: auto;
`;

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links, activeItem, activeSubItem }) => {

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined;
  const handleClickNav = () => pushNav(!isPushed);
  return (
    <Container>
      {links.map((entry) => {
        const Icon = entry.icon;
        // const itemIconElement = <Icon width="24px" mr="8px" />;
        const iconElement = createElement(Icon as any, { color: entry.href === activeItem || entry.items?.some((item) => item.href === activeSubItem) ? "secondary" : "textSubtle", marginRight: '16px' })

        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined;

        if (entry.items && entry.items.length > 0) {
          const itemsMatchIndex = entry.items.findIndex((item) => item.href === activeSubItem);
          const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0;
          activeItem
          return (
            <>
            <Accordion
              key={entry.label}
              isPushed={isPushed}
              pushNav={pushNav}
              icon={iconElement}
              label={entry.label}
              status={entry.status}
              initialOpenState={initialOpenState}
              className={calloutClass}
              isActive={entry.href === activeItem || entry.items?.some((item) => item.href === activeSubItem)}
            >
              {isPushed &&
                entry.items.map((item) => (
                  <MenuEntry key={item.href} secondary isActive={item.href === activeSubItem} onClick={handleClick}>
                    <MenuItem href={item.href} isActive={item.href === activeSubItem} statusColor={item.status?.color} isDisabled={item.disabled}>
                     <LinkLabel isPushed={isPushed}>{item.label}</LinkLabel>
                      {item.status && (
                        <LinkStatus color={item.status.color}>
                        {item.status.text}
                        </LinkStatus>
                      )}
                    </MenuItem>
                    {/* <MenuLink href={item.href}>
                  
                </MenuLink> */}
                  </MenuEntry>
                ))}
            </Accordion></>
          );
        }
        return (
          <MenuEntry key={entry.label} isActive={entry.href === activeItem || entry.items?.some((item) => item.href === activeSubItem)} className={calloutClass}>
            <MenuItem href={entry.href} isActive={entry.href === activeSubItem || entry.items?.some((item) => item.href === activeSubItem)} statusColor={entry.status?.color} isDisabled={entry.disabled}>
              <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
              {entry.status && (
                <LinkStatus color={entry.status.color}>
                  {entry.status.text}
                </LinkStatus>
              )}
            </MenuItem>
          </MenuEntry>
        );
      })}
    </Container>
  );
};

export default PanelBody;
