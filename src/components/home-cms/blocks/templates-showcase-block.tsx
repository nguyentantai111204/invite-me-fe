"use client";

import React, { useState } from "react";
import { Box, Container, Grid, Paper, Chip, Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { ITemplatesBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW, FONT_SIZE, FONT_WEIGHT } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
  StackCol,
  STACK_COL_ALIGN_JUST_BETWEEN,
  STACK_COL_ALIGN_JUST_CENTER,
} from "@/components/shared";

interface ITemplatesShowcaseBlockProps {
  data: ITemplatesBlockData;
  styles?: IBlockStyles;
}

interface ITemplateVisualTheme {
  bgGradient: string;
  cardBg: string;
  borderColor: string;
  accentColor: string;
  ornamentColor: string;
  couple: string;
  invitationText: string;
  date: string;
  venue: string;
  themeName: string;
  usesCount: string;
  isDark?: boolean;
}

const TEMPLATE_THUMB_STYLES: Record<string, ITemplateVisualTheme> = {
  "tpl-1": {
    bgGradient: "radial-gradient(ellipse at 50% 30%, #FFFDF7 0%, #F5EFEB 100%)",
    cardBg: "#FFFDF9",
    borderColor: "#D4AF37",
    accentColor: "#B78628",
    ornamentColor: "#D4AF37",
    couple: "Minh Quân & Thanh Trúc",
    invitationText: "TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH",
    date: "Chủ Nhật • 20 . 11 . 2026",
    venue: "Park Hyatt Saigon • Ballroom Hall",
    themeName: "Royal Gold Foil",
    usesCount: "2,480+ lượt tạo",
  },
  "tpl-2": {
    bgGradient: "radial-gradient(ellipse at 50% 30%, #FFF9FA 0%, #FCEAEB 100%)",
    cardBg: "#FFFDFC",
    borderColor: "#E58B7B",
    accentColor: "#DE7C66",
    ornamentColor: "#E58B7B",
    couple: "Tuấn Kiệt & Quỳnh Như",
    invitationText: "LỄ THÀNH HÔN & TIỆC CƯỚI",
    date: "Thứ Bảy • 12 . 12 . 2026",
    venue: "The Adora Luxury • TP.HCM",
    themeName: "Rose Pastel Velvet",
    usesCount: "1,890+ lượt tạo",
  },
  "tpl-3": {
    bgGradient: "radial-gradient(ellipse at 50% 30%, #F8FAFC 0%, #EDF2F7 100%)",
    cardBg: "#FFFFFF",
    borderColor: "#94A3B8",
    accentColor: "#334155",
    ornamentColor: "#64748B",
    couple: "Văn Hậu & Hải My",
    invitationText: "TOGETHER WITH THEIR FAMILIES",
    date: "Chủ Nhật • 08 . 01 . 2027",
    venue: "JW Marriott Hotel • Hà Nội",
    themeName: "Nordic Minimalist",
    usesCount: "1,420+ lượt tạo",
  },
  "tpl-4": {
    bgGradient: "radial-gradient(ellipse at 50% 30%, #FFFBF0 0%, #FEF3C7 100%)",
    cardBg: "#FFFDF5",
    borderColor: "#F59E0B",
    accentColor: "#D97706",
    ornamentColor: "#F59E0B",
    couple: "Gia Bảo - 18th Birthday",
    invitationText: "MỜI BẠN TỚI DỰ DẠ TIỆC SINH NHẬT",
    date: "Thứ Sáu • 15 . 03 . 2027",
    venue: "Skyline Lounge • Landmark 81",
    themeName: "Luxury Gala Party",
    usesCount: "980+ lượt tạo",
  },
  "tpl-5": {
    bgGradient: "radial-gradient(ellipse at 50% 30%, #FDF4FF 0%, #FAE8FF 100%)",
    cardBg: "#FFFFFF",
    borderColor: "#C084FC",
    accentColor: "#9333EA",
    ornamentColor: "#C084FC",
    couple: "Bé Gạo - Tròn 1 Tuổi",
    invitationText: "TIỆC MỪNG THÔI NÔI BÉ YÊU",
    date: "Chủ Nhật • 24 . 04 . 2027",
    venue: "Trung tâm Hội nghị Capella",
    themeName: "Sweet Baby Cloud",
    usesCount: "1,150+ lượt tạo",
  },
  "tpl-6": {
    bgGradient: "radial-gradient(ellipse at 50% 30%, #1E293B 0%, #0F172A 100%)",
    cardBg: "#161F30",
    borderColor: "#D4AF37",
    accentColor: "#FDE047",
    ornamentColor: "#D4AF37",
    couple: "TechNova Annual Gala",
    invitationText: "DẠ TIỆC TRI ÂN & VINH DANH",
    date: "Thứ Năm • 31 . 12 . 2026",
    venue: "InterContinental Saigon",
    themeName: "Midnight Gold Event",
    usesCount: "760+ lượt tạo",
    isDark: true,
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
        {/* Section Heading */}
        <StackColAlignJustCenter spacing={1.5} sx={{ textAlign: "center", mb: 5 }}>
          {data.badge && (
            <Chip
              label={data.badge}
              size="small"
              sx={{
                backgroundColor: "rgba(183, 134, 40, 0.1)",
                color: COLOR.textGold,
                fontWeight: FONT_WEIGHT.semibold,
                fontSize: FONT_SIZE.xs,
                mb: 1,
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
                fontWeight: FONT_WEIGHT.semibold,
                fontSize: FONT_SIZE.sm,
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

        {/* Templates Grid with Pure CSS Hover Overlay */}
        <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
          {filteredTemplates.map((template) => {
            const visual = TEMPLATE_THUMB_STYLES[template.id] || {
              bgGradient: "radial-gradient(ellipse at 50% 30%, #FFFDF7 0%, #F5EFEB 100%)",
              cardBg: "#FFFDF9",
              borderColor: COLOR.gold.main,
              accentColor: COLOR.gold.main,
              ornamentColor: COLOR.gold.main,
              couple: template.title,
              invitationText: "TRÂN TRỌNG KÍNH MỜI",
              date: "2026",
              venue: "Grand Ballroom",
              themeName: template.category,
              usesCount: "1,000+ lượt tạo",
            };

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id} sx={{ display: "flex" }}>
                <Paper
                  elevation={2}
                  sx={{
                    ...STACK_COL_ALIGN_JUST_BETWEEN,
                    width: "100%",
                    height: "100%",
                    borderRadius: RADIUS.lg,
                    overflow: "hidden",
                    border: `1.5px solid ${COLOR.borderGoldLight}`,
                    backgroundColor: COLOR.bgPaper,
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: COLOR.gold.main,
                      boxShadow: "0 20px 38px rgba(183, 134, 40, 0.22)",
                      "& .template-hover-overlay": {
                        opacity: 1,
                        visibility: "visible",
                        transform: "translateY(0px)",
                      },
                    },
                  }}
                >
                  {/* Visual Portrait Card Area */}
                  <Box
                    sx={{
                      ...STACK_COL_ALIGN_JUST_CENTER,
                      width: "100%",
                      height: 330,
                      background: visual.bgGradient,
                      p: 2.5,
                      position: "relative",
                      borderBottom: `1px solid ${COLOR.divider}`,
                      overflow: "hidden",
                    }}
                  >
                    {/* Top Badges */}
                    <Box sx={{ position: "absolute", top: 14, left: 14, zIndex: 4 }}>
                      {template.isNew && (
                        <Chip
                          label="MẪU MỚI"
                          size="small"
                          sx={{
                            backgroundColor: COLOR.gold.main,
                            color: COLOR.textInverse,
                            fontWeight: FONT_WEIGHT.bold,
                            fontSize: "0.68rem",
                            letterSpacing: "0.05em",
                            boxShadow: SHADOW.sm,
                          }}
                        />
                      )}
                      {template.isPopular && (
                        <Chip
                          label="HOT TREND"
                          size="small"
                          sx={{
                            backgroundColor: COLOR.rose.main,
                            color: COLOR.textInverse,
                            fontWeight: FONT_WEIGHT.bold,
                            fontSize: "0.68rem",
                            letterSpacing: "0.05em",
                            boxShadow: SHADOW.sm,
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ position: "absolute", top: 14, right: 14, zIndex: 4 }}>
                      <Chip
                        icon={<IconElement name="Favorite" size="xs" color={COLOR.rose.main} />}
                        label={visual.usesCount}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(4px)",
                          color: COLOR.textSecondary,
                          fontWeight: FONT_WEIGHT.semibold,
                          fontSize: "0.68rem",
                          border: `1px solid ${COLOR.borderGoldLight}`,
                        }}
                      />
                    </Box>

                    {/* Ornate Luxury Inner Frame */}
                    <StackColAlignJustCenter
                      sx={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: visual.cardBg,
                        border: `1.5px solid ${visual.borderColor}`,
                        borderRadius: RADIUS.md,
                        p: 3,
                        textAlign: "center",
                        position: "relative",
                        boxShadow: "inset 0 0 20px rgba(0,0,0,0.02)",
                      }}
                    >
                      {/* Corner Ornaments */}
                      <Box sx={{ position: "absolute", top: 6, left: 6, fontSize: "0.75rem", color: visual.ornamentColor, opacity: 0.7 }}>⚜️</Box>
                      <Box sx={{ position: "absolute", top: 6, right: 6, fontSize: "0.75rem", color: visual.ornamentColor, opacity: 0.7 }}>⚜️</Box>
                      <Box sx={{ position: "absolute", bottom: 6, left: 6, fontSize: "0.75rem", color: visual.ornamentColor, opacity: 0.7 }}>⚜️</Box>
                      <Box sx={{ position: "absolute", bottom: 6, right: 6, fontSize: "0.75rem", color: visual.ornamentColor, opacity: 0.7 }}>⚜️</Box>

                      {/* Header Text */}
                      <TextElement
                        size="xs"
                        weight="bold"
                        letterSpacingType="wider"
                        sx={{
                          color: visual.accentColor,
                          textTransform: "uppercase",
                          fontSize: "0.68rem",
                          mb: 1.5,
                        }}
                      >
                        {visual.invitationText}
                      </TextElement>

                      {/* Couple / Hero Title with Luxury Serif */}
                      <HeadingElement
                        variant="h4"
                        fontFamilyType="serif"
                        weight="bold"
                        sx={{
                          color: visual.isDark ? "#FFFFFF" : COLOR.textPrimary,
                          lineHeight: 1.25,
                          fontSize: "1.35rem",
                          my: 1,
                        }}
                      >
                        {visual.couple}
                      </HeadingElement>

                      {/* Delicate Gold Floral Divider */}
                      <StackRowAlignJustCenter spacing={1} sx={{ my: 1.5, width: "60%" }}>
                        <Box sx={{ flex: 1, height: "1px", backgroundColor: `${visual.borderColor}60` }} />
                        <Box sx={{ color: visual.ornamentColor, fontSize: "0.85rem", lineHeight: 1 }}>✨</Box>
                        <Box sx={{ flex: 1, height: "1px", backgroundColor: `${visual.borderColor}60` }} />
                      </StackRowAlignJustCenter>

                      {/* Date & Venue */}
                      <TextElement
                        size="xs"
                        weight="bold"
                        sx={{
                          color: visual.accentColor,
                          letterSpacing: "0.08em",
                          mb: 0.5,
                        }}
                      >
                        {visual.date}
                      </TextElement>

                      <TextElement
                        size="xs"
                        colorVariant="secondary"
                        sx={{
                          fontSize: "0.75rem",
                          fontStyle: "italic",
                          opacity: 0.85,
                          maxWidth: 220,
                        }}
                      >
                        {visual.venue}
                      </TextElement>
                    </StackColAlignJustCenter>

                    {/* Robust Pure CSS Frosted Glass Hover Overlay */}
                    <Box
                      className="template-hover-overlay"
                      sx={{
                        ...STACK_COL_ALIGN_JUST_CENTER,
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(26, 22, 18, 0.45)",
                        backdropFilter: "blur(3px)",
                        p: 3,
                        gap: 1.5,
                        zIndex: 10,
                        opacity: 0,
                        visibility: "hidden",
                        transform: "translateY(10px)",
                        transition: "all 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <ButtonElement
                        component={Link}
                        href={`/editor/${template.demoSlug}`}
                        variant="gradient"
                        fullWidth
                        size="medium"
                        rounded="md"
                        leftIcon={<IconElement name="AutoAwesome" size="xs" />}
                        sx={{ boxShadow: "0 6px 16px rgba(0,0,0,0.3)" }}
                      >
                        Dùng Mẫu Này
                      </ButtonElement>

                      <ButtonElement
                        component={Link}
                        href={`/editor/${template.demoSlug}`}
                        variant="outline"
                        fullWidth
                        size="medium"
                        rounded="md"
                        sx={{
                          borderColor: "#FFFFFF",
                          color: "#FFFFFF",
                          backgroundColor: "rgba(26, 22, 18, 0.4)",
                          backdropFilter: "blur(4px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                          "&:hover": {
                            backgroundColor: "rgba(26, 22, 18, 0.7)",
                            borderColor: "#FFFFFF",
                          },
                        }}
                        leftIcon={<IconElement name="Visibility" size="xs" />}
                      >
                        Xem Thử Hiệu Ứng 3D
                      </ButtonElement>
                    </Box>
                  </Box>

                  {/* Card Bottom Meta */}
                  <Box sx={{ p: 2.5, width: "100%", backgroundColor: COLOR.bgPaper }}>
                    <StackRowAlignJustCenter sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <StackCol spacing={0.25} sx={{ minHeight: 44, justifyContent: "center" }}>
                        <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1.05rem" }}>
                          {template.title}
                        </HeadingElement>
                        <TextElement size="xs" colorVariant="secondary">
                          {template.category} • <Box component="span" sx={{ color: COLOR.gold.main, fontWeight: 600 }}>{visual.themeName}</Box>
                        </TextElement>
                      </StackCol>

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
