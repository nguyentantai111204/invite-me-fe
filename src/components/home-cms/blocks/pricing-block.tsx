"use client";

import React from "react";
import { Box, Container, Grid, Paper, Chip, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { IPricingBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT, FONT_SIZE, ANIMATION, SPACING } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
  StackRow,
  STACK_COL_ALIGN_JUST_BETWEEN,
} from "@/components/shared";

interface IPricingBlockProps {
  data: IPricingBlockData;
  styles?: IBlockStyles;
}

export const PricingBlock: React.FC<IPricingBlockProps> = ({ data, styles }) => {
  return (
    <Box
      id="pricing"
      sx={{
        backgroundColor: styles?.backgroundColor || COLOR.bgPrimary,
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

        <Grid container spacing={3.5} sx={{ alignItems: "stretch" }}>
          {data.plans.map((plan) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
              <Paper
                elevation={plan.isPopular ? 6 : 2}
                sx={{
                  ...STACK_COL_ALIGN_JUST_BETWEEN,
                  p: SPACING.px32,
                  height: "100%",
                  borderRadius: RADIUS.lg,
                  border: plan.isPopular
                    ? `2px solid ${COLOR.gold.main}`
                    : `1px solid ${COLOR.borderGoldLight}`,
                  backgroundColor: COLOR.bgPaper,
                  position: "relative",
                  transition: ANIMATION.md,
                  transform: plan.isPopular ? { md: "scale(1.04)" } : "none",
                  "&:hover": {
                    boxShadow: SHADOW.lg,
                  },
                }}
              >
                {plan.badge && (
                  <Chip
                    label={plan.badge}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: COLOR.btnSecondary,
                      color: COLOR.textInverse,
                      fontWeight: FONT_WEIGHT.bold,
                      fontSize: FONT_SIZE.xs,
                    }}
                  />
                )}

                <Box sx={{ width: "100%" }}>
                  <HeadingElement variant="h4" weight="bold">
                    {plan.name}
                  </HeadingElement>

                  <TextElement size="sm" colorVariant="secondary" sx={{ mb: 2.5, minHeight: 40 }}>
                    {plan.description}
                  </TextElement>

                  <StackRow sx={{ alignItems: "baseline", mb: 3 }}>
                    <HeadingElement variant="h2" weight="extrabold" gradient="gold">
                      {plan.price}
                    </HeadingElement>
                    <TextElement size="sm" colorVariant="secondary" sx={{ ml: SPACING.px8 }}>
                      {plan.period}
                    </TextElement>
                  </StackRow>

                  <List sx={{ mb: SPACING.px32, py: 0 }}>
                    {plan.features.map((feat, fIdx) => (
                      <ListItem key={fIdx} disableGutters sx={{ py: SPACING.px8 }}>
                        <ListItemIcon sx={{ minWidth: 28, color: feat.included ? COLOR.gold.main : COLOR.textDisabled }}>
                          <IconElement
                            name={feat.included ? "CheckCircle" : "Remove"}
                            size="sm"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <TextElement
                              size="sm"
                              colorVariant={feat.included ? "primary" : "muted"}
                              sx={{
                                textDecoration: feat.included ? "none" : "line-through",
                              }}
                            >
                              {feat.text}
                            </TextElement>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <ButtonElement
                  component={Link}
                  href={plan.button.link}
                  variant={plan.button.variant || (plan.isPopular ? "gradient" : "outline")}
                  fullWidth
                  size="large"
                  rounded="md"
                >
                  {plan.button.text}
                </ButtonElement>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
