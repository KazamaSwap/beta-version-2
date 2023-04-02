import { darkColors, lightColors } from "../../theme/colors";

export type ToggleTheme = {
  handleBackground: string;
};

export const light: ToggleTheme = {
  handleBackground: lightColors.primary,
};

export const dark: ToggleTheme = {
  handleBackground: darkColors.primary,
};
