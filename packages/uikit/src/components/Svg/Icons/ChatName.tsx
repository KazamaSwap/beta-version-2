import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 48 48" {...props}>
<path d="M 36 2 L 12 2 C 6.484375 2 2 6.484375 2 12 L 2 28 C 2 32.828125 5.441406 36.867188 10 37.796875 L 10 44 C 10 44.738281 10.40625 45.414062 11.054688 45.765625 C 11.351562 45.921875 11.675781 46 12 46 C 12.386719 46 12.773438 45.886719 13.109375 45.664062 L 24.605469 38 L 36 38 C 41.515625 38 46 33.515625 46 28 L 46 12 C 46 6.484375 41.515625 2 36 2 Z M 22.890625 34.335938 L 14 40.261719 L 14 36 C 14 34.894531 13.105469 34 12 34 C 8.691406 34 6 31.308594 6 28 L 6 12 C 6 8.691406 8.691406 6 12 6 L 36 6 C 39.308594 6 42 8.691406 42 12 L 42 28 C 42 31.308594 39.308594 34 36 34 L 24 34 C 23.859375 33.996094 23.660156 34.011719 23.433594 34.078125 C 23.191406 34.148438 23.011719 34.253906 22.890625 34.335938 Z M 22.890625 34.335938 "/>
<path d="M 36 14 L 12 14 C 10.894531 14 10 14.894531 10 16 C 10 17.105469 10.894531 18 12 18 L 36 18 C 37.105469 18 38 17.105469 38 16 C 38 14.894531 37.105469 14 36 14 Z M 36 14 "/>
<path d="M 32 22 L 16 22 C 14.894531 22 14 22.894531 14 24 C 14 25.105469 14.894531 26 16 26 L 32 26 C 33.105469 26 34 25.105469 34 24 C 34 22.894531 33.105469 22 32 22 Z M 32 22 "/>
  </Svg>
);

export default Icon;