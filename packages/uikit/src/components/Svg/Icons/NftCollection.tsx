import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 48 48" {...props}>
<path d="M 44.269531 11.484375 L 24.703125 0.1875 C 24.269531 -0.0625 23.730469 -0.0625 23.296875 0.1875 L 3.730469 11.484375 C 3.296875 11.738281 3.027344 12.199219 3.027344 12.703125 L 3.027344 35.296875 C 3.027344 35.800781 3.296875 36.261719 3.730469 36.515625 L 23.296875 47.8125 C 23.730469 48.0625 24.269531 48.0625 24.703125 47.8125 L 44.269531 36.515625 C 44.703125 36.261719 44.972656 35.800781 44.972656 35.296875 L 44.972656 12.703125 C 44.972656 12.199219 44.703125 11.738281 44.269531 11.484375 Z M 18.726562 28.519531 C 18.726562 29.296875 18.097656 29.925781 17.320312 29.925781 L 15.816406 29.925781 C 15.246094 29.925781 14.734375 29.582031 14.515625 29.058594 L 11.949219 22.898438 L 11.949219 28.519531 C 11.878906 30.382812 9.207031 30.382812 9.136719 28.519531 L 9.136719 19.480469 C 9.136719 18.703125 9.765625 18.074219 10.542969 18.074219 L 12.050781 18.074219 C 12.617188 18.074219 13.128906 18.417969 13.347656 18.941406 L 15.914062 25.101562 L 15.914062 19.480469 C 15.984375 17.617188 18.660156 17.617188 18.726562 19.480469 Z M 28.519531 20.886719 L 24 20.886719 L 24 23.347656 L 27.011719 23.347656 C 28.875 23.417969 28.875 26.089844 27.011719 26.160156 L 24 26.160156 L 24 28.519531 C 23.929688 30.382812 21.257812 30.382812 21.1875 28.519531 L 21.1875 19.480469 C 21.1875 18.703125 21.816406 18.074219 22.59375 18.074219 L 28.519531 18.074219 C 30.382812 18.144531 30.382812 20.820312 28.519531 20.886719 Z M 38.308594 20.886719 L 36.703125 20.886719 L 36.703125 28.519531 C 36.632812 30.382812 33.960938 30.382812 33.890625 28.519531 L 33.890625 20.886719 L 32.285156 20.886719 C 30.421875 20.816406 30.421875 18.144531 32.285156 18.074219 L 38.308594 18.074219 C 40.171875 18.144531 40.171875 20.820312 38.308594 20.886719 Z M 38.308594 20.886719 "/>
  </Svg>
);

export default Icon;