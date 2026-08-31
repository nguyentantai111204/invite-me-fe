"use client";

import React from "react";
import { Box, Container, Grid, Paper, Chip, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { IPricingBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
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

        <Grid container spacing={3.5} sx={{ alignItems: "stretch" }}>
          {data.plans.map((plan) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
              <Paper
                elevation={plan.isPopular ? 6 : 2}
                sx={{
                  ...STACK_COL_ALIGN_JUST_BETWEEN,
                  p: 4,
                  height: "100%",
                  borderRadius: RADIUS.lg,
                  border: plan.isPopular
                    ? `2px solid ${COLOR.gold.main}`
                    : `1px solid ${COLOR.borderGoldLight}`,
                  backgroundColor: COLOR.bgPaper,
                  position: "relative",
                  transition: "all 0.3s ease",
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
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                <Box>
                  <HeadingElement variant="h4" weight="bold">
                    {plan.name}
                  </HeadingElement>

                  <TextElement size="sm" colorVariant="secondary" sx={{ mb: 2.5, minHeight: 40 }}>
                    {plan.description}
                  </TextElement>

                  <Box sx={{ display: "flex", alignItems: "baseline", mb: 3 }}>
                    <HeadingElement variant="h2" weight="extrabold" gradient="gold">
                      {plan.price}
                    </HeadingElement>
                    <TextElement size="sm" colorVariant="secondary" sx={{ ml: 1 }}>
                      {plan.period}
                    </TextElement>
                  </Box>

                  <List sx={{ mb: 4, py: 0 }}>
                    {plan.features.map((feat, fIdx) => (
                      <ListItem key={fIdx} disableGutters sx={{ py: 0.8 }}>
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
