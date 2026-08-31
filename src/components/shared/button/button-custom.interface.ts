import React from "react";
import { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { RADIUS } from "@/constants/style.constant";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "gradient"
  | "outline"
  | "ghost"
  | "dark"
  | "contained"
  | "outlined"
  | "text";

export type ButtonRounded = keyof typeof RADIUS | boolean;

export interface IButtonElementProps extends Omit<MuiButtonProps, "variant"> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rounded?: ButtonRounded;
}
