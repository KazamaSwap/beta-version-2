import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { Box, Flex } from "../../../../components/Box";
import { ChevronDownIcon } from "../../../../components/Svg";
import { UserMenuProps, variants } from "./types";
import MenuIcon from "./MenuIcon";
import { UserMenuItem } from "./styles";

export const StyledUserMenu = styled(Flex)`
  align-items: center;
  background-color: #1b2031;
  border-radius: 10px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: inline-flex;
  height: 45px;
  padding-left: 13px;
  padding-right: 8px;
  position: relative;
  &:hover {
    opacity: 0.65;
  }
`;

export const LabelText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: none;
  font-weight: 600;
  font-size: 15px;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-left: 8px;
    margin-right: 4px;
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  background: #25202F;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 0 0 5px 5px;
  pointer-events: auto;
  width: auto;
  visibility: visible;
  z-index: 1001;
  box-shadow: rgb(0 0 0 / 25%) 0px 5px 8px -4px, rgb(0 0 0 / 18%) 0px 0px 20px 0px, rgb(0 0 0 / 35%) 0px 40px 34px -16px;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}

  ${UserMenuItem}:first-child {
    border-radius: 8px 8px 0 0;
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

 const InnerWrapper = styled.div`
 position: relative;
 display: flex;
 `

const LeftPanel = styled.div`
flex: 1 1 0%;
min-width: 0px;
max-height: 510px;
padding: 20px;
background: #201c29;
overflow: hidden auto;
`

const BalanceWrappersDiv = styled.div`
padding-top: 20px;
`

const BalanceWrapperLeft = styled.div`
display: flex;
-webkit-box-align: center;
align-items: center;
margin-bottom: 12px;
border-radius: 10px;
flex-direction: column;
`

const StyledBalanceWrapper = styled.div`
flex: 1 1 0%;
min-width: 0px;
display: flex;
background: rgba(44, 38, 57, 0.781);
-webkit-box-align: center;
align-items: center;
padding: 15px;
border-radius: 5px;
margin-bottom: 10px;
width: 100%;
`

const LeftWrapperTop = styled.div`
display: flex;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: justify;
justify-content: space-between;
color: rgb(177, 182, 198);
font-size: 14px;
font-family: "Geogrotesque Wide", sans-serif;
font-weight: 500;
font-style: normal;
`

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  text,
  avatarSrc,
  variant = variants.DEFAULT,
  children,
  rankProgress,
  disabled,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: "fixed",
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false);
        evt.stopPropagation();
      }
    };

    targetRef?.addEventListener("mouseenter", showDropdownMenu);
    targetRef?.addEventListener("mouseleave", hideDropdownMenu);

    return () => {
      targetRef?.removeEventListener("mouseenter", showDropdownMenu);
      targetRef?.removeEventListener("mouseleave", hideDropdownMenu);
    };
  }, [targetRef, tooltipRef, setIsOpen]);

  return (
    <><Flex alignItems="center" height="100%" ref={setTargetRef} {...props}>
        <StyledUserMenu
          onClick={() => {
            setIsOpen((s) => !s);
          } }
        >
          {/* <MenuIcon avatarSrc={avatarSrc} variant={variant} /> */}
          <Flex flexDirection="column" ml="8px">
            <Flex>
            <LabelText title={typeof text === "string" ? text || account : account}>{text || accountEllipsis}</LabelText>
            </Flex>
            <Flex>
              {rankProgress}
            </Flex>
          </Flex>

          {!disabled && <ChevronDownIcon color="text" width="24px" />}
        </StyledUserMenu>
        {!disabled && (
          <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen}>
              <Box onClick={() => setIsOpen(true)}>{children?.({ isOpen })}</Box>
          </Menu>
        )}
      </Flex></>
  );
};

export default UserMenu;
