import React from "react";
import styled, { keyframes, DefaultTheme } from "styled-components";
import { Text } from "../../../components/Text";
import { Colors } from "../../../theme/types";
import { MENU_ENTRY_HEIGHT } from "../config";

export interface Props {
  secondary?: boolean;
  isActive?: boolean;
  theme: DefaultTheme;
}

const rainbowAnimation = keyframes`
  0%,
  100% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
`;

const LinkLabel = styled.div<{ isPushed: boolean }>`
  color: ${({ isPushed, theme }) => (isPushed ? "#fff" : "transparent")};
  transition: color 0.4s;
  flex-grow: 1;

  &:hover {
    color: ${({ isPushed, theme }) => (isPushed ? "#fff" : "transparent")};
  }
  &:active {
    color: ${({ isPushed, theme }) => (isPushed ? "#fff" : "transparent")};
  }
`;

const CategoryEntry = styled.div<Props>`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: ${({ secondary }) => (secondary ? "0 5px" : "0 5px")};
  font-size: ${({ secondary }) => (secondary ? "14px" : "17px")};
  font-weight: ${({ secondary }) => (secondary ? "none" : "bold")};
  background: ${({ isActive, secondary }) => (isActive && secondary? `#1b2031` : "transparent")};
  color: ${({ isActive, secondary }) => (isActive && secondary? `#fff` : "transparent")};
  flex-grow: 1;
  height: 39px;
  min-height: 39px;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
  
  a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  svg {
    fill: #fff;
  }

  &:hover {
    color: #fff !important;
  }

  // Safari fix
  flex-shrink: 0;

  &.rainbow {
    background-clip: text;
    animation: ${rainbowAnimation} 3s ease-in-out infinite;
    background: ${({ theme }) => theme.colors.gradients.bubblegum};
    background-size: 400% 100%;
  }
`;
CategoryEntry.defaultProps = {
  secondary: false,
  isActive: false,
};

const LinkStatus = styled.div<{ color: keyof Colors }>`
  border-radius: 5px;
  padding: 0 8px 0px;
  border: 2px solid;
  border-color: ${({ theme, color }) => theme.colors[color]};
  background: ${({ theme, color }) => theme.colors[color]};
  box-shadow: none;
  height: 16px;
  color: #fff;
  margin-left: 8px;
  font-size: 12px;
  text-align: center;
`;


const LinkLabelMemo = React.memo(LinkLabel, (prev, next) => prev.isPushed === next.isPushed);

export { CategoryEntry, LinkStatus, LinkLabelMemo as LinkLabel };
