"use client";

import React from "react";
import { Box, Container, Grid } from "@mui/material";
import Link from "next/link";
import { COLOR, RADIUS, FONT_SIZE, FONT_WEIGHT } from "@/constants/style.constant";
import { siteConfig } from "@/config/site.config";
import {
  HeadingElement,
  TextElement,
  IconElement,
  StackCenter,
  StackCol,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
} from "@/components/shared";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: COLOR.bgDark,
        color: COLOR.textMutedWhite,
        pt: 8,
        pb: 4,
        borderRadius: 0,
        borderTop: `1px solid ${COLOR.borderGoldLight}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ mb: 6 }}>
          {/* Brand Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StackCol spacing={2.5}>
              <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "inline-flex" }}>
                <StackRowAlignJustCenter spacing={1.5} sx={{ justifyContent: "flex-start" }}>
                  <StackCenter
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: RADIUS.md,
                      background: COLOR.gold.gradient,
                      color: COLOR.textInverse,
                    }}
                  >
                    <IconElement name="AutoAwesome" size="xs" />
                  </StackCenter>
                  <HeadingElement
                    variant="h5"
                    fontFamilyType="serif"
                    weight="bold"
                    colorVariant="white"
                  >
                    {siteConfig.name}
                  </HeadingElement>
                </StackRowAlignJustCenter>
              </Link>

              <TextElement size="sm" colorVariant="muted" sx={{ lineHeight: 1.7, maxWidth: 320 }}>
                {siteConfig.description}
              </TextElement>

              <TextElement size="xs" colorVariant="gold" weight="semibold">
                Email hỗ trợ: {siteConfig.links.supportEmail}
              </TextElement>
            </StackCol>
          </Grid>

          {/* Column 2: Mẫu thiệp */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <HeadingElement variant="h6" weight="bold" colorVariant="white" sx={{ mb: 2 }}>
              Mẫu Thiệp Mời
            </HeadingElement>
            <StackCol spacing={1.2}>
              {["Thiệp Cưới Hoàng Gia", "Thiệp Cưới Vintage", "Thiệp Sinh Nhật", "Thiệp Thôi Nôi", "Thiệp Sự Kiện Gala"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#templates"
                    style={{
                      textDecoration: "none",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: FONT_SIZE.sm,
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.gold.light)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")}
                  >
                    {item}
                  </Link>
                )
              )}
            </StackCol>
          </Grid>

          {/* Column 3: Tính năng */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <HeadingElement variant="h6" weight="bold" colorVariant="white" sx={{ mb: 2 }}>
              Tính Năng
            </HeadingElement>
            <StackCol spacing={1.2}>
              {["Mở phong bì 3D", "Nhạc nền lãng mạn", "Xác nhận RSVP online", "QR Mừng cưới VietQR", "Album ảnh cưới HD", "Bản đồ chỉ đường"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#features"
                    style={{
                      textDecoration: "none",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: FONT_SIZE.sm,
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.gold.light)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")}
                  >
                    {item}
                  </Link>
                )
              )}
            </StackCol>
          </Grid>

          {/* Column 4: Hỗ trợ */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <HeadingElement variant="h6" weight="bold" colorVariant="white" sx={{ mb: 2 }}>
              Hỗ Trợ & Điều Khoản
            </HeadingElement>
            <StackCol spacing={1.2}>
              {["Hướng dẫn tạo thiệp", "Bảng giá & Thanh toán", "Chính sách bảo mật", "Điều khoản sử dụng", "Liên hệ hợp tác Studio"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    style={{
                      textDecoration: "none",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: FONT_SIZE.sm,
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.gold.light)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")}
                  >
                    {item}
                  </Link>
                )
              )}
            </StackCol>
          </Grid>
        </Grid>

        {/* Bottom Copyright */}
        <Box
          sx={{
            pt: 3,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <StackRowAlignJustBetween sx={{ flexWrap: "wrap", gap: 2 }}>
            <TextElement size="xs" colorVariant="muted">
              Copyright © {currentYear} {siteConfig.name}. Tất cả các quyền được bảo lưu.
            </TextElement>

            <TextElement size="xs" colorVariant="muted">
              Designed with ❤️ for Vietnamese Weddings & Events
            </TextElement>
          </StackRowAlignJustBetween>
        </Box>
      </Container>
    </Box>
  );
};
