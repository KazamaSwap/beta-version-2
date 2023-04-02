import React from "react";
import { useTheme } from "styled-components";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  const theme = useTheme();
  const primaryColor = theme.isDark ? "#3C3742" : "#e9eaeb";
  const secondaryColor = theme.isDark ? "#666171" : "#bdc2c4";

  return (
<svg viewBox="0 0 16 16" {...props}>  <image id="image0" width="16" height="16" x="0" y="0"
    href="data:image/png;base64,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" />
</svg>
  );
};

export default Icon;
