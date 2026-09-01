"use client";

import React from "react";
import { Box, Container, Grid, Paper, Chip, Rating, Avatar } from "@mui/material";
import { ITestimonialsBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT, FONT_SIZE, ANIMATION, SPACING } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
  StackCol,
  STACK_COL_ALIGN_JUST_BETWEEN,
} from "@/components/shared";

interface ITestimonialsBlockProps {
  data: ITestimonialsBlockData;
  styles?: IBlockStyles;
}

export const TestimonialsBlock: React.FC<ITestimonialsBlockProps> = ({ data, styles }) => {
  return (
    <Box
      id="testimonials"
      sx={{
        backgroundColor: styles?.backgroundColor || COLOR.bgPaper,
        py: { xs: SPACING.px64, md: SPACING.px96 },
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        <StackColAlignJustCenter spacing={SPACING.px12} sx={{ textAlign: "center", mb: SPACING.px64 }}>
          {data.badge && (
            <Chip
              label={data.badge}
              size="small"
              sx={{
                backgroundColor: `${COLOR.gold.main}1A`,
                color: COLOR.textGold,
                fontWeight: FONT_WEIGHT.semibold,
                fontSize: FONT_SIZE.xs,
                mb: SPACING.px8,
              }}
            />
          )}
          <HeadingElement variant="h2" weight="bold">
            {data.title}
          </HeadingElement>
          <TextElement size="md" colorVariant="secondary" sx={{ maxWidth: 600 }}>
            {data.subtitle}
          </TextElement>
        </StackColAlignJustCenter>

        <Grid container spacing={SPACING.px28}>
          {data.testimonials.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.id}>
              <Paper
                elevation={1}
                sx={{
                  ...STACK_COL_ALIGN_JUST_BETWEEN,
                  p: SPACING.px28,
                  height: "100%",
                  borderRadius: RADIUS.md,
                  border: `1px solid ${COLOR.borderSecondary}`,
                  backgroundColor: COLOR.bgSecondary,
                  transition: ANIMATION.md,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: SHADOW.md,
                    borderColor: COLOR.borderGold,
                    backgroundColor: COLOR.bgPaper,
                  },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Rating value={item.rating} readOnly size="small" sx={{ color: COLOR.gold.main, mb: SPACING.px16 }} />
                  <TextElement size="sm" colorVariant="primary" sx={{ fontStyle: "italic", lineHeight: 1.7, mb: SPACING.px24 }}>
                    &ldquo;{item.comment}&rdquo;
                  </TextElement>
                </Box>

                <StackRowAlignJustCenter spacing={SPACING.px16} sx={{ width: "100%", pt: SPACING.px16, borderTop: `1px solid ${COLOR.divider}` }}>
                  <Avatar
                    src={item.avatar}
                    alt={item.coupleName}
                    sx={{ width: 44, height: 44, border: `2px solid ${COLOR.gold.light}` }}
                  />
                  <StackCol spacing={0.25}>
                    <HeadingElement variant="h6" weight="bold">
                      {item.coupleName}
                    </HeadingElement>
                    <TextElement size="xs" colorVariant="secondary">
                      {item.event}
                    </TextElement>
                  </StackCol>
                </StackRowAlignJustCenter>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
