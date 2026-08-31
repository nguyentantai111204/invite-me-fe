"use client";

import React, { useState } from "react";
import { Box, Container, Grid, Paper, Chip } from "@mui/material";
import Link from "next/link";
import { IFeaturesBlockData, IBlockStyles } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT, FONT_SIZE } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
  StackCenter,
  StackCol,
  STACK_COL_ALIGN_JUST_BETWEEN,
  STACK_COL_ALIGN_JUST_START,
} from "@/components/shared";

interface IFeaturesBlockProps {
  data: IFeaturesBlockData;
  styles?: IBlockStyles;
}

export const FeaturesBlock: React.FC<IFeaturesBlockProps> = ({ data, styles }) => {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  return (
    <Box
      id="features"
      sx={{
        backgroundColor: styles?.backgroundColor || COLOR.bgPaper,
        py: { xs: 8, md: 12 },
        position: "relative",
      }}
    >
      <Container maxWidth={styles?.containerMaxWidth || "lg"}>
        {/* Section Header */}
        <StackColAlignJustCenter spacing={1.5} sx={{ textAlign: "center", mb: 8 }}>
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
          <TextElement
            size="md"
            colorVariant="secondary"
            sx={{ maxWidth: 640, mx: "auto" }}
          >
            {data.subtitle}
          </TextElement>
        </StackColAlignJustCenter>

        {/* Bento Grid Architecture */}
        <Grid container spacing={3.5}>
          {/* Bento 1 (Hero Bento - Col 8): 3D Interactive Envelope */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={2}
              sx={{
                ...STACK_COL_ALIGN_JUST_BETWEEN,
                p: { xs: 3.5, md: 4.5 },
                height: "100%",
                minHeight: 380,
                borderRadius: RADIUS.lg,
                border: `1.5px solid ${COLOR.borderGoldLight}`,
                background: `linear-gradient(135deg, ${COLOR.bgSecondary} 0%, #FAF4EB 100%)`,
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 18px 36px rgba(183, 134, 40, 0.14)",
                  borderColor: COLOR.gold.main,
                },
              }}
            >
              <Grid container spacing={4} sx={{ alignItems: "center", height: "100%" }}>
                {/* Text & Action */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <StackCol spacing={2}>
                    <Chip
                      icon={<IconElement name="AutoAwesome" size="xs" color={COLOR.textGold} />}
                      label="CÔNG NGHỆ 3D TƯƠNG TÁC"
                      size="small"
                      sx={{
                        width: "fit-content",
                        backgroundColor: "rgba(183, 134, 40, 0.12)",
                        color: COLOR.textGold,
                        fontWeight: FONT_WEIGHT.bold,
                        fontSize: "0.68rem",
                      }}
                    />

                    <HeadingElement variant="h3" weight="bold" sx={{ lineHeight: 1.2 }}>
                      Mở phong bì 3D & Rút thiệp chân thực
                    </HeadingElement>

                    <TextElement size="sm" colorVariant="secondary" sx={{ lineHeight: 1.7 }}>
                      Khách mời chạm để mở nắp phong bì, rút cánh thiệp và chiêm ngưỡng toàn bộ câu chuyện tình yêu với chuyển động mượt mà như cầm thiệp giấy cao cấp trên tay.
                    </TextElement>

                    <ButtonElement
                      variant="outline"
                      size="medium"
                      rounded="md"
                      onClick={() => setEnvelopeOpen(!envelopeOpen)}
                      leftIcon={<IconElement name={envelopeOpen ? "VisibilityOff" : "Visibility"} size="xs" />}
                      sx={{ width: "fit-content", mt: 1 }}
                    >
                      {envelopeOpen ? "Đóng nắp phong bì" : "Bấm thử mở thiệp 3D"}
                    </ButtonElement>
                  </StackCol>
                </Grid>

                {/* 3D Envelope Interactive Visual */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <StackCenter sx={{ position: "relative", height: 260 }}>
                    {/* Envelope Base Box */}
                    <Box
                      sx={{
                        width: 220,
                        height: 150,
                        backgroundColor: "#E8D8C3",
                        borderRadius: RADIUS.sm,
                        border: `1.5px solid ${COLOR.borderGold}`,
                        position: "relative",
                        boxShadow: SHADOW.lg,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* Flap Triangle */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 60,
                          backgroundColor: "#DFCAB0",
                          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                          transformOrigin: "top center",
                          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: envelopeOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                          zIndex: envelopeOpen ? 1 : 4,
                          borderBottom: `1px solid ${COLOR.borderGold}`,
                        }}
                      />

                      {/* Red Wax Seal */}
                      {!envelopeOpen && (
                        <StackCenter
                          sx={{
                            position: "absolute",
                            top: 45,
                            width: 32,
                            height: 32,
                            borderRadius: RADIUS.full,
                            backgroundColor: "#A82424",
                            color: "#FFFFFF",
                            boxShadow: SHADOW.md,
                            zIndex: 5,
                            border: "1.5px solid #781515",
                          }}
                        >
                          <IconElement name="Favorite" size="xs" />
                        </StackCenter>
                      )}

                      {/* Sliding Letter Card Inside */}
                      <Box
                        sx={{
                          position: "absolute",
                          width: 190,
                          height: 130,
                          backgroundColor: "#FFFFFF",
                          borderRadius: RADIUS.xs,
                          border: `1px solid ${COLOR.borderGold}`,
                          p: 1.5,
                          textAlign: "center",
                          boxShadow: SHADOW.md,
                          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: envelopeOpen ? "translateY(-65px)" : "translateY(0px)",
                          zIndex: 3,
                        }}
                      >
                        <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest">
                          SAVE THE DATE
                        </TextElement>
                        <HeadingElement variant="h6" fontFamilyType="serif" weight="bold" sx={{ my: 0.5 }}>
                          Minh Quân & Thanh Trúc
                        </HeadingElement>
                        <TextElement size="xs" colorVariant="secondary">
                          20 • 11 • 2026
                        </TextElement>
                      </Box>
                    </Box>
                  </StackCenter>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Bento 2 (Col 4): Nhạc Nền BGM & Giai Điệu Lãng Mạn */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={2}
              sx={{
                ...STACK_COL_ALIGN_JUST_BETWEEN,
                p: 3.5,
                height: "100%",
                borderRadius: RADIUS.lg,
                border: `1.5px solid ${COLOR.borderGoldLight}`,
                background: `linear-gradient(135deg, #FFF9FA 0%, #FCEAEB 100%)`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 18px 36px rgba(222, 124, 102, 0.15)",
                  borderColor: COLOR.rose.main,
                },
              }}
            >
              <Box>
                <StackRowAlignJustBetween sx={{ mb: 2 }}>
                  <StackCenter
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: RADIUS.md,
                      background: COLOR.rose.gradient,
                      color: COLOR.textInverse,
                      boxShadow: SHADOW.sm,
                    }}
                  >
                    <IconElement name="MusicNote" size="md" />
                  </StackCenter>
                  <Chip label="BGM PRO" size="small" sx={{ backgroundColor: COLOR.rose[100], color: COLOR.rose.main, fontWeight: "bold" }} />
                </StackRowAlignJustBetween>

                <HeadingElement variant="h5" weight="bold" sx={{ mb: 1 }}>
                  Nhạc nền lãng mạn tự chọn
                </HeadingElement>

                <TextElement size="sm" colorVariant="secondary" sx={{ lineHeight: 1.65 }}>
                  Giai điệu du dương tự động phát khi khách mở thiệp, gợi cảm xúc ngọt ngào ngay từ giây phút đầu tiên.
                </TextElement>
              </Box>

              {/* Mini Audio Track Playlist Simulation */}
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: RADIUS.md,
                  p: 2,
                  mt: 3,
                  border: `1px solid rgba(222, 124, 102, 0.2)`,
                }}
              >
                <StackRowAlignJustCenter spacing={1.5}>
                  <StackCenter
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: RADIUS.full,
                      backgroundColor: COLOR.rose.main,
                      color: "#FFFFFF",
                    }}
                  >
                    <IconElement name="PlayArrow" size="xs" />
                  </StackCenter>
                  <StackCol spacing={0}>
                    <TextElement size="xs" weight="bold" colorVariant="primary">
                      Until I Found You
                    </TextElement>
                    <TextElement size="xs" colorVariant="secondary">
                      Stephen Sanchez • Wedding Acoustic
                    </TextElement>
                  </StackCol>
                </StackRowAlignJustCenter>
              </Box>
            </Paper>
          </Grid>

          {/* Bento 3 (Col 4): Quản lý RSVP & Đếm Khách Thông Minh */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={2}
              sx={{
                ...STACK_COL_ALIGN_JUST_BETWEEN,
                p: 3.5,
                height: "100%",
                borderRadius: RADIUS.lg,
                border: `1.5px solid ${COLOR.borderGoldLight}`,
                backgroundColor: COLOR.bgPaper,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 18px 36px rgba(183, 134, 40, 0.14)",
                  borderColor: COLOR.gold.main,
                },
              }}
            >
              <Box>
                <StackCenter
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: RADIUS.md,
                    background: COLOR.gold.gradient,
                    color: COLOR.textInverse,
                    mb: 2.5,
                    boxShadow: SHADOW.sm,
                  }}
                >
                  <IconElement name="CheckCircle" size="md" />
                </StackCenter>

                <HeadingElement variant="h5" weight="bold" sx={{ mb: 1 }}>
                  Xác nhận RSVP thông minh
                </HeadingElement>

                <TextElement size="sm" colorVariant="secondary" sx={{ lineHeight: 1.65 }}>
                  Thu thập câu trả lời tham dự, số người đi kèm và lời chúc trực tiếp để chủ tiệc chuẩn bị chu đáo nhất.
                </TextElement>
              </Box>

              {/* RSVP Live Stats Badge */}
              <Box
                sx={{
                  backgroundColor: COLOR.bgSecondary,
                  borderRadius: RADIUS.md,
                  p: 2,
                  mt: 3,
                  border: `1px solid ${COLOR.borderGoldLight}`,
                }}
              >
                <StackRowAlignJustBetween sx={{ mb: 1 }}>
                  <TextElement size="xs" weight="semibold" colorVariant="secondary">
                    Tỷ lệ xác nhận:
                  </TextElement>
                  <TextElement size="xs" weight="bold" colorVariant="gold">
                    94.2%
                  </TextElement>
                </StackRowAlignJustBetween>
                <Box sx={{ width: "100%", height: 6, backgroundColor: "#E5DCD0", borderRadius: RADIUS.full, overflow: "hidden" }}>
                  <Box sx={{ width: "94.2%", height: "100%", background: COLOR.btnGradient, borderRadius: RADIUS.full }} />
                </Box>
                <TextElement size="xs" colorVariant="secondary" sx={{ mt: 1, textAlign: "center" }}>
                  ✨ 186 khách đã xác nhận tham dự
                </TextElement>
              </Box>
            </Paper>
          </Grid>

          {/* Bento 4 (Col 4): Mừng Cưới QR VietQR Tiện Lợi */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={2}
              sx={{
                ...STACK_COL_ALIGN_JUST_BETWEEN,
                p: 3.5,
                height: "100%",
                borderRadius: RADIUS.lg,
                border: `1.5px solid ${COLOR.borderGoldLight}`,
                backgroundColor: COLOR.bgPaper,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 18px 36px rgba(183, 134, 40, 0.14)",
                  borderColor: COLOR.gold.main,
                },
              }}
            >
              <Box>
                <StackCenter
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: RADIUS.md,
                    background: COLOR.gold.gradient,
                    color: COLOR.textInverse,
                    mb: 2.5,
                    boxShadow: SHADOW.sm,
                  }}
                >
                  <IconElement name="QrCode" size="md" />
                </StackCenter>

                <HeadingElement variant="h5" weight="bold" sx={{ mb: 1 }}>
                  Mừng cưới QR VietQR 1 chạm
                </HeadingElement>

                <TextElement size="sm" colorVariant="secondary" sx={{ lineHeight: 1.65 }}>
                  Tích hợp mã QR ngân hàng riêng của cô dâu chú rể, giúp khách ở xa gửi trọn vẹn tình cảm chúc phúc.
                </TextElement>
              </Box>

              {/* VietQR Preview Box */}
              <Box
                sx={{
                  backgroundColor: "#F4EFE6",
                  borderRadius: RADIUS.md,
                  p: 2,
                  mt: 3,
                  border: `1px solid ${COLOR.borderGoldLight}`,
                }}
              >
                <StackRowAlignJustCenter spacing={1.5}>
                  <StackCenter
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: RADIUS.xs,
                      backgroundColor: "#FFFFFF",
                      border: `1px solid ${COLOR.borderGold}`,
                      color: COLOR.gold.main,
                    }}
                  >
                    <IconElement name="QrCode" size="sm" />
                  </StackCenter>
                  <StackCol spacing={0}>
                    <TextElement size="xs" weight="bold" colorVariant="primary">
                      Vietcombank • 1018899999
                    </TextElement>
                    <TextElement size="xs" colorVariant="gold" weight="semibold">
                      Quét mã gửi phong bì mừng cưới
                    </TextElement>
                  </StackCol>
                </StackRowAlignJustCenter>
              </Box>
            </Paper>
          </Grid>

          {/* Bento 5 (Col 4): Album Ảnh Cưới & Chia Sẻ Đa Kênh */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={2}
              sx={{
                ...STACK_COL_ALIGN_JUST_BETWEEN,
                p: 3.5,
                height: "100%",
                borderRadius: RADIUS.lg,
                border: `1.5px solid ${COLOR.borderGoldLight}`,
                backgroundColor: COLOR.bgPaper,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 18px 36px rgba(183, 134, 40, 0.14)",
                  borderColor: COLOR.gold.main,
                },
              }}
            >
              <Box>
                <StackCenter
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: RADIUS.md,
                    background: COLOR.rose.gradient,
                    color: COLOR.textInverse,
                    mb: 2.5,
                    boxShadow: SHADOW.sm,
                  }}
                >
                  <IconElement name="Send" size="md" />
                </StackCenter>

                <HeadingElement variant="h5" weight="bold" sx={{ mb: 1 }}>
                  Chia sẻ 1 chạm & Album HD
                </HeadingElement>

                <TextElement size="sm" colorVariant="secondary" sx={{ lineHeight: 1.65 }}>
                  Gửi link thiệp kèm tên từng khách mời qua Zalo, Messenger, SMS và trình diễn trọn vẹn album ảnh cưới HD.
                </TextElement>
              </Box>

              {/* Multi-channel Share Badges */}
              <StackRowAlignJustCenter spacing={1} sx={{ mt: 3, flexWrap: "wrap", justifyContent: "center" }}>
                {["Zalo", "Messenger", "Facebook", "SMS"].map((channel) => (
                  <Chip
                    key={channel}
                    label={`Gửi qua ${channel}`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(183, 134, 40, 0.08)",
                      color: COLOR.textPrimary,
                      fontWeight: FONT_WEIGHT.semibold,
                      fontSize: "0.72rem",
                    }}
                  />
                ))}
              </StackRowAlignJustCenter>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
