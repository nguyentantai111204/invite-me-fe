"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackCenter,
  StackCol,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
} from "@/components/shared";

interface ICanvasAssetsDrawerProps {
  onAddText: (preset?: { text: string; fontSize: number; fontFamily: string; fontWeight?: "bold" | "normal"; fill?: string; fontStyle?: "normal" | "italic" }) => void;
  onAddSticker: (emoji: string, size?: number) => void;
  onAddShape: (type: "rect" | "circle" | "divider") => void;
  onAddImage: (src: string) => void;
  onSetBackground: (color: string) => void;
}

type TabType = "text" | "stickers" | "shapes" | "uploads" | "backgrounds";

export const CanvasAssetsDrawer: React.FC<ICanvasAssetsDrawerProps> = ({
  onAddText,
  onAddSticker,
  onAddShape,
  onAddImage,
  onSetBackground,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [stickerFilter, setStickerFilter] = useState<"all" | "floral" | "rings" | "badges">("all");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onAddImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const navItems = [
    { id: "text" as TabType, label: "Mẫu Chữ", icon: "TextFormat" as const },
    { id: "stickers" as TabType, label: "Họa Tiết", icon: "AutoAwesome" as const },
    { id: "shapes" as TabType, label: "Khung Hình", icon: "Crop" as const },
    { id: "uploads" as TabType, label: "Tải Ảnh", icon: "CloudUpload" as const },
    { id: "backgrounds" as TabType, label: "Màu Nền", icon: "Palette" as const },
  ];

  return (
    <Box sx={{ display: "flex", height: "100%", backgroundColor: "#FFFFFF", zIndex: 20 }}>
      {/* Tier 1: Slim Vertical Icon Rail */}
      <Box
        sx={{
          width: 72,
          height: "100%",
          backgroundColor: "#FAF8F5",
          borderRight: "1px solid #ECE7DD",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          gap: 1,
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Box
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              sx={{
                width: 58,
                height: 58,
                borderRadius: RADIUS.md,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: isActive ? "#FFFFFF" : "transparent",
                color: isActive ? COLOR.gold.main : "#6D645A",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                border: isActive ? "1.5px solid #C59B4B" : "1px solid transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isActive ? "#FFFFFF" : "#F4EFE6",
                  color: COLOR.gold.main,
                },
              }}
            >
              <IconElement name={item.icon} size="sm" />
              <TextElement
                size="xs"
                weight={isActive ? "bold" : "medium"}
                sx={{
                  fontSize: "0.68rem",
                  mt: 0.5,
                  color: "inherit",
                }}
              >
                {item.label}
              </TextElement>
            </Box>
          );
        })}
      </Box>

      {/* Tier 2: Wide Asset Content Panel */}
      <Box
        sx={{
          width: { xs: 270, sm: 310 },
          height: "100%",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #ECE7DD",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          p: 2.5,
        }}
      >
        {/* Tab 0: Văn Bản (Text Presets & Typography) */}
        {activeTab === "text" && (
          <StackCol spacing={2.5}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1rem", letterSpacing: "0.02em" }}>
              THÊM THÀNH PHẦN
            </HeadingElement>

            {/* Section 1: VĂN BẢN MẪU */}
            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ letterSpacing: "0.05em", mb: 1 }}>
                VĂN BẢN MẪU
              </TextElement>

              <StackCol spacing={1}>
                {[
                  { icon: "💍", label: "Wedding Title", text: "LỄ THÀNH HÔN", size: 16, font: "'Playfair Display', serif", weight: "bold" as const },
                  { icon: "✍️", label: "Script Message", text: "Save The Date", size: 18, font: "'Great Vibes', cursive", weight: "normal" as const },
                  { icon: "💬", label: "Couple Message", text: "Minh Quân & Thanh Trúc", size: 24, font: "'Playfair Display', serif", weight: "bold" as const },
                ].map((item, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    onClick={() => onAddText({ text: item.text, fontSize: item.size, fontFamily: item.font, fontWeight: item.weight })}
                    sx={{
                      p: 1.25,
                      px: 2,
                      cursor: "pointer",
                      borderRadius: RADIUS.md,
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#F9FAFB",
                        borderColor: COLOR.gold.main,
                        transform: "translateX(3px)",
                      },
                    }}
                  >
                    <Box sx={{ fontSize: "1.1rem" }}>{item.icon}</Box>
                    <TextElement size="sm" weight="semibold">
                      {item.label}
                    </TextElement>
                  </Paper>
                ))}
              </StackCol>
            </Box>

            {/* Section 2: VĂN BẢN CHÍNH */}
            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ letterSpacing: "0.05em", mb: 1 }}>
                VĂN BẢN CHÍNH
              </TextElement>

              <StackCol spacing={1}>
                <Paper
                  elevation={0}
                  onClick={() => onAddText({ text: "Tiêu đề lớn", fontSize: 32, fontFamily: "'Playfair Display', serif", fontWeight: "bold" })}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderRadius: RADIUS.md,
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#F9FAFB",
                      borderColor: COLOR.gold.main,
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <HeadingElement variant="h4" fontFamilyType="serif" weight="bold" sx={{ fontSize: "1.6rem" }}>
                    Tiêu đề lớn
                  </HeadingElement>
                </Paper>

                <Paper
                  elevation={0}
                  onClick={() => onAddText({ text: "Trân trọng kính mời quý khách", fontSize: 13, fontFamily: "Inter, sans-serif", fontStyle: "italic" })}
                  sx={{
                    p: 1.5,
                    cursor: "pointer",
                    borderRadius: RADIUS.md,
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#F9FAFB",
                      borderColor: COLOR.gold.main,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <TextElement size="xs" colorVariant="secondary" sx={{ fontStyle: "italic" }}>
                    Trân trọng kính mời quý khách
                  </TextElement>
                </Paper>
              </StackCol>
            </Box>

            {/* Section 3: MẪU CHỮ CHỦ ĐỀ (2-Column Grid) */}
            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ letterSpacing: "0.05em", mb: 1 }}>
                MẪU CHỮ CHỦ ĐỀ
              </TextElement>

              <Grid container spacing={1}>
                {[
                  { tag: "Hoàng gia", preview: "Hoàng gia", font: "'Great Vibes', cursive", size: 20 },
                  { tag: "Thanh lịch", preview: "Thanh lịch", font: "'Playfair Display', serif", size: 16 },
                  { tag: "Nghệ thuật", preview: "Thanh lịch", font: "'Great Vibes', cursive", size: 20 },
                  { tag: "Sans Serif", preview: "Thanh Trúc", font: "Inter, sans-serif", size: 15 },
                ].map((item, idx) => (
                  <Grid size={{ xs: 6 }} key={idx}>
                    <Paper
                      elevation={0}
                      onClick={() => onAddText({ text: item.preview, fontSize: item.size, fontFamily: item.font, fontWeight: "bold" })}
                      sx={{
                        p: 1.5,
                        height: 70,
                        cursor: "pointer",
                        borderRadius: RADIUS.md,
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#FFFFFF",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#F9FAFB",
                          borderColor: COLOR.gold.main,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.62rem" }}>
                        {item.tag}
                      </TextElement>
                      <TextElement size="sm" weight="bold" sx={{ fontFamily: item.font, mt: 0.25, fontSize: item.size === 20 ? "1.05rem" : "0.85rem" }}>
                        {item.preview}
                      </TextElement>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </StackCol>
        )}

        {/* Tab 1: Stickers & Họa Tiết Cưới */}
        {activeTab === "stickers" && (
          <StackCol spacing={2}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1rem" }}>
              HỌA TIẾT & STICKERS
            </HeadingElement>

            {/* Filter Chips */}
            <StackRowAlignJustCenter spacing={0.5}>
              {[
                { id: "all", label: "Tất cả" },
                { id: "floral", label: "Hoa lá" },
                { id: "rings", label: "Nhẫn & Tim" },
                { id: "badges", label: "Hoàng Gia" },
              ].map((chip) => (
                <Chip
                  key={chip.id}
                  label={chip.label}
                  size="small"
                  onClick={() => setStickerFilter(chip.id as any)}
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: FONT_WEIGHT.semibold,
                    backgroundColor: stickerFilter === chip.id ? COLOR.gold.main : "#FAF9F6",
                    color: stickerFilter === chip.id ? "#FFFFFF" : "#554B3E",
                    border: "1px solid #ECE7DD",
                  }}
                />
              ))}
            </StackRowAlignJustCenter>

            {/* Floral */}
            {(stickerFilter === "all" || stickerFilter === "floral") && (
              <>
                <TextElement size="xs" weight="bold" colorVariant="gold">
                  HOA LÁ CƯỚI NGHỆ THUẬT
                </TextElement>
                <Grid container spacing={1}>
                  {["🌸", "🌹", "🌺", "🌷", "🌼", "🌿", "🍃", "💐", "🥀", "🌾", "🌻", "🏵️"].map((emoji, idx) => (
                    <Grid size={{ xs: 3 }} key={idx}>
                      <StackCenter
                        onClick={() => onAddSticker(emoji, 36)}
                        sx={{
                          height: 52,
                          fontSize: "1.6rem",
                          backgroundColor: "#FAF9F6",
                          borderRadius: RADIUS.md,
                          border: "1px solid #E5E7EB",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.15)",
                            backgroundColor: "#FFFFFF",
                            borderColor: COLOR.gold.main,
                            boxShadow: SHADOW.sm,
                          },
                        }}
                      >
                        {emoji}
                      </StackCenter>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Rings */}
            {(stickerFilter === "all" || stickerFilter === "rings") && (
              <>
                <TextElement size="xs" weight="bold" colorVariant="gold">
                  NHẪN CƯỚI & TÌNH YÊU
                </TextElement>
                <Grid container spacing={1}>
                  {["💍", "💖", "💗", "🕊️", "💌", "🥂", "🍾", "🎂"].map((emoji, idx) => (
                    <Grid size={{ xs: 3 }} key={idx}>
                      <StackCenter
                        onClick={() => onAddSticker(emoji, 36)}
                        sx={{
                          height: 52,
                          fontSize: "1.6rem",
                          backgroundColor: "#FAF9F6",
                          borderRadius: RADIUS.md,
                          border: "1px solid #E5E7EB",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.15)",
                            backgroundColor: "#FFFFFF",
                            borderColor: COLOR.gold.main,
                            boxShadow: SHADOW.sm,
                          },
                        }}
                      >
                        {emoji}
                      </StackCenter>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Badges */}
            {(stickerFilter === "all" || stickerFilter === "badges") && (
              <>
                <TextElement size="xs" weight="bold" colorVariant="gold">
                  HOÀNG GIA & VƯƠNG MIỆN
                </TextElement>
                <Grid container spacing={1}>
                  {["⚜️", "👑", "✨", "💎", "🌟", "💫", "🎆", "🎇"].map((emoji, idx) => (
                    <Grid size={{ xs: 3 }} key={idx}>
                      <StackCenter
                        onClick={() => onAddSticker(emoji, 36)}
                        sx={{
                          height: 52,
                          fontSize: "1.6rem",
                          backgroundColor: "#FAF9F6",
                          borderRadius: RADIUS.md,
                          border: "1px solid #E5E7EB",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.15)",
                            backgroundColor: "#FFFFFF",
                            borderColor: COLOR.gold.main,
                            boxShadow: SHADOW.sm,
                          },
                        }}
                      >
                        {emoji}
                      </StackCenter>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </StackCol>
        )}

        {/* Tab 2: Khung Viền & Hình Khối */}
        {activeTab === "shapes" && (
          <StackCol spacing={2}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1rem" }}>
              KHUNG VIỀN & HÌNH KHỐI
            </HeadingElement>

            <Paper
              elevation={0}
              onClick={() => onAddShape("divider")}
              sx={{
                p: 2,
                cursor: "pointer",
                borderRadius: RADIUS.md,
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": { borderColor: COLOR.gold.main, backgroundColor: "#F9FAFB" },
              }}
            >
              <Box sx={{ width: 40, height: 2, backgroundColor: "#B78628" }} />
              <TextElement size="sm" weight="bold">
                Dải Phân Cách Chỉ Vàng
              </TextElement>
            </Paper>

            <Paper
              elevation={0}
              onClick={() => onAddShape("rect")}
              sx={{
                p: 2,
                cursor: "pointer",
                borderRadius: RADIUS.md,
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": { borderColor: COLOR.gold.main, backgroundColor: "#F9FAFB" },
              }}
            >
              <Box sx={{ width: 28, height: 28, border: "2px solid #B78628", borderRadius: "4px" }} />
              <TextElement size="sm" weight="bold">
                Khung Chữ Nhật Bo Góc
              </TextElement>
            </Paper>

            <Paper
              elevation={0}
              onClick={() => onAddShape("circle")}
              sx={{
                p: 2,
                cursor: "pointer",
                borderRadius: RADIUS.md,
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": { borderColor: COLOR.gold.main, backgroundColor: "#F9FAFB" },
              }}
            >
              <Box sx={{ width: 28, height: 28, border: "2px solid #B78628", borderRadius: "50%" }} />
              <TextElement size="sm" weight="bold">
                Khung Tròn Chân Dung
              </TextElement>
            </Paper>
          </StackCol>
        )}

        {/* Tab 3: Tải Ảnh Cá Nhân */}
        {activeTab === "uploads" && (
          <StackCol spacing={2.5}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1rem" }}>
              TẢI ẢNH CƯỚI
            </HeadingElement>

            <ButtonElement
              component="label"
              variant="gradient"
              size="medium"
              fullWidth
              rounded="md"
              leftIcon={<IconElement name="CloudUpload" size="xs" />}
            >
              Chọn Ảnh Từ Thiết Bị
              <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
            </ButtonElement>

            <Divider />

            <TextElement size="xs" weight="bold" colorVariant="gold">
              ẢNH MẪU SẴN CÓ
            </TextElement>

            <Grid container spacing={1.5}>
              {[
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&auto=format&fit=crop",
              ].map((imgUrl, idx) => (
                <Grid size={{ xs: 6 }} key={idx}>
                  <Box
                    component="img"
                    src={imgUrl}
                    alt="Sample wedding"
                    onClick={() => onAddImage(imgUrl)}
                    sx={{
                      width: "100%",
                      height: 100,
                      objectFit: "cover",
                      borderRadius: RADIUS.md,
                      cursor: "pointer",
                      border: "1px solid #E5E7EB",
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "scale(1.04)", borderColor: COLOR.gold.main },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </StackCol>
        )}

        {/* Tab 4: Bảng Màu Nền */}
        {activeTab === "backgrounds" && (
          <StackCol spacing={2}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1rem" }}>
              MÀU NỀN THIỆP
            </HeadingElement>

            {[
              { name: "Trắng Hoàng Kim", color: "#FFFFFF", border: "#C59B4B" },
              { name: "Kem Ngọc Trai", color: "#FCFAF6", border: "#E0D1B9" },
              { name: "Hồng Pastel Lãng Mạn", color: "#FFF8F7", border: "#E58B7B" },
              { name: "Nhung Đỏ Cổ Điển", color: "#3B1117", border: "#8B1E2B" },
              { name: "Đêm Gala Tinh Tú", color: "#161B26", border: "#3A4D6B" },
              { name: "Xanh Rêu Vintage", color: "#F5F8F5", border: "#6B8E6B" },
            ].map((bg, idx) => (
              <Paper
                key={idx}
                elevation={0}
                onClick={() => onSetBackground(bg.color)}
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  borderRadius: RADIUS.md,
                  border: `2px solid ${bg.border}`,
                  backgroundColor: bg.color,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.02)", boxShadow: SHADOW.sm },
                }}
              >
                <Box sx={{ width: 28, height: 28, borderRadius: RADIUS.full, backgroundColor: bg.border }} />
                <TextElement size="sm" weight="bold" sx={{ color: bg.color === "#3B1117" || bg.color === "#161B26" ? "#FFFFFF" : "#2A231C" }}>
                  {bg.name}
                </TextElement>
              </Paper>
            ))}
          </StackCol>
        )}
      </Box>
    </Box>
  );
};
