"use client";

import React from "react";
import { Box, Container, Grid, Paper, Chip, Rating, Avatar } from "@mui/material";
import { ITestimonialsBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
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
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        <StackColAlignJustCenter spacing={1.5} sx={{ textAlign: "center", mb: 8 }}>
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
          <TextElement size="md" colorVariant="secondary" sx={{ maxWidth: 600 }}>
            {data.subtitle}
          </TextElement>
        </StackColAlignJustCenter>

        <Grid container spacing={3.5}>
          {data.testimonials.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.id}>
              <Paper
                elevation={1}
                sx={{
                  ...STACK_COL_ALIGN_JUST_BETWEEN,
                  p: 3.5,
                  height: "100%",
                  borderRadius: RADIUS.lg,
                  border: `1px solid ${COLOR.borderSecondary}`,
                  backgroundColor: COLOR.bgSecondary,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: SHADOW.md,
                    borderColor: COLOR.borderGold,
                    backgroundColor: COLOR.bgPaper,
                  },
                }}
              >
                <Box>
                  <Rating value={item.rating} readOnly size="small" sx={{ color: COLOR.gold.main, mb: 2 }} />
                  <TextElement size="sm" colorVariant="primary" sx={{ fontStyle: "italic", lineHeight: 1.7, mb: 3 }}>
                    &ldquo;{item.comment}&rdquo;
                  </TextElement>
                </Box>

                <StackRowAlignJustCenter spacing={2} sx={{ pt: 2, borderTop: `1px solid ${COLOR.divider}` }}>
                  <Avatar
                    src={item.avatar}
                    alt={item.coupleName}
                    sx={{ width: 44, height: 44, border: `2px solid ${COLOR.gold.light}` }}
                  />
                  <Box>
                    <HeadingElement variant="h6" weight="bold">
                      {item.coupleName}
                    </HeadingElement>
                    <TextElement size="xs" colorVariant="secondary">
                      {item.event}
                    </TextElement>
                  </Box>
                </StackRowAlignJustCenter>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
