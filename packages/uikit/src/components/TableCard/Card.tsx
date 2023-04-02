import React from "react";
import { TableStyledCard, TableStyledCardInner } from "./StyledCard";
import { TableCardProps } from "./types";

const TableCard: React.FC<React.PropsWithChildren<TableCardProps>> = ({ ribbon, children, background, ...props }) => {
  return (
    <TableStyledCard {...props}>
      <TableStyledCardInner background={background} hasCustomBorder={!!props.borderBackground}>
        {ribbon}
        {children}
      </TableStyledCardInner>
    </TableStyledCard>
  );
};
export default TableCard;
