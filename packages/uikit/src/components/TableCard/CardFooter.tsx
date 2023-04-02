import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type TableCardFooterProps = SpaceProps;

const TableCardFooter = styled.div<TableCardFooterProps>`
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${space}
`;

TableCardFooter.defaultProps = {
  p: "24px",
};

export default TableCardFooter;
