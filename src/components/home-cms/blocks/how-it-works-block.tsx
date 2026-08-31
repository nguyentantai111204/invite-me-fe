"use client";

import React from "react";
import { Box, Container, Grid, Paper, Chip } from "@mui/material";
import Link from "next/link";
import { IHowItWorksBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
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
        py: { xs: 8, md: 12 },
        position: "relative",
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

        <Box sx={{ position: "relative" }}>
          {/* Subtle Golden Connector Line on Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 48,
              left: "12%",
              right: "12%",
              height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${COLOR.borderGold} 20%, ${COLOR.borderGold} 80%, transparent 100%)`,
              zIndex: 0,
            }}
          />

          <Grid container spacing={4} sx={{ position: "relative", zIndex: 1 }}>
            {data.steps.map((step, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3.5,
                    height: "100%",
                    borderRadius: RADIUS.md,
                    border: `1px solid ${COLOR.borderSecondary}`,
                    textAlign: "center",
                    backgroundColor: COLOR.bgSecondary,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 24px rgba(183, 134, 40, 0.12)",
                      borderColor: COLOR.borderGold,
                      backgroundColor: COLOR.bgPaper,
                    },
                  }}
                >
                  {/* Step Number Circle */}
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: RADIUS.full,
                      background: COLOR.btnGradient,
                      color: COLOR.textInverse,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      mb: 2.5,
                      boxShadow: SHADOW.sm,
                      border: "3px solid #FFFFFF",
                    }}
                  >
                    {step.stepNumber}
                  </Box>

                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: RADIUS.md,
                      backgroundColor: "rgba(183, 134, 40, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLOR.textGold,
                      mb: 2,
                    }}
                  >
                    <IconElement name={step.iconName} size="md" />
                  </Box>

                  <HeadingElement variant="h5" weight="bold" sx={{ mb: 1, fontSize: "1.1rem" }}>
                    {step.title}
                  </HeadingElement>

                  <TextElement size="sm" colorVariant="secondary" sx={{ lineHeight: 1.6 }}>
                    {step.description}
                  </TextElement>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {data.ctaButton?.show && (
          <Box sx={{ textAlign: "center", mt: 7 }}>
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
              sx={{ px: 4, py: 1.5, fontSize: "1rem" }}
            >
              {data.ctaButton.text}
            </ButtonElement>
          </Box>
        )}
      </Container>
    </Box>
  );
};
