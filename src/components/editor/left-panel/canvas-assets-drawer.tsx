"use client";

import React, { useState } from "react";
import { Box, Grid, Chip, Divider, Tooltip } from "@mui/material";
import {
  CanvasOpeningEffectType,
  CanvasAmbientParticleType,
} from "@/interfaces/canvas-editor.interface";
import {
  COLOR,
  RADIUS,
  SHADOW,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  ANIMATION,
} from "@/constants/style.constant";
import {
  CARD_ITEM_SX,
  SELECTABLE_ITEM_SX,
  PANEL_RAIL_SX,
  PANEL_CONTENT_SX,
} from "../editor.styles";
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
  openingEffect?: CanvasOpeningEffectType;
  ambientParticle?: CanvasAmbientParticleType;
  onSetOpeningEffect?: (effect: CanvasOpeningEffectType) => void;
  onSetAmbientParticle?: (particle: CanvasAmbientParticleType) => void;
  onAddText: (preset?: { text: string; fontSize: number; fontFamily: string; fontWeight?: "bold" | "normal"; fill?: string; fontStyle?: "normal" | "italic" }) => void;
  onAddSticker: (emoji: string, size?: number) => void;
  onAddShape: (type: "rect" | "circle" | "divider") => void;
  onAddImage: (src: string) => void;
  onSetBackground: (color: string) => void;
}

type TabType = "text" | "stickers" | "effects" | "shapes" | "uploads" | "backgrounds";

// Navigation tabs
const NAV_ITEMS: { id: TabType; label: string; icon: Parameters<typeof IconElement>[0]["name"]; tip: string }[] = [
  { id: "text",        label: "Mẫu Chữ",   icon: "TextFormat",   tip: "Chèn tiêu đề, lời mời, ngày cưới" },
  { id: "stickers",   label: "Họa Tiết",   icon: "Favorite",     tip: "Sticker hoa lá, nhẫn cưới, biểu tượng" },
  { id: "effects",    label: "Hiệu Ứng",   icon: "AutoAwesome",  tip: "Hiệu ứng mở bìa 3D & mưa hoa/bụi vàng" },
  { id: "shapes",     label: "Khung Hình", icon: "Crop",         tip: "Khung chân dung, khung viền, dải phân cách" },
  { id: "uploads",    label: "Tải Ảnh",    icon: "CloudUpload",  tip: "Tải ảnh cưới của bạn hoặc chọn ảnh mẫu" },
  { id: "backgrounds",label: "Màu Nền",    icon: "Palette",      tip: "Tông màu nền thiệp sang trọng & mã HEX" },
];

const STICKER_CATEGORIES = [
  { id: "floral",  label: "Hoa lá & Cành",   emojis: ["🌸","🌹","🌺","🌷","🌼","🌿","🍃","💐","🥀","🌾","🌻","🏵️"] },
  { id: "rings",   label: "Nhẫn & Tình Yêu", emojis: ["💍","💖","💗","🕊️","💌","🥂","🍾","🎂"] },
  { id: "badges",  label: "Vương Miện & Sao", emojis: ["⚜️","👑","✨","💎","🌟","💫","🎆","🎇"] },
] as const;

const TEXT_PRESETS = [
  { icon: "💍", tag: "Tiêu đề chính", label: "LỄ THÀNH HÔN",           size: 16, font: "'Playfair Display', serif", weight: "bold"   as const, fill: COLOR.gold.main },
  { icon: "✍️", tag: "Dòng nghệ thuật", label: "Save The Date",       size: 20, font: "'Great Vibes', cursive",     weight: "normal" as const, fill: COLOR.textPrimary },
  { icon: "💬", tag: "Tên cặp đôi",     label: "Minh Quân & Thanh Trúc", size: 24, font: "'Playfair Display', serif", weight: "bold"   as const, fill: COLOR.textPrimary },
  { icon: "📅", tag: "Thời gian",       label: "CHỦ NHẬT • 20.11.2026", size: 14, font: "Inter, sans-serif",          weight: "bold"   as const, fill: COLOR.gold.main },
  { icon: "📍", tag: "Địa điểm tiệc",   label: "Park Hyatt Saigon • TP.HCM", size: 13, font: "Inter, sans-serif",    weight: "normal" as const, fill: COLOR.textSecondary },
];

