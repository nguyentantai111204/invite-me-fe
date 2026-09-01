"use client";

import React from "react";
import { Box, Container, Grid, Paper, Chip } from "@mui/material";
import Link from "next/link";
import { IHeroBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT, FONT_SIZE, ANIMATION, SPACING } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
  StackCenter,
} from "@/components/shared";

interface IHeroBlockProps {
  data: IHeroBlockData;
  styles?: IBlockStyles;
}

export const HeroBlock: React.FC<IHeroBlockProps> = ({ data, styles }) => {
  return (
    <Box
      id="hero"
      sx={{
        background: styles?.bgGradient || `radial-gradient(ellipse at 50% 20%, rgba(212, 175, 55, 0.12) 0%, ${COLOR.bgPrimary} 70%)`,
        py: { xs: SPACING.px64, md: SPACING.px80 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              {data.badgeText && (
                <Chip
                  icon={<IconElement name="AutoAwesome" size="xs" color={COLOR.textGold} />}
                  label={data.badgeText}
                  sx={{
                    backgroundColor: `${COLOR.gold.main}1A`,
                    border: `1px solid ${COLOR.borderGold}`,
                    color: COLOR.textGold,
                    fontWeight: FONT_WEIGHT.semibold,
                    fontSize: FONT_SIZE.xs,
                    mb: SPACING.px24,
                    px: SPACING.px8,
                  }}
                />
              )}

              <HeadingElement
                variant="h1"
                weight="extrabold"
                sx={{
                  lineHeight: 1.15,
                  mb: 2.5,
                }}
              >
                {data.title}{" "}
                {data.highlightText && (
                  <Box
                    component="span"
                    sx={{
                      backgroundImage: COLOR.gold.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      display: "inline",
                    }}
                  >
                    {data.highlightText}
                  </Box>
                )}
              </HeadingElement>

              <TextElement
                size="lg"
                colorVariant="secondary"
                sx={{
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: 580,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                {data.subtitle}
              </TextElement>

              <StackRowAlignJustCenter
                spacing={SPACING.px16}
                sx={{
                  justifyContent: { xs: "center", md: "flex-start" },
                  flexWrap: "wrap",
                  gap: SPACING.px16,
                  mb: SPACING.px40,
                }}
              >
                {data.primaryButton?.show && (
                  <ButtonElement
                    component={Link}
                    href={data.primaryButton.link}
                    variant={data.primaryButton.variant || "gradient"}
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
                    variant={data.secondaryButton.variant || "outline"}
                    size="large"
                    rounded="md"
                    leftIcon={
                      data.secondaryButton.iconName ? (
                        <IconElement name={data.secondaryButton.iconName} size="sm" />
                      ) : undefined
                    }
                    sx={{ px: 3.5, py: 1.5 }}
                  >
                    {data.secondaryButton.text}
                  </ButtonElement>
                )}
              </StackRowAlignJustCenter>

              {data.stats && data.stats.length > 0 && (
                <Grid container spacing={3} sx={{ pt: 2, borderTop: `1px solid ${COLOR.divider}` }}>
                  {data.stats.map((stat, idx) => (
                    <Grid size={{ xs: 4 }} key={idx}>
                      <HeadingElement variant="h4" weight="extrabold" gradient="gold">
                        {stat.value}
                      </HeadingElement>
                      <TextElement size="xs" colorVariant="secondary">
                        {stat.label}
                      </TextElement>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <StackCenter sx={{ position: "relative" }}>
              {/* Luxury Wedding Card Mockup */}
              <Paper
                elevation={6}
                sx={{
                  width: "100%",
                  maxWidth: 380,
                  borderRadius: RADIUS.md,
                  border: `1.5px solid ${COLOR.borderGold}`,
                  overflow: "hidden",
                  boxShadow: SHADOW.xl,
                  background: COLOR.bgPaper,
                  transition: ANIMATION.md,
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 20px 30px ${COLOR.gold.main}2E`,
                  },
                }}
              >
                {/* Gold Envelope Header */}
                <Box
                  sx={{
                    background: COLOR.btnGradient,
                    color: COLOR.textInverse,
                    py: 2,
                    px: 3,
                    textAlign: "center",
                  }}
                >
                  <TextElement size="xs" weight="bold" colorVariant="white" letterSpacingType="mega">
                    SAVE THE DATE
                  </TextElement>
                </Box>

                {/* Card Inner Content */}
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <StackColAlignJustCenter spacing={1.5}>
                    <StackCenter
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: RADIUS.full,
                        backgroundColor: COLOR.rose[50],
                        color: COLOR.rose.main,
                        mb: 1,
                      }}
                    >
                      <IconElement name="Favorite" size="sm" />
                    </StackCenter>

                    <HeadingElement
                      variant="h4"
                      fontFamilyType="serif"
                      weight="bold"
                      colorVariant="primary"
                    >
                      {data.previewCard?.groomName || "Minh Quân"} & {data.previewCard?.brideName || "Thanh Trúc"}
                    </HeadingElement>

                    <Box
                      sx={{
                        width: 48,
                        height: 1.5,
                        backgroundColor: COLOR.gold.main,
                        my: 1,
                      }}
                    />

                    <TextElement size="sm" weight="bold" colorVariant="gold" letterSpacingType="wider">
                      {data.previewCard?.weddingDate || "20 • 11 • 2026"}
                    </TextElement>

                    <TextElement size="xs" colorVariant="secondary" sx={{ fontStyle: "italic", maxWidth: 260 }}>
                      {data.previewCard?.venue || "Trung tâm Hội nghị Khách sạn Park Hyatt Sài Gòn"}
                    </TextElement>

                    <ButtonElement
                      component={Link}
                      href="/editor/demo-card"
                      variant="outline"
                      size="small"
                      rounded="md"
                      leftIcon={<IconElement name="Visibility" size="xs" />}
                      sx={{ mt: 2 }}
                    >
                      Mở Thiệp 3D Trực Tiếp
                    </ButtonElement>
                  </StackColAlignJustCenter>
                </Box>
              </Paper>
            </StackCenter>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
