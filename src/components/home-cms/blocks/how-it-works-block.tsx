"use client";

import React from "react";
import { Box, Container, Grid, Paper, Chip } from "@mui/material";
import Link from "next/link";
import { IHowItWorksBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT, FONT_SIZE, ANIMATION, SPACING } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
  StackCenter,
  STACK_COL_ALIGN_JUST_START,
} from "@/components/shared";

interface IHowItWorksBlockProps {
  data: IHowItWorksBlockData;
  styles?: IBlockStyles;
}

export const HowItWorksBlock: React.FC<IHowItWorksBlockProps> = ({ data, styles }) => {
  return (
    <Box
      id="how-it-works"
      sx={{
        backgroundColor: styles?.backgroundColor || COLOR.bgPaper,
        py: { xs: SPACING.px64, md: SPACING.px104 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        {/* Section Header */}
        <StackColAlignJustCenter spacing={SPACING.px12} sx={{ textAlign: "center", mb: { xs: SPACING.px48, md: SPACING.px80 } }}>
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
          <TextElement size="md" colorVariant="secondary" sx={{ maxWidth: 620 }}>
            {data.subtitle}
          </TextElement>
        </StackColAlignJustCenter>

        {/* Horizontal Zig-Zag Staggered Flow */}
        <Box sx={{ position: "relative", pt: { md: 2 }, pb: { md: 3 } }}>
          {/* Subtle Undulating Connector Line on Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: "42%",
              left: "10%",
              right: "10%",
              height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${COLOR.borderGold} 15%, ${COLOR.borderGold} 85%, transparent 100%)`,
              zIndex: 0,
            }}
          />

          <Grid container spacing={3.5} sx={{ position: "relative", zIndex: 1, alignItems: "stretch" }}>
            {data.steps.map((step, idx) => {
              // Zig-zag offset: Bước 1 & 3 nâng nhẹ lên (-16px), Bước 2 & 4 hạ nhẹ xuống (+18px)
              const isOffsetDown = idx % 2 === 1;

              return (
                <Grid
                  size={{ xs: 12, sm: 6, md: 3 }}
                  key={idx}
                  sx={{
                    display: "flex",
                    transform: {
                      xs: "none",
                      md: isOffsetDown ? "translateY(20px)" : "translateY(-16px)",
                    },
                    transition: "transform 0.4s ease",
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      ...STACK_COL_ALIGN_JUST_START,
                      p: SPACING.px28,
                      width: "100%",
                      height: "100%",
                      borderRadius: RADIUS.lg,
                      border: `1.5px solid ${COLOR.borderGoldLight}`,
                      textAlign: "center",
                      alignItems: "center",
                      backgroundColor: COLOR.bgPaper,
                      position: "relative",
                      transition: ANIMATION.md,
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 18px 36px ${COLOR.gold.main}26`,
                        borderColor: COLOR.gold.main,
                      },
                    }}
                  >
                    {/* Step Number Badge */}
                    <StackCenter
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: RADIUS.full,
                        background: COLOR.btnGradient,
                        color: COLOR.textInverse,
                        fontWeight: FONT_WEIGHT.extrabold,
                        fontSize: FONT_SIZE.md,
                        mb: 2.5,
                        boxShadow: SHADOW.md,
                        border: `3px solid ${COLOR.bgPaper}`,
                      }}
                    >
                      {step.stepNumber}
                    </StackCenter>

                    {/* Step Icon Container */}
                    <StackCenter
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: RADIUS.md,
                        backgroundColor: `${COLOR.gold.main}14`,
                        color: COLOR.textGold,
                        mb: 2,
                        transition: ANIMATION.md,
                      }}
                    >
                      <IconElement name={step.iconName} size="md" />
                    </StackCenter>

                    <HeadingElement variant="h5" weight="bold" sx={{ mb: 1, fontSize: "1.15rem" }}>
                      {step.title}
                    </HeadingElement>

                    <TextElement size="sm" colorVariant="secondary" sx={{ lineHeight: 1.65 }}>
                      {step.description}
                    </TextElement>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Bottom CTA Button */}
        {data.ctaButton?.show && (
          <Box sx={{ textAlign: "center", mt: { xs: SPACING.px48, md: SPACING.px64 } }}>
            <ButtonElement
              component={Link}
              href={data.ctaButton.link}
              variant={data.ctaButton.variant || "gradient"}
              size="large"
              rounded="md"
              leftIcon={
                data.ctaButton.iconName ? (
                  <IconElement name={data.ctaButton.iconName} size="sm" />
                ) : undefined
              }
              sx={{ px: 4, py: 1.5 }}
            >
              {data.ctaButton.text}
            </ButtonElement>
          </Box>
        )}
      </Container>
    </Box>
  );
};
