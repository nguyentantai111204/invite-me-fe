"use client";

import React from "react";
import { Box, Container, Paper } from "@mui/material";
import Link from "next/link";
import { ICtaBannerBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW, ANIMATION, SPACING } from "@/constants/style.constant";
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
        py: { xs: SPACING.px64, md: SPACING.px96 },
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        <Paper
          elevation={4}
          sx={{
            background: COLOR.btnGradient,
            color: COLOR.textInverse,
            borderRadius: RADIUS.lg,
            p: { xs: SPACING.px40, md: SPACING.px64 },
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

            <StackRowAlignJustCenter spacing={SPACING.px16} sx={{ mt: SPACING.px16, flexWrap: "wrap", gap: SPACING.px16 }}>
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
                  sx={{ px: 4, py: 1.5 }}
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
                    color: COLOR.textInverse,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      borderColor: COLOR.textInverse,
                    },
                    px: 3.5,
                    py: 1.5,
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
