"use client";

import React, { useState } from "react";
import { Box, Chip, Divider, Tooltip, IconButton } from "@mui/material";
import {
  ICanvasLayer,
  ICanvasTextLayer,
  CanvasOpeningEffectType,
  CanvasAmbientParticleType,
} from "@/interfaces/canvas-editor.interface";
import {
  COLOR,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  ANIMATION,
} from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  IconName,
  StackCenter,
  StackCol,
  StackRow,
  StackRowAlignJustBetween,
  StackRowAlignJustStart,
} from "@/components/shared";

interface ICanvasAssetsDrawerProps {
  layers?: ICanvasLayer[];
  selectedId?: string | null;
  openingEffect?: CanvasOpeningEffectType;
  ambientParticle?: CanvasAmbientParticleType;
  onSelectLayer?: (id: string | null) => void;
  onUpdateLayer?: (id: string, updates: Partial<ICanvasLayer>) => void;
  onDeleteLayer?: (id: string) => void;
  onDuplicateLayer?: (id: string) => void;
  onBringForward?: (id: string) => void;
  onSendBackward?: (id: string) => void;
  onSetOpeningEffect?: (effect: CanvasOpeningEffectType) => void;
  onSetAmbientParticle?: (particle: CanvasAmbientParticleType) => void;
  onAddText: (preset?: {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight?: "bold" | "normal";
    fill?: string;
    fontStyle?: "normal" | "italic";
  }) => void;
  onAddSticker: (emoji: string, size?: number) => void;
  onAddShape: (type: "rect" | "circle" | "divider") => void;
  onAddImage: (src: string) => void;
  onSetBackground: (color: string) => void;
}

type TabType = "layers" | "text" | "stickers" | "effects" | "shapes" | "uploads" | "backgrounds";

const NAV_ITEMS: { id: TabType; label: string; icon: IconName; tip: string }[] = [
  { id: "layers", label: "Layers", icon: "Layers", tip: "Xem & quản lý tất cả các phần tử trên thiệp" },
  { id: "text", label: "Mẫu Chữ", icon: "TextFormat", tip: "Chèn tiêu đề, lời mời, ngày cưới" },
  { id: "stickers", label: "Họa Tiết", icon: "Favorite", tip: "Sticker hoa lá, nhẫn cưới" },
  { id: "effects", label: "Hiệu Ứng", icon: "AutoAwesome", tip: "Hiệu ứng mở 3D & hạt rơi" },
  { id: "shapes", label: "Khung Hình", icon: "Crop", tip: "Khung chân dung, dải phân cách" },
  { id: "uploads", label: "Tải Ảnh", icon: "CloudUpload", tip: "Tải ảnh cưới từ thiết bị" },
  { id: "backgrounds", label: "Màu Nền", icon: "Palette", tip: "Tông màu nền thiệp sang trọng" },
];

const STICKER_CATEGORIES = [
  { id: "floral", label: "Hoa lá", emojis: ["🌸", "🌹", "🌺", "🌷", "🌼", "🌿", "🍃", "💐", "🥀", "🌾", "🌻", "🏵️"] },
  { id: "rings", label: "Nhẫn & Tim", emojis: ["💍", "💖", "💗", "🕊️", "💌", "🥂", "🍾", "🎂"] },
  { id: "badges", label: "Hoàng Gia", emojis: ["⚜️", "👑", "✨", "💎", "🌟", "💫", "🎆", "🎇"] },
] as const;

const TEXT_PRESETS = [
  {
    category: "Tiêu đề lớn",
    label: "LỄ THÀNH HÔN",
    size: 18,
    font: "'Playfair Display', serif",
    weight: "bold" as const,
    fill: COLOR.gold.main,
  },
  {
    category: "Chữ uốn lượn",
    label: "Save The Date",
    size: 22,
    font: "'Great Vibes', cursive",
    weight: "regular" as const,
    fill: COLOR.textPrimary,
  },
  {
    category: "Tên cặp đôi",
    label: "Minh Quân & Thanh Trúc",
    size: 20,
    font: "'Playfair Display', serif",
    weight: "bold" as const,
    fill: COLOR.textPrimary,
  },
  {
    category: "Ngày tháng cưới",
    label: "CHỦ NHẬT • 20.11.2026",
    size: 13,
    font: "Inter, sans-serif",
    weight: "bold" as const,
    fill: COLOR.gold.main,
  },
  {
    category: "Địa điểm tiệc",
    label: "Trung Tâm Tiệc Cưới Park Hyatt",
    size: 13,
    font: "Inter, sans-serif",
    weight: "regular" as const,
    fill: COLOR.textSecondary,
  },
];