const OPENING_EFFECTS: { id: CanvasOpeningEffectType; icon: string; title: string; desc: string; badge: string }[] = [
  { id: "envelope-3d", icon: "💌", title: "Mở Phong Bì Hoàng Gia 3D", desc: "Mở con dấu sáp niêm phong, thiệp trượt êm ra ngoài", badge: "Phổ biến nhất" },
  { id: "gate-fold",   icon: "✨", title: "Cánh Cổng Hoàng Kim 3D",   desc: "Hai cánh cửa vàng son mở sang 2 bên như cung điện", badge: "Sang trọng" },
  { id: "scroll",      icon: "📜", title: "Cuộn Thư Hoàng Cung",      desc: "Trục thư cổ điển tự động mở rộng theo phương dọc", badge: "Cổ điển" },
  { id: "fade",        icon: "💫", title: "Màn Mờ Ảo Tinh Tế",        desc: "Chuyển cảnh mượt mà, phù hợp thiệp phong cách tối giản", badge: "Nhẹ nhàng" },
];

const AMBIENT_PARTICLES: { id: CanvasAmbientParticleType; icon: string; label: string; desc: string }[] = [
  { id: "sakura",    icon: "🌸", label: "Mưa Hoa Đào",    desc: "Cánh hoa đào rơi nhẹ nhàng lãng mạn" },
  { id: "gold-dust", icon: "✨", label: "Bụi Kim Tuyến",  desc: "Hạt vàng lấp lánh sang trọng" },
  { id: "hearts",    icon: "💖", label: "Trái Tim Bay",   desc: "Bong bóng trái tim ấm áp" },
  { id: "snow",      icon: "❄️", label: "Tuyết Cổ Tích",  desc: "Bông tuyết trắng tinh khôi" },
  { id: "none",      icon: "🚫", label: "Tắt Hiệu Ứng",   desc: "Giữ thiệp tĩnh, không chuyển động" },
];

const BG_PRESETS = [
  { name: "Trắng Hoàng Kim",    color: "#FFFFFF", border: "#C59B4B", dot: "#B78628", desc: "Tinh khôi, quyền quý" },
  { name: "Kem Ngọc Trai",      color: "#FCFAF6", border: "#E0D1B9", dot: "#D4AF37", desc: "Ấm áp, trang nhã" },
  { name: "Hồng Pastel",        color: "#FFF8F7", border: "#E58B7B", dot: "#DE7C66", desc: "Ngọt ngào, trẻ trung" },
  { name: "Nhung Đỏ Cổ Điển",   color: "#3B1117", border: "#8B1E2B", dot: "#8B1E2B", desc: "Truyền thống, may mắn" },
  { name: "Đêm Gala Tinh Tú",   color: "#161B26", border: "#3A4D6B", dot: "#3A4D6B", desc: "Huyền bí, hiện đại" },
  { name: "Xanh Rêu Vintage",   color: "#F5F8F5", border: "#6B8E6B", dot: "#6B8E6B", desc: "Tươi mát, tự nhiên" },
  { name: "Nâu Đất Quý Tộc",    color: "#2C211A", border: "#78350F", dot: "#78350F", desc: "Trầm ấm, cổ điển" },
  { name: "Tím Hoàng Gia",      color: "#281E32", border: "#6B21A8", dot: "#6B21A8", desc: "Chung thủy, quý phái" },
];

const DARK_BG_COLORS = new Set(["#3B1117", "#161B26", "#2C211A", "#281E32"]);

// Shared UI constants
const STICKER_CELL_SX = {
  ...CARD_ITEM_SX,
  height: 52,
  fontSize: "1.6rem",
  "&:hover": {
    ...CARD_ITEM_SX["&:hover"],
    transform: "scale(1.15)",
    boxShadow: SHADOW.sm,
  },
} as const;

const LIST_ROW_SX = {
  ...CARD_ITEM_SX,
  display: "flex",
  alignItems: "center",
  gap: SPACING.px12,
  p: SPACING.px12,
} as const;

