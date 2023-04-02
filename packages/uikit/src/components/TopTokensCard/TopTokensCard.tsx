import React from "react";
import { StyledCard, TokensCardInner } from "./StyledCard";
import { CardProps } from "./types";

const TopTokensCard: React.FC<React.PropsWithChildren<CardProps>> = ({ ribbon, children, background, ...props }) => {
  return (
    <StyledCard {...props}>
      <TokensCardInner background={background} hasCustomBorder={!!props.borderBackground}>
        {ribbon}
        {children}
      </TokensCardInner>
    </StyledCard>
  );
};
export default TopTokensCard;
