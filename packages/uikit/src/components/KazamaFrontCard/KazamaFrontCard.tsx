import React from "react";
import { StyledCard, KazamaFrontCardInner } from "./StyledCard";
import { CardProps } from "./types";

const KazamaFrontCard: React.FC<CardProps> = ({ ribbon, children, background, ...props }) => {
  return (
    <StyledCard {...props}>
      <KazamaFrontCardInner background={background} hasCustomBorder={!!props.borderBackground}>
        {ribbon}
        {children}
      </KazamaFrontCardInner>
    </StyledCard>
  );
};
export default KazamaFrontCard;
