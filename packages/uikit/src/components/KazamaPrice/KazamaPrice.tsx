import React from "react";
import styled from "styled-components";
import KazamaRound from "../Svg/Icons/KazamaRound";
import Text from "../Text/Text";
import Skeleton from "../Skeleton/Skeleton";
import { Colors } from "../../theme";

export interface Props {
  color?: keyof Colors;
  kazamaPriceUsd?: number;
  showSkeleton?: boolean;
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const KazamaPrice: React.FC<React.PropsWithChildren<Props>> = ({
  kazamaPriceUsd,
  color = "#ffffff",
  showSkeleton = true,
}) => {
  return kazamaPriceUsd ? (
    <PriceLink
      href="/swap?outputCurrency=0xC1498f157FC12F500a1cCd41551449A539F1ba89&chainId=97"
    >
      <KazamaRound width="24px" mr="8px" />
      <Text color={color} bold>{`$${kazamaPriceUsd.toFixed(7)}`}</Text>
    </PriceLink>
  ) : showSkeleton ? (
    <Skeleton width={80} height={24} />
  ) : null;
};

export default React.memo(KazamaPrice);
