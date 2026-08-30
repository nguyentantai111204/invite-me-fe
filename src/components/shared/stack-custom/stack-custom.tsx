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

export const StackRowAlignJustStart: React.FC<ICustomStackProps> = ({
  sx,
  direction = "row",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_ROW_ALIGN_JUST_START, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackRowAlignJustCenter: React.FC<ICustomStackProps> = ({
  sx,
  direction = "row",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_ROW_ALIGN_JUST_CENTER, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackRowAlignJustBetween: React.FC<ICustomStackProps> = ({
  sx,
  direction = "row",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_ROW_ALIGN_JUST_BETWEEN, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackRowAlignCenterJustStart: React.FC<ICustomStackProps> = ({
  sx,
  direction = "row",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_ROW_ALIGN_CENTER_JUST_START, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackRowAlignCenterJustEnd: React.FC<ICustomStackProps> = ({
  sx,
  direction = "row",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_ROW_ALIGN_CENTER_JUST_END, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackRowAlignCenterWrap: React.FC<ICustomStackProps> = ({
  sx,
  direction = "row",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_ROW_ALIGN_CENTER_WRAP, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackColAlignJustStart: React.FC<ICustomStackProps> = ({
  sx,
  direction = "column",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_COL_ALIGN_JUST_START, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackColAlignJustCenter: React.FC<ICustomStackProps> = ({
  sx,
  direction = "column",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_COL_ALIGN_JUST_CENTER, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackColAlignJustBetween: React.FC<ICustomStackProps> = ({
  sx,
  direction = "column",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_COL_ALIGN_JUST_BETWEEN, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackColAlignCenterJustStart: React.FC<ICustomStackProps> = ({
  sx,
  direction = "column",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_COL_ALIGN_CENTER_JUST_START, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackColAlignCenterJustEnd: React.FC<ICustomStackProps> = ({
  sx,
  direction = "column",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_COL_ALIGN_CENTER_JUST_END, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackColAlignCenterWrap: React.FC<ICustomStackProps> = ({
  sx,
  direction = "column",
  gap,
  spacing,
  ...props
}) => (
  <Stack
    direction={direction}
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_COL_ALIGN_CENTER_WRAP, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export const StackCenter: React.FC<ICustomStackProps> = ({
  sx,
  gap,
  spacing,
  ...props
}) => (
  <Stack
    spacing={spacing !== undefined ? spacing : gap}
    sx={[STACK_CENTER, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);