const OPENING_EFFECTS: { id: CanvasOpeningEffectType; icon: string; title: string; desc: string }[] = [
  { id: "envelope-3d", icon: "💌", title: "Mở Phong Bì 3D", desc: "Mở con dấu sáp niêm phong, trượt thiệp ra ngoài" },
  { id: "gate-fold", icon: "✨", title: "Cánh Cổng Hoàng Kim 3D", desc: "Hai cánh cửa vàng mở sang hai bên" },
  { id: "scroll", icon: "📜", title: "Cuộn Thư Hoàng Cung", desc: "Trục thư tự động mở dọc trang trọng" },
  { id: "fade", icon: "💫", title: "Màn Mờ Ảo Tinh Tế", desc: "Hiện dần nhẹ nhàng, phong cách tối giản" },
];

const AMBIENT_PARTICLES: { id: CanvasAmbientParticleType; icon: string; label: string }[] = [
  { id: "sakura", icon: "🌸", label: "Mưa Hoa Đào" },
  { id: "gold-dust", icon: "✨", label: "Bụi Kim Tuyến" },
  { id: "hearts", icon: "💖", label: "Trái Tim Bay" },
  { id: "snow", icon: "❄️", label: "Tuyết Cổ Tích" },
  { id: "none", icon: "🚫", label: "Tắt Hiệu Ứng" },
];

const BG_PRESETS = [
  { name: "Trắng Hoàng Kim", color: "#FFFFFF", dot: "#B78628", desc: "Tinh khiết & Quý phái" },
  { name: "Kem Ngọc Trai", color: "#FCFAF6", dot: "#D4AF37", desc: "Ấm áp & Sang trọng" },
  { name: "Hồng Pastel", color: "#FFF8F7", dot: "#DE7C66", desc: "Ngọt ngào lãng mạn" },
  { name: "Nhung Đỏ Cổ Điển", color: "#3B1117", dot: "#8B1E2B", desc: "May mắn truyền thống" },
  { name: "Đêm Gala Tinh Tú", color: "#161B26", dot: "#3A4D6B", desc: "Huyền bí & Đẳng cấp" },
  { name: "Xanh Rêu Vintage", color: "#F5F8F5", dot: "#6B8E6B", desc: "Tươi mới & Tinh tế" },
  { name: "Nâu Đất Quý Tộc", color: "#2C211A", dot: "#78350F", desc: "Cổ điển trầm ấm" },
  { name: "Tím Hoàng Gia", color: "#281E32", dot: "#6B21A8", desc: "Chung thủy hoàng tộc" },
];

