import { StackProps } from "@mui/material";

export interface ICustomStackProps extends Omit<StackProps, "gap"> {
  gap?: string | number;
}