export const CanvasAssetsDrawer: React.FC<ICanvasAssetsDrawerProps> = ({
  openingEffect = "envelope-3d",
  ambientParticle = "sakura",
  onSetOpeningEffect,
  onSetAmbientParticle,
  onAddText,
  onAddSticker,
  onAddShape,
  onAddImage,
  onSetBackground,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("effects");
  const [stickerFilter, setStickerFilter] = useState<"all" | "floral" | "rings" | "badges">("all");
  const [customBgHex, setCustomBgHex] = useState<string>(COLOR.bgPrimary);

  const handleCustomBgChange = (hex: string) => {
    setCustomBgHex(hex);
    onSetBackground(hex);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onAddImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%", backgroundColor: COLOR.bgPaper, zIndex: 20 }}>
      {/* ── Tier 1: Slim Vertical Icon Rail ── */}
      <Box sx={{ ...PANEL_RAIL_SX, width: 78 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Tooltip key={item.id} title={item.tip} placement="right" arrow>
              <StackCenter
                onClick={() => setActiveTab(item.id)}
                sx={{
                  width: 66,
                  minHeight: 62,
                  flexDirection: "column",
                  borderRadius: RADIUS.md,
                  cursor: "pointer",
                  backgroundColor: isActive ? COLOR.bgPaper : "transparent",
                  color: isActive ? COLOR.gold.main : COLOR.textTertiary,
                  boxShadow: isActive ? `0 2px 8px rgba(0,0,0,0.06)` : "none",
                  border: isActive ? `1.5px solid ${COLOR.gold.light}` : "1px solid transparent",
                  transition: ANIMATION.sm,
                  p: SPACING.px6,
                  "&:hover": {
                    backgroundColor: isActive ? COLOR.bgPaper : COLOR.bgTertiary,
                    color: COLOR.gold.main,
                  },
                }}
              >
                <IconElement name={item.icon} size="sm" />
                <TextElement
                  size="xs"
                  weight={isActive ? "bold" : "medium"}
                  sx={{
                    fontSize: FONT_SIZE.xs,
                    mt: SPACING.px4,
                    color: "inherit",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </TextElement>
              </StackCenter>
            </Tooltip>
          );
        })}
      </Box>

      {/* ── Tier 2: Wide Asset Content Panel ── */}
      <Box
        sx={{
          ...PANEL_CONTENT_SX,
          width: { xs: 280, sm: 330 },
          p: SPACING.px20,
        }}
      >
        {/* ── Tab: Văn Bản ── */}
        {activeTab === "text" && (
          <StackCol spacing={SPACING.px20}>
            <Box>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.md }}>
                THÊM VĂN BẢN VÀO THIỆP
              </HeadingElement>
              <TextElement size="xs" colorVariant="secondary" sx={{ mt: SPACING.px4 }}>
                Nhấp vào bất kỳ mẫu chữ nào để chèn vào thiệp và chỉnh sửa.
              </TextElement>
            </Box>

            {/* Tạo chữ nhanh */}
            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.05em", mb: SPACING.px8 }}>
                ✍️ Tạo chữ theo kích cỡ
              </TextElement>
              <StackCol spacing={SPACING.px8}>
                <Box
                  onClick={() => onAddText({ text: "TIÊU ĐỀ CHÍNH", fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: "bold" })}
                  sx={{ ...CARD_ITEM_SX, p: SPACING.px12, textAlign: "center" }}
                >
                  <HeadingElement variant="h5" fontFamilyType="serif" weight="bold" sx={{ fontSize: "1.3rem" }}>
                    + Thêm Tiêu Đề Lớn
                  </HeadingElement>
                  <TextElement size="xs" colorVariant="secondary">Phù hợp tên cô dâu, chú rể hoặc tên buổi lễ</TextElement>
                </Box>

                <Box
                  onClick={() => onAddText({ text: "Trân trọng kính mời quý khách tới tham dự", fontSize: 14, fontFamily: "Inter, sans-serif", fontStyle: "normal" })}
                  sx={{ ...CARD_ITEM_SX, p: SPACING.px12, textAlign: "center" }}
                >
                  <TextElement size="sm" weight="semibold">+ Thêm Đoạn Văn Lời Mời</TextElement>
                  <TextElement size="xs" colorVariant="secondary">Phù hợp thông điệp lời chúc hoặc lời ngỏ</TextElement>
                </Box>
              </StackCol>
            </Box>

            {/* Mẫu chữ gợi ý */}
            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.05em", mb: SPACING.px8 }}>
                ✨ Mẫu chữ có sẵn cho đám cưới
              </TextElement>
              <StackCol spacing={SPACING.px8}>
                {TEXT_PRESETS.map((item, idx) => (
                  <Box
                    key={idx}
                    onClick={() => onAddText({ text: item.label, fontSize: item.size, fontFamily: item.font, fontWeight: item.weight, fill: item.fill })}
                    sx={{ ...LIST_ROW_SX }}
                  >
                    <Box sx={{ fontSize: "1.2rem", width: 28, textAlign: "center" }}>{item.icon}</Box>
                    <StackCol spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                      <TextElement size="xs" colorVariant="secondary">{item.tag}</TextElement>
                      <TextElement size="sm" weight="bold" sx={{ fontFamily: item.font, color: item.fill }}>
                        {item.label}
                      </TextElement>
                    </StackCol>
                    <IconElement name="Add" size="xs" color={COLOR.gold.main} />
                  </Box>
                ))}
              </StackCol>
            </Box>
          </StackCol>
        )}

        {/* ── Tab: Stickers ── */}
        {activeTab === "stickers" && (
          <StackCol spacing={SPACING.px20}>
            <Box>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.md }}>
                HỌA TIẾT & STICKER TRANG TRÍ
              </HeadingElement>
              <TextElement size="xs" colorVariant="secondary" sx={{ mt: SPACING.px4 }}>
                Chạm vào biểu tượng để chèn trực tiếp vào thiệp.
              </TextElement>
            </Box>

            {/* Filter chips */}
            <StackRowAlignJustCenter spacing={SPACING.px4}>
              {[{ id: "all", label: "Tất cả" }, ...STICKER_CATEGORIES].map((chip) => (
                <Chip
                  key={chip.id}
                  label={chip.label}
                  size="small"
                  onClick={() => setStickerFilter(chip.id as typeof stickerFilter)}
                  sx={{
                    fontSize: FONT_SIZE.xs,
                    fontWeight: FONT_WEIGHT.semibold,
                    backgroundColor: stickerFilter === chip.id ? COLOR.gold.main : COLOR.bgSecondary,
                    color: stickerFilter === chip.id ? COLOR.textInverse : COLOR.textSecondary,
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    cursor: "pointer",
                  }}
                />
              ))}
            </StackRowAlignJustCenter>

            {STICKER_CATEGORIES.filter((cat) => stickerFilter === "all" || stickerFilter === cat.id).map((cat) => (
              <Box key={cat.id}>
                <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px8 }}>
                  {cat.label}
                </TextElement>
                <Grid container spacing={SPACING.px6}>
                  {cat.emojis.map((emoji, idx) => (
                    <Grid size={{ xs: 3 }} key={idx}>
                      <Tooltip title="Bấm để chèn" arrow>
                        <StackCenter onClick={() => onAddSticker(emoji, 38)} sx={STICKER_CELL_SX}>
                          {emoji}
                        </StackCenter>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </StackCol>
        )}

        {/* ── Tab: Hiệu Ứng ── */}
        {activeTab === "effects" && (
          <StackCol spacing={SPACING.px20}>
            <Box>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.md }}>
                HIỆU ỨNG THIỆP CƯỚI 3D
              </HeadingElement>
              <TextElement size="xs" colorVariant="secondary" sx={{ mt: SPACING.px4 }}>
                Chọn phong cách mở thiệp & hiệu ứng hạt rơi khi khách nhận link.
              </TextElement>
            </Box>

            {/* 1. Mở bìa thiệp 3D */}
            <Box>
              <StackRowAlignJustBetween sx={{ mb: SPACING.px8 }}>
                <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  💌 1. Hiệu ứng mở bìa thiệp 3D
                </TextElement>
              </StackRowAlignJustBetween>
              <StackCol spacing={SPACING.px8}>
                {OPENING_EFFECTS.map((item) => {
                  const isSelected = openingEffect === item.id;
                  return (
                    <Box
                      key={item.id}
                      onClick={() => onSetOpeningEffect?.(item.id)}
                      sx={{
                        ...LIST_ROW_SX,
                        ...SELECTABLE_ITEM_SX(isSelected),
                        p: SPACING.px12,
                      }}
                    >
                      <Box sx={{ fontSize: "1.5rem" }}>{item.icon}</Box>
                      <StackCol spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                        <StackRowAlignJustBetween>
                          <TextElement size="sm" weight="bold" sx={{ color: isSelected ? COLOR.gold.main : COLOR.textPrimary }}>
                            {item.title}
                          </TextElement>
                          {isSelected && (
                            <Chip label="Đang chọn" size="small" sx={{ height: 18, fontSize: "0.6rem", backgroundColor: `${COLOR.gold.main}20`, color: COLOR.gold.main, fontWeight: "bold" }} />
                          )}
                        </StackRowAlignJustBetween>
                        <TextElement size="xs" colorVariant="secondary">
                          {item.desc}
                        </TextElement>
                      </StackCol>
                    </Box>
                  );
                })}
              </StackCol>
            </Box>

            {/* 2. Hiệu ứng hạt rơi */}
            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px8 }}>
                🌸 2. Hiệu ứng hạt rơi (Ambient FX)
              </TextElement>
              <Grid container spacing={SPACING.px8}>
                {AMBIENT_PARTICLES.map((item) => {
                  const isSelected = ambientParticle === item.id;
                  return (
                    <Grid size={{ xs: 6 }} key={item.id}>
                      <Box
                        onClick={() => onSetAmbientParticle?.(item.id)}
                        sx={{
                          ...SELECTABLE_ITEM_SX(isSelected),
                          p: SPACING.px12,
                          display: "flex",
                          alignItems: "center",
                          gap: SPACING.px8,
                        }}
                      >
                        <Box sx={{ fontSize: "1.3rem" }}>{item.icon}</Box>
                        <StackCol spacing={0}>
                          <TextElement size="xs" weight="bold" sx={{ color: isSelected ? COLOR.gold.main : COLOR.textPrimary }}>
                            {item.label}
                          </TextElement>
                          <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.65rem" }}>
                            {item.desc}
                          </TextElement>
                        </StackCol>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </StackCol>
        )}

        {/* ── Tab: Khung Hình & Viền ── */}
        {activeTab === "shapes" && (
          <StackCol spacing={SPACING.px20}>
            <Box>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.md }}>
                KHUNG VIỀN & DẢI PHÂN CÁCH
              </HeadingElement>
              <TextElement size="xs" colorVariant="secondary" sx={{ mt: SPACING.px4 }}>
                Thêm khung hình trang trọng để làm nổi bật ảnh và chữ.
              </TextElement>
            </Box>
            <StackCol spacing={SPACING.px8}>
              {[
                { type: "divider" as const, preview: <Box sx={{ width: 40, height: 2, backgroundColor: COLOR.gold.main }} />, label: "Dải Phân Cách Vàng Hoàng Kim", desc: "Ngăn cách giữa các phần nội dung" },
                { type: "rect"    as const, preview: <Box sx={{ width: 26, height: 26, border: `2px solid ${COLOR.gold.main}`, borderRadius: RADIUS.xs }} />, label: "Khung Chữ Nhật Bo Góc", desc: "Viền bao quanh ảnh cưới hoặc lời chúc" },
                { type: "circle"  as const, preview: <Box sx={{ width: 26, height: 26, border: `2px solid ${COLOR.gold.main}`, borderRadius: RADIUS.full }} />, label: "Khung Tròn Chân Dung", desc: "Khung tròn sang trọng cho ảnh avatar cô dâu chú rể" },
              ].map((shape) => (
                <Box key={shape.type} onClick={() => onAddShape(shape.type)} sx={{ ...LIST_ROW_SX }}>
                  {shape.preview}
                  <StackCol spacing={0} sx={{ flex: 1 }}>
                    <TextElement size="sm" weight="semibold">{shape.label}</TextElement>
                    <TextElement size="xs" colorVariant="secondary">{shape.desc}</TextElement>
                  </StackCol>
                  <IconElement name="Add" size="xs" color={COLOR.gold.main} />
                </Box>
              ))}
            </StackCol>
          </StackCol>
        )}

        {/* ── Tab: Tải Ảnh ── */}
        {activeTab === "uploads" && (
          <StackCol spacing={SPACING.px20}>
            <Box>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.md }}>
                TẢI ẢNH CƯỚI CỦA BẠN
              </HeadingElement>
              <TextElement size="xs" colorVariant="secondary" sx={{ mt: SPACING.px4 }}>
                Hỗ trợ định dạng JPG, PNG, WebP (Tối đa 10MB).
              </TextElement>
            </Box>

            <ButtonElement
              component="label"
              variant="gradient"
              size="medium"
              fullWidth
              rounded="md"
              leftIcon={<IconElement name="CloudUpload" size="xs" />}
            >
              Chọn Ảnh Từ Thiết Bị Của Bạn
              <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
            </ButtonElement>

            <Divider />

            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px8 }}>
                📸 Ảnh mẫu chất lượng cao (Nhấp để chèn)
              </TextElement>

              <Grid container spacing={SPACING.px8}>
                {[
                  { title: "Cặp đôi hoàng hôn", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop" },
                  { title: "Nắm tay lễ đường", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop" },
                  { title: "Chân dung cô dâu", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop" },
                  { title: "Hoa cưới lãng mạn", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&auto=format&fit=crop" },
                ].map((item, idx) => (
                  <Grid size={{ xs: 6 }} key={idx}>
                    <Tooltip title={`Chèn: ${item.title}`} arrow>
                      <Box
                        component="img"
                        src={item.url}
                        alt={item.title}
                        onClick={() => onAddImage(item.url)}
                        sx={{
                          width: "100%",
                          height: 95,
                          objectFit: "cover",
                          borderRadius: RADIUS.md,
                          cursor: "pointer",
                          border: `1px solid ${COLOR.borderGoldLight}`,
                          transition: ANIMATION.sm,
                          "&:hover": { transform: "scale(1.03)", borderColor: COLOR.gold.main, boxShadow: SHADOW.md },
                        }}
                      />
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </StackCol>
        )}

        {/* ── Tab: Màu Nền ── */}
        {activeTab === "backgrounds" && (
          <StackCol spacing={SPACING.px20}>
            <Box>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.md }}>
                TÙY CHỌN MÀU NỀN THIỆP
              </HeadingElement>
              <TextElement size="xs" colorVariant="secondary" sx={{ mt: SPACING.px4 }}>
                Thay đổi tông màu nền tổng thể cho toàn bộ thiệp cưới.
              </TextElement>
            </Box>

            {/* Custom HEX */}
            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px8 }}>
                🎯 Nhập mã màu HEX tùy ý
              </TextElement>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: COLOR.bgSecondary,
                  borderRadius: RADIUS.md,
                  border: `1px solid ${COLOR.borderSubtle}`,
                  px: SPACING.px12,
                  py: SPACING.px8,
                  gap: SPACING.px12,
                  transition: ANIMATION.sm,
                  "&:focus-within": {
                    borderColor: COLOR.gold.main,
                    backgroundColor: COLOR.bgPaper,
                    boxShadow: `0 0 0 2px ${COLOR.gold[100]}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: RADIUS.sm,
                    backgroundColor: customBgHex,
                    border: `1px solid ${COLOR.borderSubtle}`,
                    flexShrink: 0,
                  }}
                />
                <input
                  type="text"
                  value={customBgHex}
                  onChange={(e) => handleCustomBgChange(e.target.value)}
                  placeholder="#FAF8F5"
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: FONT_SIZE.sm,
                    fontFamily: "monospace",
                    fontWeight: FONT_WEIGHT.semibold,
                    color: COLOR.textPrimary,
                    background: "transparent",
                  }}
                />
                <Tooltip title="Chọn từ bảng màu trực quan" arrow>
                  <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <IconElement name="ColorLens" size="xs" color={COLOR.gold.main} />
                    <input
                      type="color"
                      value={customBgHex.startsWith("#") ? customBgHex : COLOR.bgPrimary}
                      onChange={(e) => handleCustomBgChange(e.target.value)}
                      style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                    />
                  </label>
                </Tooltip>
              </Box>
            </Box>

            {/* Preset Palettes */}
            <Box>
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px8 }}>
                👑 Bảng màu phong thủy & sang trọng
              </TextElement>
              <Grid container spacing={SPACING.px8}>
                {BG_PRESETS.map((bg, idx) => (
                  <Grid size={{ xs: 6 }} key={idx}>
                    <Box
                      onClick={() => handleCustomBgChange(bg.color)}
                      sx={{
                        ...CARD_ITEM_SX,
                        p: SPACING.px12,
                        height: 58,
                        display: "flex",
                        alignItems: "center",
                        gap: SPACING.px8,
                        backgroundColor: bg.color,
                        border: `1.5px solid ${bg.border}`,
                        "&:hover": {
                          borderColor: COLOR.gold.main,
                          transform: "translateY(-2px)",
                          boxShadow: SHADOW.sm,
                          backgroundColor: bg.color,
                        },
                      }}
                    >
                      <Box sx={{ width: 18, height: 18, borderRadius: RADIUS.full, backgroundColor: bg.dot, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                      <StackCol spacing={0}>
                        <TextElement
                          size="xs"
                          weight="bold"
                          sx={{
                            fontSize: FONT_SIZE.xs,
                            lineHeight: 1.2,
                            color: DARK_BG_COLORS.has(bg.color) ? COLOR.textInverse : COLOR.textPrimary,
                          }}
                        >
                          {bg.name}
                        </TextElement>
                        <TextElement
                          size="xs"
                          sx={{
                            fontSize: "0.65rem",
                            color: DARK_BG_COLORS.has(bg.color) ? "rgba(255,255,255,0.7)" : COLOR.textSecondary,
                          }}
                        >
                          {bg.desc}
                        </TextElement>
                      </StackCol>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </StackCol>
        )}
      </Box>
    </Box>
  );
};
