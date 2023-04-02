import React from "react";
import styled from "styled-components";
import { CogIcon } from "../../../components/Svg";
import IconButton from "../../../components/Button/IconButton";
import { MENU_ENTRY_HEIGHT } from "../config";
import { PanelProps, PushedProps } from "../types";
import { Button } from "../../../components/Button";
import Flex from "../../../components/Box/Flex";
import { Image } from "../../../components/Image"
import { Box } from "../../../components/Box"


interface Props extends PanelProps, PushedProps {}

const Container = styled.div`
  flex: none;
  padding: 8px 4px;
  background-image: linear-gradient(#111111, #0000000);
  border-top: 1px solid #1B1A23;
  padding-left: 12px;
  padding-right: 12px;
  margin-bottom: 25px;
  padding-top: 15px;
  height: 125px;
`;

const SettingsEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 8px;
`;

const SocialEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 16px;
  padding-bottom: 55px;
`;

const ThreeColumnFlex = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    max-width: 32%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 16px;
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 100%;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
  width: 100%;
`

const Wrapper = styled.div`
flex-direction: column;
align-items:center;
width: 100%;
`

const Input = styled.input<{ error?: boolean }>`
  font-size: 14px;
  outline: none;
  border: none;
  flex: 1 1 auto;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.colors.failure : theme.colors.text)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  min-height: 45px;
  width: 100%;
  ::placeholder {
    color: #5a5471;
  }
  padding-left: 20px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.text};
  }
`

export const KazamaTextButton = styled.div`
   font-family: 'Luckiest Guy', cursive;
   font-style: regular;
   font-size: 18px;
   -webkit-text-fill-color: white;
   -webkit-text-stroke-color: black;
   -webkit-text-stroke-width: 1.00px; 
   font-weight: 400;
`

export const IconWrapper = styled.div`
   background: #2e2b3a;

`

const PanelFooter: React.FC<Props> = ({
  isPushed,
  pushNav,
  toggleTheme,
  isDark,
  kazamaPriceUsd,
  currentLang,
  langs,
  setLang,
}) => {
//  if (!isPushed) {
//    return (
//      <Container>
//        <IconButton variant="text" onClick={() => pushNav(true)}>
//          <CogIcon />
//        </IconButton>
//      </Container>
//    );
//  }

  return (
    <>
      <Container>

    </Container>
    </>
  );
};

export default PanelFooter;
