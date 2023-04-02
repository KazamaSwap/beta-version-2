import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type TableCardBodyProps = SpaceProps;

const TableCardBody = styled.div<TableCardBodyProps>`
  ${space}
`;

TableCardBody.defaultProps = {
  p: "24px",
};

export default TableCardBody;
