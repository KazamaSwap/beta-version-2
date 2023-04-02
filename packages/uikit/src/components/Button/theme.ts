import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MDS]: {
    height: "38px",
    padding: "0 24px",
  },
  [scales.MD]: {
    height: "48px",
    padding: "0 24px",
  },
  [scales.SM]: {
    height: "32px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "primary",
    color: "white",
  },
  [variants.SECONDARY]: {
    backgroundColor: "transparent",
    border: "2px solid",
    borderColor: "primary",
    boxShadow: "none",
    color: "primary",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.SECONDARY_SUCCESS]: {
    backgroundColor: "transparent",
    border: "2px solid",
    borderColor: "success",
    boxShadow: "none",
    color: "success",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.SECONDARY_WARNING]: {
    backgroundColor: "transparent",
    border: "2px solid",
    borderColor: "warning",
    boxShadow: "none",
    color: "warning",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    boxShadow: "none",
    color: "text",
  },
  [variants.WARNING]: {
    backgroundColor: "warning",
    boxShadow: "none",
    color: "text",
  },
  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    color: "backgroundAlt",
  },
  [variants.DANGER]: {
    backgroundColor: "failure",
    color: "white",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    color: "white",
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "primary",
    boxShadow: "none",
  },
  [variants.TEXTWHITE]: {
    backgroundColor: "transparent",
    color: "#fff",
    boxShadow: "none",
  },
  [variants.TEXTWARNING]: {
    backgroundColor: "transparent",
    color: "warning",
    boxShadow: "none",
  },
  [variants.LIGHT]: {
    backgroundColor: "input",
    color: "textSubtle",
    boxShadow: "none",
  },
};
