import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 48 48" {...props}>
<path d="M 24 22 C 29.523438 22 34 17.523438 34 12 C 34 6.476562 29.523438 2 24 2 C 18.476562 2 14 6.476562 14 12 C 14 17.523438 18.476562 22 24 22 Z M 20 26 C 12.269531 26 6 32.269531 6 40 C 6 43.3125 8.6875 46 12 46 L 36 46 C 39.3125 46 42 43.3125 42 40 C 42 32.269531 35.730469 26 28 26 Z M 20 26 "/>
  </Svg>
);

export default Icon;