import React from "react";
import ExternalStyle from "./ExternalStyle";
import { LinkProps } from "./types";

const External: React.FC<React.PropsWithChildren<LinkProps>> = ({ children, ...props }) => {
  return (
    <ExternalStyle external {...props}>
      {children}
    </ExternalStyle>
  );
};

export default External;
