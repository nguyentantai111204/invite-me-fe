import React from "react";
import { Stack } from "@mui/material";
import { ICustomStackProps } from "./stack-custom.interface";
import {
  STACK_CENTER,
  STACK_COL_ALIGN_CENTER_JUST_END,
  STACK_COL_ALIGN_CENTER_JUST_START,
  STACK_COL_ALIGN_CENTER_WRAP,
  STACK_COL_ALIGN_JUST_BETWEEN,
  STACK_COL_ALIGN_JUST_CENTER,
  STACK_COL_ALIGN_JUST_START,
  STACK_ROW_ALIGN_CENTER_JUST_END,
  STACK_ROW_ALIGN_CENTER_JUST_START,
  STACK_ROW_ALIGN_CENTER_WRAP,
  STACK_ROW_ALIGN_JUST_BETWEEN,
  STACK_ROW_ALIGN_JUST_CENTER,
  STACK_ROW_ALIGN_JUST_START,
} from "./stack-custom.style";

export const StackRowAlignJustStart = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "row", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_ROW_ALIGN_JUST_START, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackRowAlignJustStart.displayName = "StackRowAlignJustStart";

export const StackRowAlignJustCenter = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "row", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_ROW_ALIGN_JUST_CENTER, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackRowAlignJustCenter.displayName = "StackRowAlignJustCenter";

export const StackRowAlignJustBetween = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "row", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_ROW_ALIGN_JUST_BETWEEN, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackRowAlignJustBetween.displayName = "StackRowAlignJustBetween";

export const StackRowAlignCenterJustStart = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "row", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_ROW_ALIGN_CENTER_JUST_START, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackRowAlignCenterJustStart.displayName = "StackRowAlignCenterJustStart";

export const StackRowAlignCenterJustEnd = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "row", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_ROW_ALIGN_CENTER_JUST_END, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackRowAlignCenterJustEnd.displayName = "StackRowAlignCenterJustEnd";

export const StackRowAlignCenterWrap = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "row", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_ROW_ALIGN_CENTER_WRAP, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackRowAlignCenterWrap.displayName = "StackRowAlignCenterWrap";

export const StackColAlignJustStart = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "column", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_COL_ALIGN_JUST_START, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackColAlignJustStart.displayName = "StackColAlignJustStart";

export const StackColAlignJustCenter = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "column", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_COL_ALIGN_JUST_CENTER, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackColAlignJustCenter.displayName = "StackColAlignJustCenter";

export const StackColAlignJustBetween = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "column", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_COL_ALIGN_JUST_BETWEEN, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackColAlignJustBetween.displayName = "StackColAlignJustBetween";

export const StackColAlignCenterJustStart = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "column", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_COL_ALIGN_CENTER_JUST_START, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackColAlignCenterJustStart.displayName = "StackColAlignCenterJustStart";

export const StackColAlignCenterJustEnd = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "column", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_COL_ALIGN_CENTER_JUST_END, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackColAlignCenterJustEnd.displayName = "StackColAlignCenterJustEnd";

export const StackColAlignCenterWrap = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, direction = "column", gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={direction}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_COL_ALIGN_CENTER_WRAP, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackColAlignCenterWrap.displayName = "StackColAlignCenterWrap";

export const StackCenter = React.forwardRef<HTMLDivElement, ICustomStackProps>(
  ({ sx, gap, spacing, ...props }, ref) => (
    <Stack
      ref={ref}
      spacing={spacing !== undefined ? spacing : gap}
      sx={[STACK_CENTER, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  )
);
StackCenter.displayName = "StackCenter";

// Convenient aliases
export const StackRow = StackRowAlignJustStart;
export const StackCol = StackColAlignJustStart;
export const StackRowBetween = StackRowAlignJustBetween;
export const StackColBetween = StackColAlignJustBetween;
export const StackRowCenter = StackRowAlignJustCenter;
export const StackColCenter = StackColAlignJustCenter;
