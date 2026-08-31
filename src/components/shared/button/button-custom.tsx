import React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";
import { IButtonElementProps } from "./button-custom.interface";
import { getButtonStyles } from "./button-custom.style";

export const ButtonElement = React.forwardRef<HTMLButtonElement, IButtonElementProps>(
  (props, ref) => {
    const {
      variant = "primary",
      isLoading = false,
      leftIcon,
      rightIcon,
      startIcon,
      endIcon,
      rounded,
      disabled,
      children,
      sx,
      ...restProps
    } = props;

    const buttonStyles = getButtonStyles(variant, rounded);
    const combinedSx = Array.isArray(sx)
      ? [buttonStyles, ...sx]
      : [buttonStyles, ...(sx ? [sx] : [])];

    const finalStartIcon = isLoading ? (
      <CircularProgress size={18} color="inherit" />
    ) : (
      leftIcon || startIcon
    );

    const finalEndIcon = !isLoading ? rightIcon || endIcon : undefined;

    return (
      <MuiButton
        ref={ref}
        disabled={disabled || isLoading}
        startIcon={finalStartIcon}
        endIcon={finalEndIcon}
        sx={combinedSx}
        {...restProps}
      >
        {children}
      </MuiButton>
    );
  }
);

ButtonElement.displayName = "ButtonElement";
