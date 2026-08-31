"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import { siteConfig } from "@/config/site.config";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackRowAlignJustCenter,
  StackColAlignJustCenter,
} from "@/components/shared";

const NAV_LINKS = [
  { label: "Mẫu thiệp", href: "#templates" },
  { label: "Tính năng", href: "#features" },
  { label: "Quy trình", href: "#how-it-works" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "Đánh giá", href: "#testimonials" },
];

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(250, 248, 245, 0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${COLOR.borderGoldLight}`,
        color: COLOR.textPrimary,
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 72, justifyContent: "space-between" }}>
          {/* Brand Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: RADIUS.md,
                background: COLOR.gold.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLOR.textInverse,
                boxShadow: SHADOW.sm,
              }}
            >
              <IconElement name="AutoAwesome" size="sm" />
            </Box>
            <Box>
              <HeadingElement
                variant="h5"
                fontFamilyType="serif"
                weight="bold"
                colorVariant="primary"
                sx={{ lineHeight: 1.1, fontSize: "1.3rem" }}
              >
                {siteConfig.name}
              </HeadingElement>
              <TextElement size="xs" colorVariant="gold" weight="semibold" letterSpacingType="wider">
                LUXURY E-CARD
              </TextElement>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 4,
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  textDecoration: "none",
                  color: COLOR.textSecondary,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.gold.main)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.textSecondary)}
              >
                {link.label}
              </Link>
            ))}
          </Box>

          {/* Desktop CTA Action */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            <ButtonElement
              component={Link}
              href="/editor/demo-card"
              variant="gradient"
              size="medium"
              rounded="md"
              leftIcon={<IconElement name="AutoAwesome" size="xs" />}
            >
              Tạo Thiệp Ngay
            </ButtonElement>
          </Box>

          {/* Mobile Menu Toggle Button */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <IconElement name="Menu" size="md" />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              backgroundColor: COLOR.bgPrimary,
              p: 3,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <HeadingElement variant="h6" fontFamilyType="serif" weight="bold" colorVariant="primary">
            {siteConfig.name}
          </HeadingElement>
          <IconButton onClick={handleDrawerToggle} size="small">
            <IconElement name="Close" size="sm" />
          </IconButton>
        </Box>

        <List sx={{ mb: 3 }}>
          {NAV_LINKS.map((link) => (
            <ListItem key={link.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={link.href}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: RADIUS.md,
                  "&:hover": { backgroundColor: "rgba(183, 134, 40, 0.08)" },
                }}
              >
                <ListItemText
                  primary={
                    <TextElement size="md" weight="semibold" colorVariant="primary">
                      {link.label}
                    </TextElement>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <ButtonElement
          component={Link}
          href="/editor/demo-card"
          variant="gradient"
          fullWidth
          size="large"
          rounded="md"
          onClick={handleDrawerToggle}
          leftIcon={<IconElement name="AutoAwesome" size="sm" />}
        >
          Tạo Thiệp Ngay
        </ButtonElement>
      </Drawer>
    </AppBar>
  );
};
