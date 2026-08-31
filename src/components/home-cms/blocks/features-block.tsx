"use client";

import React from "react";
import { Box, Container, Grid, Paper, Chip } from "@mui/material";
import { IFeaturesBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  IconElement,
  StackColAlignJustCenter,
} from "@/components/shared";

interface IFeaturesBlockProps {
  data: IFeaturesBlockData;
  styles?: IBlockStyles;
}

export const FeaturesBlock: React.FC<IFeaturesBlockProps> = ({ data, styles }) => {
  const mdCols = data.columns === 2 ? 6 : data.columns === 4 ? 3 : 4;

  return (
    <Box
      id="features"
      sx={{
        backgroundColor: styles?.backgroundColor || COLOR.bgPaper,
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        <StackColAlignJustCenter spacing={1.5} sx={{ textAlign: "center", mb: 7 }}>
          {data.badge && (
            <Chip
              label={data.badge}
              size="small"
              sx={{
                backgroundColor: "rgba(183, 134, 40, 0.1)",
                color: COLOR.textGold,
                fontWeight: 600,
                mb: 1,
              }}
            />
          )}
          <HeadingElement variant="h2" weight="bold">
            {data.title}
          </HeadingElement>
          <TextElement
            size="md"
            colorVariant="secondary"
            sx={{ maxWidth: 620, mx: "auto" }}
          >
            {data.subtitle}
          </TextElement>
        </StackColAlignJustCenter>

        <Grid container spacing={3.5}>
          {data.features.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: mdCols }} key={item.id}>
              <Paper
                elevation={1}
                sx={{
                  p: 3.5,
                  height: "100%",
                  borderRadius: RADIUS.md,
                  border: `1px solid ${COLOR.borderSecondary}`,
                  backgroundColor: COLOR.bgSecondary,
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 14px 28px rgba(183, 134, 40, 0.12)",
                    borderColor: COLOR.borderGold,
                    backgroundColor: COLOR.bgPaper,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: RADIUS.md,
                    background: item.colorVariant === "rose" ? COLOR.rose.gradient : COLOR.gold.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLOR.textInverse,
                    mb: 2.5,
                    boxShadow: SHADOW.sm,
                  }}
                >
                  <IconElement name={item.iconName} size="md" />
                </Box>

                <HeadingElement variant="h5" weight="bold" sx={{ mb: 1, fontSize: "1.15rem" }}>
                  {item.title}
                </HeadingElement>

                <TextElement size="sm" colorVariant="secondary" sx={{ lineHeight: 1.65 }}>
                  {item.description}
                </TextElement>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
