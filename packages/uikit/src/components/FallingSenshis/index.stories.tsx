import React from "react";
import FallingSenshis from "./FallingSenshis";

export default {
  title: "Components/FallingSenshis",
  component: FallingSenshis,
  argTypes: {},
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return <FallingSenshis />;
};
