import React from "react";
import { KazamaPrice, KazamaPriceProps } from ".";
import { Flex } from "../Box";

export default {
  title: "Components/KazamaPrice",
  component: KazamaPrice,
};

const Template: React.FC<React.PropsWithChildren<KazamaPriceProps>> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <KazamaPrice {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  kazamaPriceUsd: 20.0,
};