export const CanvasAssetsDrawer: React.FC<ICanvasAssetsDrawerProps> = ({
  layers = [],
  selectedId,
  openingEffect = "envelope-3d",
  ambientParticle = "sakura",
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onBringForward,
  onSendBackward,
  onSetOpeningEffect,
  onSetAmbientParticle,
  onAddText,
  onAddSticker,
  onAddShape,
  onAddImage,
  onSetBackground,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("layers");
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
    <Box
      data-tour="assets-drawer"
      sx={{
        display: "flex",
        height: "100%",
        backgroundColor: COLOR.bgPaper,
        borderRight: `1px solid ${COLOR.borderGoldLight}`,
        zIndex: 20,
        flexShrink: 0,
      }}
    >
      {/* ── Tier 1: Slim Vertical Icon Rail ── */}
      <Box
        sx={{
          width: 72,
          height: "100%",
          backgroundColor: COLOR.bgSecondary,
          borderRight: `1px solid ${COLOR.borderGoldLight}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: SPACING.px12,
          gap: SPACING.px6,
          flexShrink: 0,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Tooltip key={item.id} title={item.tip} placement="right" arrow>
              <StackCenter
                onClick={() => setActiveTab(item.id)}
                sx={{
                  width: 60,
                  height: 54,
                  flexDirection: "column",
                  borderRadius: RADIUS.md,
                  cursor: "pointer",
                  backgroundColor: isActive ? COLOR.bgPaper : "transparent",
                  color: isActive ? COLOR.gold.main : COLOR.textTertiary,
                  border: `1.5px solid ${isActive ? COLOR.gold.main : "transparent"}`,
                  transition: ANIMATION.sm,
                  "&:hover": {
                    borderColor: COLOR.gold.main,
                    color: COLOR.gold.main,
                  },
                }}
              >
                <IconElement name={item.icon} size="sm" />
                <TextElement
                  size="xs"
                  weight={isActive ? "bold" : "medium"}
                  sx={{
                    fontSize: "0.65rem",
                    mt: "2px",
                    color: "inherit",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </TextElement>
              </StackCenter>
            </Tooltip>
          );
        })}
      </Box>

      {/* ── Tier 2: Wide Content Panel ── */}
      <Box
        sx={{
          width: 300,
          height: "100%",
          backgroundColor: COLOR.bgPaper,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          p: SPACING.px16,
          flexShrink: 0,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            background: COLOR.borderSubtle,
            borderRadius: RADIUS.xs,
          },
        }}
      >
        {/* ── Tab: Danh Sách Lớp (Layers) ── */}
        {activeTab === "layers" && (
          <StackCol spacing={SPACING.px12} sx={{ width: "100%" }}>
            <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center" }}>
              <StackCol spacing={0}>
                <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
                  DANH SÁCH LỚP ({layers.length})
                </HeadingElement>
                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.68rem" }}>
                  Thứ tự từ trên xuống dưới trên thiệp
                </TextElement>
              </StackCol>

              {selectedId && onSelectLayer && (
                <ButtonElement
                  variant="text"
                  size="small"
                  onClick={() => onSelectLayer(null)}
                  sx={{ fontSize: "0.68rem", p: 0, color: COLOR.textSecondary }}
                >
                  Bỏ chọn
                </ButtonElement>
              )}
            </StackRowAlignJustBetween>

            <Divider sx={{ borderColor: COLOR.divider }} />

            {/* List of layers sorted by zIndex descending */}
            {layers.length === 0 ? (
              <StackCenter sx={{ py: SPACING.px32, color: COLOR.textTertiary, flexDirection: "column" }}>
                <IconElement name="Layers" size="lg" />
                <TextElement size="xs" sx={{ mt: SPACING.px8 }}>
                  Chưa có phần tử nào trên thiệp
                </TextElement>
              </StackCenter>
            ) : (
              <StackCol spacing={SPACING.px6} sx={{ width: "100%" }}>
                {[...layers]
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((layer) => {
                    const isSelected = selectedId === layer.id;
                    const getIcon = (): IconName => {
                      switch (layer.type) {
                        case "text":
                          return "TextFields";
                        case "image":
                          return "Image";
                        case "shape":
                          return "Crop";
                        case "sticker":
                          return "AutoAwesome";
                        default:
                          return "Layers";
                      }
                    };

                    return (
                      <Box
                        key={layer.id}
                        onClick={() => onSelectLayer && onSelectLayer(layer.id)}
                        sx={{
                          width: "100%",
                          boxSizing: "border-box",
                          p: SPACING.px8,
                          borderRadius: RADIUS.sm,
                          backgroundColor: isSelected ? COLOR.gold[50] : COLOR.bgSecondary,
                          border: `1.5px solid ${isSelected ? COLOR.gold.main : COLOR.borderGoldLight}`,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: SPACING.px6,
                          transition: ANIMATION.sm,
                          "&:hover": {
                            borderColor: COLOR.gold.main,
                            backgroundColor: isSelected ? COLOR.gold[50] : COLOR.bgPaper,
                          },
                        }}
                      >
                        {/* Left: Icon + Name */}
                        <StackRowAlignJustStart sx={{ gap: SPACING.px6, alignItems: "center", minWidth: 0, flex: 1 }}>
                          <StackCenter
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: RADIUS.xs,
                              backgroundColor: isSelected ? COLOR.gold.main : COLOR.bgPaper,
                              color: isSelected ? COLOR.textInverse : COLOR.gold.main,
                              border: `1px solid ${COLOR.borderGoldLight}`,
                              flexShrink: 0,
                            }}
                          >
                            <IconElement name={getIcon()} size="xs" />
                          </StackCenter>

                          <StackCol spacing={0} sx={{ minWidth: 0, flex: 1 }}>
                            <TextElement
                              size="xs"
                              weight={isSelected ? "bold" : "medium"}
                              colorVariant={isSelected ? "gold" : "primary"}
                              sx={{
                                fontSize: "0.75rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textDecoration: layer.isHidden ? "line-through" : "none",
                                opacity: layer.isHidden ? 0.5 : 1,
                              }}
                            >
                              {layer.name || (layer.type === "text" ? (layer as ICanvasTextLayer).text : layer.type)}
                            </TextElement>
                          </StackCol>
                        </StackRowAlignJustStart>

                        {/* Right: Quick Action Icons */}
                        <StackRow sx={{ gap: "2px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                          {/* Hide / Show Toggle */}
                          {onUpdateLayer && (
                            <Tooltip title={layer.isHidden ? "Hiện layer" : "Ẩn layer"} arrow>
                              <IconButton
                                size="small"
                                onClick={() => onUpdateLayer(layer.id, { isHidden: !layer.isHidden })}
                                sx={{
                                  p: 0.3,
                                  color: layer.isHidden ? COLOR.textTertiary : COLOR.textSecondary,
                                  "&:hover": { color: COLOR.gold.main },
                                }}
                              >
                                <IconElement name={layer.isHidden ? "VisibilityOff" : "Visibility"} size="xs" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Lock / Unlock Toggle */}
                          {onUpdateLayer && (
                            <Tooltip title={layer.isLocked ? "Mở khóa" : "Khóa vị trí"} arrow>
                              <IconButton
                                size="small"
                                onClick={() => onUpdateLayer(layer.id, { isLocked: !layer.isLocked })}
                                sx={{
                                  p: 0.3,
                                  color: layer.isLocked ? COLOR.gold.main : COLOR.textTertiary,
                                  "&:hover": { color: COLOR.gold.main },
                                }}
                              >
                                <IconElement name={layer.isLocked ? "Lock" : "LockOpen"} size="xs" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Bring Up */}
                          {onBringForward && (
                            <Tooltip title="Lên 1 tầng" arrow>
                              <IconButton
                                size="small"
                                onClick={() => onBringForward(layer.id)}
                                sx={{
                                  p: 0.3,
                                  color: COLOR.textSecondary,
                                  "&:hover": { color: COLOR.gold.main },
                                }}
                              >
                                <IconElement name="ArrowUpward" size="xs" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Send Down */}
                          {onSendBackward && (
                            <Tooltip title="Xuống 1 tầng" arrow>
                              <IconButton
                                size="small"
                                onClick={() => onSendBackward(layer.id)}
                                sx={{
                                  p: 0.3,
                                  color: COLOR.textSecondary,
                                  "&:hover": { color: COLOR.gold.main },
                                }}
                              >
                                <IconElement name="ArrowDownward" size="xs" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Delete */}
                          {onDeleteLayer && (
                            <Tooltip title="Xóa" arrow>
                              <IconButton
                                size="small"
                                onClick={() => onDeleteLayer(layer.id)}
                                sx={{
                                  p: 0.3,
                                  color: COLOR.status.error.main,
                                  "&:hover": { color: COLOR.status.error.dark },
                                }}
                              >
                                <IconElement name="Delete" size="xs" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </StackRow>
                      </Box>
                    );
                  })}
              </StackCol>
            )}
          </StackCol>
        )}

        {/* ── Tab: Văn Bản ── */}
        {activeTab === "text" && (
          <StackCol spacing={SPACING.px16}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
              MẪU CHỮ NGHỆ THUẬT
            </HeadingElement>

            {/* Tạo chữ nhanh */}
            <StackRowAlignJustBetween sx={{ gap: SPACING.px8 }}>
              <ButtonElement
                variant="gradient"
                size="small"
                fullWidth
                rounded="sm"
                onClick={() =>
                  onAddText({
                    text: "TIÊU ĐỀ",
                    fontSize: 28,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: "bold",
                  })
                }
                leftIcon={<IconElement name="Add" size="xs" />}
                sx={{
                  height: 36,
                  fontSize: FONT_SIZE.xs,
                  "&:hover": { borderColor: COLOR.gold.main },
                }}
              >
                Tiêu Đề
              </ButtonElement>
              <ButtonElement
                variant="outline"
                size="small"
                fullWidth
                rounded="sm"
                onClick={() =>
                  onAddText({
                    text: "Trân trọng kính mời quý khách...",
                    fontSize: 14,
                    fontFamily: "Inter, sans-serif",
                  })
                }
                leftIcon={<IconElement name="Add" size="xs" />}
                sx={{
                  height: 36,
                  fontSize: FONT_SIZE.xs,
                  backgroundColor: COLOR.bgPaper,
                  borderColor: COLOR.borderGoldLight,
                  "&:hover": { borderColor: COLOR.gold.main, backgroundColor: COLOR.bgPaper },
                }}
              >
                Đoạn Văn
              </ButtonElement>
            </StackRowAlignJustBetween>

            <Divider sx={{ borderColor: COLOR.divider }} />

            {/* Mẫu chữ cưới */}
            <StackCol spacing={SPACING.px8}>
              {TEXT_PRESETS.map((item, idx) => (
                <Box
                  key={idx}
                  onClick={() =>
                    onAddText({
                      text: item.label,
                      fontSize: item.size,
                      fontFamily: item.font,
                      fontWeight: item.weight === "bold" ? "bold" : "normal",
                      fill: item.fill,
                    })
                  }
                  sx={{
                    p: "10px 12px",
                    cursor: "pointer",
                    borderRadius: RADIUS.md,
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    backgroundColor: COLOR.bgSecondary,
                    transition: ANIMATION.sm,
                    "&:hover": {
                      borderColor: COLOR.gold.main,
                      backgroundColor: COLOR.bgPaper,
                    },
                  }}
                >
                  <TextElement
                    size="xs"
                    colorVariant="secondary"
                    sx={{ fontSize: "0.68rem", mb: 0.5, letterSpacing: "0.05em" }}
                  >
                    {item.category}
                  </TextElement>
                  <TextElement
                    size="sm"
                    weight={item.weight}
                    sx={{
                      fontFamily: item.font,
                      fontSize: `${item.size}px`,
                      color: item.fill,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.label}
                  </TextElement>
                </Box>
              ))}
            </StackCol>
          </StackCol>
        )}

        {/* ── Tab: Họa Tiết (Stickers) ── */}
        {activeTab === "stickers" && (
          <StackCol spacing={SPACING.px16}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
              HỌA TIẾT & BIỂU TƯỢNG
            </HeadingElement>

            {/* Phân loại Stickers */}
            <StackRowAlignJustStart sx={{ gap: SPACING.px6 }}>
              {(["all", "floral", "rings", "badges"] as const).map((filter) => (
                <Chip
                  key={filter}
                  label={
                    filter === "all"
                      ? "Tất cả"
                      : filter === "floral"
                      ? "Hoa lá"
                      : filter === "rings"
                      ? "Nhẫn & Tim"
                      : "Hoàng Gia"
                  }
                  size="small"
                  onClick={() => setStickerFilter(filter)}
                  sx={{
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    backgroundColor: stickerFilter === filter ? COLOR.gold.main : COLOR.bgSecondary,
                    color: stickerFilter === filter ? COLOR.textInverse : COLOR.textPrimary,
                    borderColor: stickerFilter === filter ? COLOR.gold.main : COLOR.borderGoldLight,
                    borderWidth: 1,
                    borderStyle: "solid",
                    "&:hover": { borderColor: COLOR.gold.main },
                  }}
                />
              ))}
            </StackRowAlignJustStart>

            <Divider sx={{ borderColor: COLOR.divider }} />

            {/* Grid các icon Emoji cao cấp */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: SPACING.px8,
              }}
            >
              {STICKER_CATEGORIES.filter(
                (c) => stickerFilter === "all" || c.id === stickerFilter
              ).map((cat) =>
                cat.emojis.map((emoji, idx) => (
                  <StackCenter
                    key={`${cat.id}-${idx}`}
                    onClick={() => onAddSticker(emoji, 36)}
                    sx={{
                      height: 52,
                      borderRadius: RADIUS.md,
                      backgroundColor: COLOR.bgSecondary,
                      border: `1px solid ${COLOR.borderGoldLight}`,
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      transition: ANIMATION.sm,
                      "&:hover": {
                        borderColor: COLOR.gold.main,
                        backgroundColor: COLOR.bgPaper,
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    {emoji}
                  </StackCenter>
                ))
              )}
            </Box>
          </StackCol>
        )}

        {/* ── Tab: Hiệu Ứng (Effects) ── */}
        {activeTab === "effects" && (
          <StackCol spacing={SPACING.px16}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
              HIỆU ỨNG MỞ BÌA 3D
            </HeadingElement>

            {/* Danh sách hiệu ứng mở bìa */}
            <StackCol spacing={SPACING.px8}>
              {OPENING_EFFECTS.map((eff) => {
                const isSelected = openingEffect === eff.id;
                return (
                  <Box
                    key={eff.id}
                    onClick={() => onSetOpeningEffect && onSetOpeningEffect(eff.id)}
                    sx={{
                      p: "10px 12px",
                      cursor: "pointer",
                      borderRadius: RADIUS.md,
                      border: `1.5px solid ${isSelected ? COLOR.gold.main : COLOR.borderGoldLight}`,
                      backgroundColor: isSelected ? `${COLOR.gold.main}0A` : COLOR.bgSecondary,
                      transition: ANIMATION.sm,
                      "&:hover": {
                        borderColor: COLOR.gold.main,
                        backgroundColor: COLOR.bgPaper,
                      },
                    }}
                  >
                    <StackRowAlignJustBetween>
                      <StackRowAlignJustStart sx={{ gap: SPACING.px8 }}>
                        <Box component="span" sx={{ fontSize: "1.2rem" }}>
                          {eff.icon}
                        </Box>
                        <StackCol spacing={0}>
                          <TextElement
                            size="xs"
                            weight="bold"
                            sx={{ color: isSelected ? COLOR.gold.main : COLOR.textPrimary }}
                          >
                            {eff.title}
                          </TextElement>
                          <TextElement
                            size="xs"
                            colorVariant="secondary"
                            sx={{ fontSize: "0.65rem", lineHeight: 1.2 }}
                          >
                            {eff.desc}
                          </TextElement>
                        </StackCol>
                      </StackRowAlignJustStart>
                      {isSelected && (
                        <IconElement name="Check" size="xs" color={COLOR.gold.main} />
                      )}
                    </StackRowAlignJustBetween>
                  </Box>
                );
              })}
            </StackCol>

            <Divider sx={{ borderColor: COLOR.divider }} />

            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
              HIỆU ỨNG HẠT RƠI (PARTICLES)
            </HeadingElement>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: SPACING.px8,
              }}
            >
              {AMBIENT_PARTICLES.map((item) => {
                const isSelected = ambientParticle === item.id;
                return (
                  <StackCenter
                    key={item.id}
                    onClick={() => onSetAmbientParticle && onSetAmbientParticle(item.id)}
                    sx={{
                      p: SPACING.px8,
                      borderRadius: RADIUS.md,
                      border: `1.5px solid ${isSelected ? COLOR.gold.main : COLOR.borderGoldLight}`,
                      backgroundColor: isSelected ? `${COLOR.gold.main}0A` : COLOR.bgSecondary,
                      cursor: "pointer",
                      gap: SPACING.px6,
                      transition: ANIMATION.sm,
                      "&:hover": {
                        borderColor: COLOR.gold.main,
                        backgroundColor: COLOR.bgPaper,
                      },
                    }}
                  >
                    <Box component="span" sx={{ fontSize: "1.1rem" }}>
                      {item.icon}
                    </Box>
                    <TextElement
                      size="xs"
                      weight="semibold"
                      sx={{
                        fontSize: "0.72rem",
                        color: isSelected ? COLOR.gold.main : COLOR.textPrimary,
                      }}
                    >
                      {item.label}
                    </TextElement>
                  </StackCenter>
                );
              })}
            </Box>
          </StackCol>
        )}

        {/* ── Tab: Khung Hình (Shapes) ── */}
        {activeTab === "shapes" && (
          <StackCol spacing={SPACING.px16}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
              HÌNH KHỐI & DẢI PHÂN CÁCH
            </HeadingElement>

            {/* Dải phân cách */}
            <StackCol spacing={SPACING.px8}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
              >
                Dải Phân Cách Nghệ Thuật
              </TextElement>
              <ButtonElement
                variant="outline"
                size="small"
                fullWidth
                rounded="sm"
                onClick={() => onAddShape("divider")}
                leftIcon={<IconElement name="Add" size="xs" />}
                sx={{
                  height: 38,
                  backgroundColor: COLOR.bgSecondary,
                  borderColor: COLOR.borderGoldLight,
                  fontSize: FONT_SIZE.xs,
                  "&:hover": { borderColor: COLOR.gold.main },
                }}
              >
                Thêm Dải Phân Cách Vàng
              </ButtonElement>
            </StackCol>

            <Divider sx={{ borderColor: COLOR.divider }} />

            {/* Khung chân dung / Hình khối */}
            <StackCol spacing={SPACING.px8}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
              >
                Khung Khối & Bo Góc
              </TextElement>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: SPACING.px8,
                }}
              >
                <StackCenter
                  onClick={() => onAddShape("rect")}
                  sx={{
                    height: 70,
                    borderRadius: RADIUS.md,
                    border: `1.5px dashed ${COLOR.borderGold}`,
                    backgroundColor: COLOR.bgSecondary,
                    cursor: "pointer",
                    flexDirection: "column",
                    gap: "4px",
                    transition: ANIMATION.sm,
                    "&:hover": { borderColor: COLOR.gold.main, backgroundColor: COLOR.bgPaper },
                  }}
                >
                  <IconElement name="Crop" size="sm" color={COLOR.gold.main} />
                  <TextElement size="xs" sx={{ fontSize: "0.68rem" }}>
                    Khung Chữ Nhật
                  </TextElement>
                </StackCenter>

                <StackCenter
                  onClick={() => onAddShape("circle")}
                  sx={{
                    height: 70,
                    borderRadius: RADIUS.md,
                    border: `1.5px dashed ${COLOR.borderGold}`,
                    backgroundColor: COLOR.bgSecondary,
                    cursor: "pointer",
                    flexDirection: "column",
                    gap: "4px",
                    transition: ANIMATION.sm,
                    "&:hover": { borderColor: COLOR.gold.main, backgroundColor: COLOR.bgPaper },
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: RADIUS.full,
                      border: `1.5px solid ${COLOR.gold.main}`,
                    }}
                  />
                  <TextElement size="xs" sx={{ fontSize: "0.68rem" }}>
                    Khung Tròn
                  </TextElement>
                </StackCenter>
              </Box>
            </StackCol>
          </StackCol>
        )}

        {/* ── Tab: Tải Ảnh (Uploads) ── */}
        {activeTab === "uploads" && (
          <StackCol spacing={SPACING.px16}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
              TẢI ẢNH CƯỚI
            </HeadingElement>

            <label style={{ width: "100%" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <StackCenter
                sx={{
                  p: SPACING.px24,
                  border: `2px dashed ${COLOR.gold.main}`,
                  borderRadius: RADIUS.lg,
                  backgroundColor: `${COLOR.gold.main}0A`,
                  cursor: "pointer",
                  flexDirection: "column",
                  gap: SPACING.px8,
                  textAlign: "center",
                  transition: ANIMATION.sm,
                  "&:hover": {
                    backgroundColor: `${COLOR.gold.main}14`,
                  },
                }}
              >
                <IconElement name="CloudUpload" size="lg" color={COLOR.gold.main} />
                <TextElement size="xs" weight="bold" colorVariant="gold">
                  Chạm để tải ảnh từ máy
                </TextElement>
                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.65rem" }}>
                  Hỗ trợ JPG, PNG, WEBP tối đa 10MB
                </TextElement>
              </StackCenter>
            </label>

            <Divider sx={{ borderColor: COLOR.divider }} />

            <TextElement
              size="xs"
              weight="bold"
              colorVariant="secondary"
              sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
            >
              Ảnh Mẫu Sẵn Có
            </TextElement>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: SPACING.px8,
              }}
            >
              {[
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
                "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
                "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80",
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
              ].map((src, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={src}
                  alt={`Sample ${idx}`}
                  onClick={() => onAddImage(src)}
                  sx={{
                    width: "100%",
                    height: 90,
                    borderRadius: RADIUS.md,
                    objectFit: "cover",
                    cursor: "pointer",
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    transition: ANIMATION.sm,
                    "&:hover": {
                      borderColor: COLOR.gold.main,
                      transform: "scale(1.03)",
                    },
                  }}
                />
              ))}
            </Box>
          </StackCol>
        )}

        {/* ── Tab: Màu Nền (Backgrounds) ── */}
        {activeTab === "backgrounds" && (
          <StackCol spacing={SPACING.px16}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
              TÔNG MÀU NỀN THIỆP
            </HeadingElement>

            {/* Custom Color Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: COLOR.bgSecondary,
                borderRadius: RADIUS.sm,
                border: `1px solid ${COLOR.borderGoldLight}`,
                px: SPACING.px8,
                py: SPACING.px4,
                gap: SPACING.px8,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: RADIUS.full,
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
                  fontSize: FONT_SIZE.xs,
                  fontFamily: "monospace",
                  fontWeight: FONT_WEIGHT.semibold,
                  color: COLOR.textPrimary,
                  background: "transparent",
                }}
              />
              <Tooltip title="Mở bảng màu" arrow>
                <Box
                  component="label"
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconElement name="ColorLens" size="xs" color={COLOR.gold.main} />
                  <input
                    type="color"
                    value={customBgHex.startsWith("#") ? customBgHex : COLOR.bgPrimary}
                    onChange={(e) => handleCustomBgChange(e.target.value)}
                    style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                  />
                </Box>
              </Tooltip>
            </Box>

            <Divider sx={{ borderColor: COLOR.divider }} />

            {/* Danh sách bảng màu chuẩn luxury */}
            <StackCol spacing={SPACING.px6}>
              {BG_PRESETS.map((bg, idx) => {
                const isSelected = customBgHex.toLowerCase() === bg.color.toLowerCase();
                return (
                  <Box
                    key={idx}
                    onClick={() => handleCustomBgChange(bg.color)}
                    sx={{
                      p: "8px 12px",
                      cursor: "pointer",
                      borderRadius: RADIUS.md,
                      border: `1.5px solid ${isSelected ? COLOR.gold.main : COLOR.borderGoldLight}`,
                      backgroundColor: COLOR.bgSecondary,
                      display: "flex",
                      alignItems: "center",
                      gap: SPACING.px12,
                      transition: ANIMATION.sm,
                      "&:hover": {
                        borderColor: COLOR.gold.main,
                        backgroundColor: COLOR.bgPaper,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: RADIUS.full,
                        backgroundColor: bg.color,
                        border: `1.5px solid ${bg.dot}`,
                        flexShrink: 0,
                      }}
                    />
                    <StackCol spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                      <TextElement
                        size="xs"
                        weight="bold"
                        sx={{ color: isSelected ? COLOR.gold.main : COLOR.textPrimary }}
                      >
                        {bg.name}
                      </TextElement>
                      <TextElement
                        size="xs"
                        colorVariant="secondary"
                        sx={{ fontSize: "0.65rem", lineHeight: 1.1 }}
                      >
                        {bg.desc}
                      </TextElement>
                    </StackCol>
                    {isSelected && (
                      <IconElement name="Check" size="xs" color={COLOR.gold.main} />
                    )}
                  </Box>
                );
              })}
            </StackCol>
          </StackCol>
        )}
      </Box>
    </Box>
  );
};
