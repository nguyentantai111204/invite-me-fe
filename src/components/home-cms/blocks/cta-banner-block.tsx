"use client";

import React from "react";
import { Box, Container, Paper } from "@mui/material";
import Link from "next/link";
import { ICtaBannerBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
} from "@/components/shared";

interface ICtaBannerBlockProps {
  data: ICtaBannerBlockData;
  styles?: IBlockStyles;
}

export const CtaBannerBlock: React.FC<ICtaBannerBlockProps> = ({ data, styles }) => {
  return (
    <Box
      sx={{
        backgroundColor: styles?.backgroundColor || COLOR.bgPrimary,
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        <Paper
          elevation={4}
          sx={{
            background: COLOR.btnGradient,
            color: COLOR.textInverse,
            borderRadius: RADIUS.xl,
            p: { xs: 5, md: 8 },
            textAlign: "center",
            boxShadow: SHADOW.xl,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <StackColAlignJustCenter spacing={2.5}>
            <HeadingElement variant="h2" weight="extrabold" colorVariant="white">
              {data.title}
            </HeadingElement>

            <TextElement
              size="lg"
              colorVariant="white"
              sx={{ maxWidth: 620, opacity: 0.95 }}
            >
              {data.subtitle}
            </TextElement>

            <StackRowAlignJustCenter spacing={2} sx={{ mt: 2, flexWrap: "wrap", gap: 2 }}>
              {data.primaryButton?.show && (
                <ButtonElement
                  component={Link}
                  href={data.primaryButton.link}
                  variant="dark"
                  size="large"
                  rounded="md"
                  leftIcon={
                    data.primaryButton.iconName ? (
                      <IconElement name={data.primaryButton.iconName} size="sm" />
                    ) : undefined
                  }
                  sx={{ px: 4, py: 1.5, fontSize: "1rem" }}
                >
                  {data.primaryButton.text}
                </ButtonElement>
              )}

              {data.secondaryButton?.show && (
                <ButtonElement
                  component={Link}
                  href={data.secondaryButton.link}
                  variant="outline"
                  size="large"
                  rounded="md"
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      borderColor: "#FFFFFF",
                    },
                    px: 3.5,
                    py: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  {data.secondaryButton.text}
                </ButtonElement>
              )}
            </StackRowAlignJustCenter>
          </StackColAlignJustCenter>
        </Paper>
      </Container>
    </Box>
  );
};
