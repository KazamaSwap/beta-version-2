import React, { ReactElement } from "react";
import styled from "styled-components";
import PanelBodyRight from "./PanelBodyRight";
import PanelFooter from "./PanelFooter";
import { SIDEBAR_RIGHT_WIDTH_REDUCED, SIDEBAR_RIGHT_WIDTH_FULL } from "../config";
import { PanelPropsRight, PushedPropsRight } from "../types";

interface Props extends PanelPropsRight, PushedPropsRight {
  showMenu: boolean;
  isMobile: boolean;
  totalMenuHeight: number;
  chatLayout?: ReactElement;
  showChat: boolean;
}

const StyledPanel = styled.div<{ isPushedRight: boolean; showChat: boolean; showMenu: boolean}>`
  position: fixed;
  padding-top: ${({ showMenu }) => (showMenu ? "10px" : 0)};
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  background: #141824;
  width: ${({ showChat }) => (showChat ? `${SIDEBAR_RIGHT_WIDTH_FULL}px` : 0)};
  height: 100%;
  transition: padding-top 0.2s, width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: ${({ isPushedRight }) => (isPushedRight ? "1px solid rgba(0, 0, 0, 0.35)" : 0)};
  z-index: 11;
  overflow: ${({ isPushedRight }) => (isPushedRight ? "initial" : "hidden")};
  transform: translate3d(0, 0, 0);
}

element::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
}
  ${({ isPushedRight }) => !isPushedRight && "white-space: nowrap;"};

  ${({ theme }) => theme.mediaQueries.nav} {
    border-left: 1px solid rgba(0, 0, 0, 0.35);
    width: ${({ isPushedRight }) => `${isPushedRight ? SIDEBAR_RIGHT_WIDTH_FULL : SIDEBAR_RIGHT_WIDTH_REDUCED}px`};
  }
`;

const StyledPanelTwo = styled.div<{ isPushedRight: boolean; showChat: boolean; showMenu: boolean}>`
  position: fixed;
  padding-top: ${({ showMenu }) => (showMenu ? "10px" : 0)};
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  background-image: linear-gradient(#201c29, #25202F);
  width: ${({ showChat }) => (showChat ? `${SIDEBAR_RIGHT_WIDTH_FULL}px` : 0)};
  height: 100%;
  transition: padding-top 0.2s, width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: ${({ isPushedRight }) => (isPushedRight ? "1px solid #1B1A23" : 0)};
  z-index: 11;
  overflow: ${({ isPushedRight }) => (isPushedRight ? "initial" : "hidden")};
  transform: translate3d(0, 0, 0);
  ${({ isPushedRight }) => !isPushedRight && "white-space: nowrap;"};

  ${({ theme }) => theme.mediaQueries.nav} {
    border-left: 1px solid #1B1A23;
    width: ${({ isPushedRight }) => `${isPushedRight ? SIDEBAR_RIGHT_WIDTH_FULL : SIDEBAR_RIGHT_WIDTH_REDUCED}px`};
  }
`;

const PanelRight: React.FC<Props> = (props) => {
  const { isPushedRight, showMenu, chatLayout, showChat } = props;
  return (
    <StyledPanel isPushedRight={isPushedRight} showMenu={showMenu} showChat={showChat}>
       <PanelBodyRight {...props} /> 
       {chatLayout} 

    </StyledPanel>
  );
};

export default PanelRight;
