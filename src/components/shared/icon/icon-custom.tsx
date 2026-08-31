"use client";

import React from "react";
import { SvgIconProps } from "@mui/material";
import { HelpOutlined } from "@mui/icons-material";
import { IIconElementProps } from "./icon-custom.interface";
import { getIconStyles } from "./icon-custom.style";
import { ICON_MAP } from "./icon-map";

export const IconElement = React.forwardRef<SVGSVGElement, IIconElementProps>(
  (props, ref) => {
    const { name, size, colorVariant, color, sx, ...restProps } = props;

    const Component = (ICON_MAP[name] as React.ComponentType<SvgIconProps>) || HelpOutlined;
    const dynamicStyles = getIconStyles({ name, size, colorVariant, color });

    const combinedSx = Array.isArray(sx)
      ? [dynamicStyles, ...sx]
      : [dynamicStyles, ...(sx ? [sx] : [])];

    return <Component ref={ref} sx={combinedSx} {...restProps} />;
  }
);

IconElement.displayName = "IconElement";
