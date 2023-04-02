import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type LiqCardFooterProps = SpaceProps;

const LiqCardFooter = styled.div<LiqCardFooterProps>`
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${space}
`;

LiqCardFooter.defaultProps = {
  mt: "10px",
  p: "20px",
};

export default LiqCardFooter;
