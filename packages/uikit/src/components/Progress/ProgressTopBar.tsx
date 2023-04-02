import React from "react";
import StyledProgressTopBar, { Bar } from "./StyledProgressTopBar";
import ProgressBunnyWrapper from "./ProgressBunnyWrapper";
import { ProgressBunny } from "../Svg";
import { ProgressProps, variants, scales } from "./types";

const stepGuard = (step: number) => {
  if (step < 0) {
    return 0;
  }

  if (step > 100) {
    return 100;
  }

  return step;
};

const ProgressTopBar: React.FC<React.PropsWithChildren<ProgressProps>> = ({
  variant = variants.ROUND,
  scale = scales.XS,
  primaryStep = 0,
  secondaryStep = null,
  showProgressBunny = false,
  useDark = true,
  children,
}) => {
  return (
    <StyledProgressTopBar $useDark={useDark} variant={variant} scale={scale}>
      {children || (
        <>
          {showProgressBunny && (
            <ProgressBunnyWrapper style={{ left: `${stepGuard(primaryStep)}%` }}>
              <ProgressBunny />
            </ProgressBunnyWrapper>
          )}
          <Bar $useDark={useDark} primary style={{ width: `${stepGuard(primaryStep)}%` }} />
          {secondaryStep ? <Bar $useDark={useDark} style={{ width: `${stepGuard(secondaryStep)}%` }} /> : null}
        </>
      )}
    </StyledProgressTopBar>
  );
};

export default ProgressTopBar;
