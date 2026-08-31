"use client";

import React, { Suspense, useMemo } from "react";
import { SvgIconProps } from "@mui/material";
import { IIconElementProps, IconName } from "./icon-custom.interface";
import { getIconStyles } from "./icon-custom.style";

const iconCache = new Map<string, React.LazyExoticComponent<React.ComponentType<SvgIconProps>>>();

const getDynamicIcon = (name: IconName) => {
  if (!iconCache.has(name)) {
    const Component = React.lazy(async () => {
      try {
        const mod = await import(`@mui/icons-material/${name}`);
        return { default: mod.default || mod };
      } catch {
        const fallback = await import("@mui/icons-material/HelpOutlined");
        return { default: fallback.default || fallback };
      }
    });
    iconCache.set(name, Component);
  }
  return iconCache.get(name)!;
};

export const IconElement = React.forwardRef<SVGSVGElement, IIconElementProps>(
  (props, ref) => {
    const { name, size, colorVariant, color, sx, ...restProps } = props;

    const DynamicIcon = useMemo(() => getDynamicIcon(name), [name]);
    const dynamicStyles = getIconStyles({ name, size, colorVariant, color });

    const combinedSx = Array.isArray(sx)
      ? [dynamicStyles, ...sx]
      : [dynamicStyles, ...(sx ? [sx] : [])];

    return (
      <Suspense fallback={<span style={{ display: "inline-block", width: "1em", height: "1em" }} />}>
        <DynamicIcon ref={ref} sx={combinedSx} {...restProps} />
      </Suspense>
    );
  }
);

IconElement.displayName = "IconElement";
