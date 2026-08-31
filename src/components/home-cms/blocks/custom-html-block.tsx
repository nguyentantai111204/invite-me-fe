"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import { ICustomHtmlBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";

interface ICustomHtmlBlockProps {
  data: ICustomHtmlBlockData;
  styles?: IBlockStyles;
}

export const CustomHtmlBlock: React.FC<ICustomHtmlBlockProps> = ({ data, styles }) => {
  if (!data?.htmlContent) return null;

  return (
    <Box
      sx={{
        backgroundColor: styles?.backgroundColor,
        py: styles?.paddingY !== undefined ? styles.paddingY : 6,
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />
      </Container>
    </Box>
  );
};
