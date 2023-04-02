import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 48 48" {...props}>
<path d="M 9 0 L 9 9 L 15 9 L 15 6 L 39 6 L 39 42 L 15 42 L 15 39 L 9 39 L 9 48 L 45 48 L 45 0 Z M 9 0 "/>
<path d="M 14.636719 30.878906 L 18.878906 35.121094 L 30 24 L 18.878906 12.878906 L 14.636719 17.121094 L 18.515625 21 L 3 21 L 3 27 L 18.515625 27 Z M 14.636719 30.878906 "/></Svg>
);

export default Icon;