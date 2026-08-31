import React from "react";
import { Typography as MuiTypography } from "@mui/material";
import { ITypographyCustomProps } from "./typography-custom.interface";
import { getTypographyStyles } from "./typography-custom.style";

// Typography Component chuẩn hóa cho toàn dự án:
export const TypographyElement = React.forwardRef<HTMLElement, ITypographyCustomProps>(
  (props, ref) => {
    const {
      size,
      weight,
      colorVariant,
      color,
      fontFamilyType,
      lineHeightType,
      letterSpacingType,
      gradient,
      truncate,
      italic,
      underline,
      sx,
      children,
      ...restProps
    } = props;

    const dynamicStyles = getTypographyStyles({
      size,
      weight,
      colorVariant,
      color,
      fontFamilyType,
      lineHeightType,
      letterSpacingType,
      gradient,
      truncate,
      italic,
      underline,
    });

    const combinedSx = Array.isArray(sx)
      ? [dynamicStyles, ...sx]
      : [dynamicStyles, ...(sx ? [sx] : [])];

    return (
      <MuiTypography
        ref={ref}
        sx={combinedSx}
        {...restProps}
      >
        {children}
      </MuiTypography>
    );
  }
);

TypographyElement.displayName = "TypographyElement";

// Heading Component (tiêu đề h1 - h6 với mặc định font chữ đậm)
export const HeadingElement = React.forwardRef<HTMLElement, ITypographyCustomProps>(
  ({ variant = "h2", weight = "bold", ...props }, ref) => {
    return (
      <TypographyElement
        ref={ref}
        variant={variant}
        weight={weight}
        {...props}
      />
    );
  }
);

HeadingElement.displayName = "HeadingElement";

// Text Component (đoạn văn body1 / body2 với styling tinh gọn)
export const TextElement = React.forwardRef<HTMLElement, ITypographyCustomProps>(
  ({ variant = "body1", colorVariant = "primary", ...props }, ref) => {
    return (
      <TypographyElement
        ref={ref}
        variant={variant}
        colorVariant={colorVariant}
        {...props}
      />
    );
  }
);

TextElement.displayName = "TextElement";