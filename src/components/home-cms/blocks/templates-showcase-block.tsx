"use client";

import React, { useState } from "react";
import { Box, Container, Grid, Paper, Chip, Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { ITemplatesBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
} from "@/components/shared";

interface ITemplatesShowcaseBlockProps {
  data: ITemplatesBlockData;
  styles?: IBlockStyles;
}

// Preset visual palettes for realistic luxury template thumbnails
const TEMPLATE_THUMB_STYLES: Record<
  string,
  {
    bgGradient: string;
    borderColor: string;
    accentColor: string;
    couple: string;
    date: string;
    themeName: string;
  }
> = {
  "tpl-1": {
    bgGradient: "linear-gradient(145deg, #FFFDF9 0%, #F5EFEB 100%)",
    borderColor: "#D4AF37",
    accentColor: "#B78628",
    couple: "Minh Quân & Thanh Trúc",
    date: "20 • 11 • 2026",
    themeName: "Royal Gold Foil",
  },
  "tpl-2": {
    bgGradient: "linear-gradient(145deg, #FFF9FA 0%, #FCEAEB 100%)",
    borderColor: "#E58B7B",
    accentColor: "#DE7C66",
    couple: "Tuấn Kiệt & Quỳnh Như",
    date: "12 • 12 • 2026",
    themeName: "Rose Pastel Velvet",
  },
  "tpl-3": {
    bgGradient: "linear-gradient(145deg, #F8FAFC 0%, #EDF2F7 100%)",
    borderColor: "#94A3B8",
    accentColor: "#475569",
    couple: "Văn Hậu & Hải My",
    date: "08 • 01 • 2027",
    themeName: "Nordic Minimalist",
  },
  "tpl-4": {
    bgGradient: "linear-gradient(145deg, #FFFBF0 0%, #FEF3C7 100%)",
    borderColor: "#F59E0B",
    accentColor: "#D97706",
    couple: "Gia Bảo - 18th Birthday",
    date: "15 • 03 • 2027",
    themeName: "Luxury Gala Party",
  },
  "tpl-5": {
    bgGradient: "linear-gradient(145deg, #FDF4FF 0%, #FAE8FF 100%)",
    borderColor: "#C084FC",
    accentColor: "#9333EA",
    couple: "Bé Gạo - Tròn 1 Tuổi",
    date: "24 • 04 • 2027",
    themeName: "Sweet Baby Cloud",
  },
  "tpl-6": {
    bgGradient: "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)",
    borderColor: "#D4AF37",
    accentColor: "#FDE047",
    couple: "TechNova Annual Gala",
    date: "31 • 12 • 2026",
    themeName: "Midnight Gold Event",
  },
};

export const TemplatesShowcaseBlock: React.FC<ITemplatesShowcaseBlockProps> = ({
  data,
  styles,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  const categories = ["Tất cả", ...(data.categories || [])];

  const filteredTemplates =
    selectedCategory === "Tất cả"
      ? data.templates
      : data.templates.filter((t) => t.category === selectedCategory);

  return (
    <Box
      id="templates"
      sx={{
        backgroundColor: styles?.backgroundColor || COLOR.bgPrimary,
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        <StackColAlignJustCenter spacing={1.5} sx={{ textAlign: "center", mb: 5 }}>
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

        {/* Categories Tab */}
        <StackRowAlignJustCenter sx={{ mb: 6, justifyContent: "center" }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              backgroundColor: "rgba(183, 134, 40, 0.06)",
              p: 0.5,
              borderRadius: RADIUS.full,
              border: `1px solid ${COLOR.borderGoldLight}`,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: RADIUS.full,
                minHeight: 38,
                px: 3,
                mx: 0.25,
                color: COLOR.textSecondary,
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  color: COLOR.textInverse,
                  backgroundColor: COLOR.btnPrimary,
                  boxShadow: SHADOW.sm,
                },
              },
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat} label={cat} value={cat} />
            ))}
          </Tabs>
        </StackRowAlignJustCenter>

        {/* Templates Grid */}
        <Grid container spacing={3.5}>
          {filteredTemplates.map((template) => {
            const thumb = TEMPLATE_THUMB_STYLES[template.id] || {
              bgGradient: "linear-gradient(145deg, #FFFDF9 0%, #F5EFEB 100%)",
              borderColor: COLOR.gold.main,
              accentColor: COLOR.gold.main,
              couple: template.title,
              date: "2026",
              themeName: template.category,
            };

            const isDarkCard = template.id === "tpl-6";

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                <Paper
                  elevation={1}
                  sx={{
                    borderRadius: RADIUS.md,
                    overflow: "hidden",
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    transition: "all 0.3s ease",
                    backgroundColor: COLOR.bgPaper,
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 28px rgba(183, 134, 40, 0.15)",
                      borderColor: COLOR.gold.main,
                    },
                  }}
                >
                  {/* Realistic E-Card Visual Mockup */}
                  <Box
                    sx={{
                      height: 250,
                      background: thumb.bgGradient,
                      p: 2.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      borderBottom: `1px solid ${COLOR.divider}`,
                      color: isDarkCard ? "#FFFFFF" : COLOR.textPrimary,
                    }}
                  >
                    {template.isNew && (
                      <Chip
                        label="MỚI"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          backgroundColor: COLOR.gold.main,
                          color: COLOR.textInverse,
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          boxShadow: SHADOW.sm,
                        }}
                      />
                    )}
                    {template.isPopular && (
                      <Chip
                        label="HOT"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          backgroundColor: COLOR.rose.main,
                          color: COLOR.textInverse,
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          boxShadow: SHADOW.sm,
                        }}
                      />
                    )}

                    {/* Ornate Frame Border */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        border: `1px solid ${thumb.borderColor}40`,
                        borderRadius: RADIUS.sm,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        backgroundColor: isDarkCard ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.65)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <TextElement
                        size="xs"
                        weight="bold"
                        letterSpacingType="widest"
                        sx={{
                          color: thumb.accentColor,
                          textTransform: "uppercase",
                          fontSize: "0.68rem",
                          mb: 1,
                        }}
                      >
                        SAVE THE DATE
                      </TextElement>

                      <HeadingElement
                        variant="h5"
                        fontFamilyType="serif"
                        weight="bold"
                        sx={{
                          color: isDarkCard ? "#FFFFFF" : COLOR.textPrimary,
                          lineHeight: 1.3,
                          fontSize: "1.2rem",
                          my: 0.5,
                        }}
                      >
                        {thumb.couple}
                      </HeadingElement>

                      <Box
                        sx={{
                          width: 36,
                          height: 1,
                          backgroundColor: thumb.borderColor,
                          my: 1,
                        }}
                      />

                      <TextElement
                        size="xs"
                        weight="semibold"
                        sx={{
                          color: thumb.accentColor,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {thumb.date}
                      </TextElement>
                    </Box>
                  </Box>

                  {/* Card Bottom Meta & Actions */}
                  <Box sx={{ p: 2.5 }}>
                    <StackRowAlignJustCenter sx={{ justifyContent: "space-between" }}>
                      <Box>
                        <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1rem" }}>
                          {template.title}
                        </HeadingElement>
                        <TextElement size="xs" colorVariant="secondary">
                          {template.category} • {thumb.themeName}
                        </TextElement>
                      </Box>

                      <ButtonElement
                        component={Link}
                        href={`/editor/${template.demoSlug}`}
                        variant="outline"
                        size="small"
                        rounded="md"
                        leftIcon={<IconElement name="Edit" size="xs" />}
                      >
                        Dùng mẫu
                      </ButtonElement>
                    </StackRowAlignJustCenter>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
