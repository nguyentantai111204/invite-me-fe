"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Divider,
  Chip,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ICanvasLayer, ICanvasTextLayer, ICanvasImageLayer, ICanvasShapeLayer } from "@/interfaces/canvas-editor.interface";
import { COLOR, RADIUS, SHADOW, FONT_SIZE, FONT_WEIGHT, SPACING, ANIMATION } from "@/constants/style.constant";
import { CARD_ITEM_SX, SELECTABLE_ITEM_SX, PANEL_RAIL_SX, PANEL_CONTENT_SX } from "../editor.styles";
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

export type SidebarTabType = "properties" | "text" | "stickers" | "shapes" | "uploads" | "backgrounds";

interface ICanvasSidebarProps {
  selectedLayer: ICanvasLayer | null;
  onUpdateLayer: (id: string, updates: Partial<ICanvasLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onDeselect: () => void;
  onAddText: (preset?: { text: string; fontSize: number; fontFamily: string; fontWeight?: "bold" | "normal"; fill?: string }) => void;
  onAddSticker: (emoji: string, size?: number) => void;
  onAddShape: (type: "rect" | "circle" | "divider") => void;
  onAddImage: (src: string) => void;
  onSetBackground: (color: string) => void;
}

export const CanvasSidebar: React.FC<ICanvasSidebarProps> = ({
  selectedLayer,
  onUpdateLayer,
  onDeleteLayer,
  onBringForward,
  onSendBackward,
  onDeselect,
  onAddText,
  onAddSticker,
  onAddShape,
  onAddImage,
  onSetBackground,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTabType>("text");
  const [stickerFilter, setStickerFilter] = useState<"all" | "floral" | "rings" | "badges">("all");

  // Automatically switch to Properties tab when a layer is selected
  useEffect(() => {
    if (selectedLayer) {
      setActiveTab("properties");
    }
  }, [selectedLayer]);

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
    ...(selectedLayer
      ? [{ id: "properties" as SidebarTabType, label: "Thuộc Tính", icon: "Tune" as const, highlight: true }]
      : []),
    { id: "text" as SidebarTabType, label: "Mẫu Chữ", icon: "TextFormat" as const, highlight: false },
    { id: "stickers" as SidebarTabType, label: "Họa Tiết", icon: "AutoAwesome" as const, highlight: false },
    { id: "shapes" as SidebarTabType, label: "Khung Hình", icon: "Crop" as const, highlight: false },
    { id: "uploads" as SidebarTabType, label: "Tải Ảnh", icon: "CloudUpload" as const, highlight: false },
    { id: "backgrounds" as SidebarTabType, label: "Màu Nền", icon: "Palette" as const, highlight: false },
  ];

  const isText = selectedLayer?.type === "text";
  const txtLayer = isText ? (selectedLayer as ICanvasTextLayer) : null;

  return (
    <Box sx={{ display: "flex", height: "100%", backgroundColor: COLOR.bgPaper, zIndex: 20 }}>
      {/* Tier 1: Slim Vertical Icon Rail */}
      <Box sx={{ ...PANEL_RAIL_SX, width: 72 }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <StackCenter
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              sx={{
                width: 60,
                height: 60,
                flexDirection: "column",
                borderRadius: RADIUS.md,
                cursor: "pointer",
                backgroundColor: isActive ? COLOR.bgPaper : item.highlight ? `${COLOR.gold.main}1A` : "transparent",
                color: isActive ? COLOR.gold.main : item.highlight ? COLOR.gold.main : COLOR.textTertiary,
                boxShadow: isActive ? SHADOW.sm : "none",
                border: isActive ? `1.5px solid ${COLOR.gold.light}` : item.highlight ? `1px dashed ${COLOR.gold.light}` : "1px solid transparent",
                transition: ANIMATION.sm,
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
                sx={{ fontSize: FONT_SIZE.xs, mt: SPACING.px4, color: "inherit" }}
              >
                {item.label}
              </TextElement>
            </StackCenter>
          );
        })}
      </Box>

      {/* ── Tier 2: Wide Content & Properties Panel ── */}
      <Box
        sx={{
          ...PANEL_CONTENT_SX,
          width: { xs: 270, sm: 320 },
          p: SPACING.px20,
        }}
      >
        {/* Tab 0: Thuộc Tính (Properties Panel on Left) */}
        {activeTab === "properties" && selectedLayer && (
          <StackCol spacing={2.5}>
            <StackRowAlignJustBetween>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1.05rem" }}>
                Thuộc Tính Đối Tượng
              </HeadingElement>
              <Tooltip title="Bỏ chọn">
                <IconButton size="small" onClick={onDeselect}>
                  <IconElement name="Close" size="xs" />
                </IconButton>
              </Tooltip>
            </StackRowAlignJustBetween>

            <Box
                sx={{
                  p: SPACING.px12,
                  backgroundColor: COLOR.bgSecondary,
                  borderRadius: RADIUS.md,
                  border: `1px solid ${COLOR.borderGoldLight}`,
                }}
              >
              <TextElement size="xs" colorVariant="secondary">
                Đang chọn:
              </TextElement>
              <TextElement size="sm" weight="bold" colorVariant="gold">
                {selectedLayer.name || selectedLayer.type.toUpperCase()}
              </TextElement>
            </Box>

            {/* Text Specific Properties */}
            {isText && txtLayer && (
              <>
                <Box>
                  <TextElement size="xs" weight="bold" sx={{ mb: 0.75 }}>
                    Font Chữ
                  </TextElement>
                  <Select
                    fullWidth
                    size="small"
                    value={txtLayer.fontFamily || "'Playfair Display', serif"}
                    onChange={(e) => onUpdateLayer(txtLayer.id, { fontFamily: e.target.value })}
                    sx={{ fontSize: FONT_SIZE.sm }}
                  >
                    <MenuItem value="'Playfair Display', serif">Playfair Display (Serif Quý Tộc)</MenuItem>
                    <MenuItem value="Inter, sans-serif">Inter (Hiện Đại Sang Trọng)</MenuItem>
                    <MenuItem value="'Great Vibes', cursive">Great Vibes (Nghệ Thuật Uốn Lượn)</MenuItem>
                    <MenuItem value="'Cinzel', serif">Cinzel (Hoàng Gia Châu Âu)</MenuItem>
                  </Select>
                </Box>

                <Box>
                  <TextElement size="xs" weight="bold" sx={{ mb: 0.75 }}>
                    Cỡ Chữ & Kiểu Dáng
                  </TextElement>
                  <StackRowAlignJustBetween>
                    <Select
                      size="small"
                      value={txtLayer.fontSize || 18}
                      onChange={(e) => onUpdateLayer(txtLayer.id, { fontSize: Number(e.target.value) })}
                      sx={{ width: 120, fontSize: FONT_SIZE.sm }}
                    >
                      {[11, 12, 13, 14, 16, 18, 20, 24, 28, 30, 32, 36, 42, 48].map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}px
                        </MenuItem>
                      ))}
                    </Select>

                    <ToggleButtonGroup size="small">
                      <ToggleButton
                        value="bold"
                        selected={txtLayer.fontWeight === "bold"}
                        onClick={() =>
                          onUpdateLayer(txtLayer.id, {
                            fontWeight: txtLayer.fontWeight === "bold" ? "normal" : "bold",
                          })
                        }
                      >
                        <IconElement name="FormatBold" size="xs" />
                      </ToggleButton>
                      <ToggleButton
                        value="italic"
                        selected={txtLayer.fontStyle === "italic"}
                        onClick={() =>
                          onUpdateLayer(txtLayer.id, {
                            fontStyle: txtLayer.fontStyle === "italic" ? "normal" : "italic",
                          })
                        }
                      >
                        <IconElement name="FormatItalic" size="xs" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </StackRowAlignJustBetween>
                </Box>

                <Box>
                  <TextElement size="xs" weight="bold" sx={{ mb: 0.75 }}>
                    Căn Lề
                  </TextElement>
                  <ToggleButtonGroup
                    fullWidth
                    size="small"
                    value={txtLayer.textAlign || "center"}
                    exclusive
                    onChange={(_, val) => val && onUpdateLayer(txtLayer.id, { textAlign: val })}
                  >
                    <ToggleButton value="left">
                      <IconElement name="FormatAlignLeft" size="xs" />
                    </ToggleButton>
                    <ToggleButton value="center">
                      <IconElement name="FormatAlignCenter" size="xs" />
                    </ToggleButton>
                    <ToggleButton value="right">
                      <IconElement name="FormatAlignRight" size="xs" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Box>
                  <TextElement size="xs" weight="bold" sx={{ mb: 0.75 }}>
                    Màu Chữ
                  </TextElement>
                  <Grid container spacing={1}>
                    {[
                      { name: "Vàng Gold", color: "#B78628" },
                      { name: "Đen Nâu", color: "#221A13" },
                      { name: "Nhung Đỏ", color: "#8B1E2B" },
                      { name: "Hồng Cam", color: "#DE7C66" },
                      { name: "Trắng Sáng", color: "#FFFFFF" },
                      { name: "Xám Bạc", color: "#6D5E4D" },
                    ].map((c) => (
                      <Grid size={{ xs: 4 }} key={c.color}>
                        <Paper
                          elevation={0}
                          onClick={() => onUpdateLayer(txtLayer.id, { fill: c.color })}
                          sx={{
                            p: 1,
                            borderRadius: RADIUS.md,
                            border: `2px solid ${txtLayer.fill === c.color ? COLOR.gold.main : COLOR.borderGoldLight}`,
                            backgroundColor: COLOR.bgSecondary,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: SPACING.px8,
                            transition: ANIMATION.sm,
                          }}
                        >
                          <Box sx={{ width: 16, height: 16, borderRadius: RADIUS.full, backgroundColor: c.color, border: "1px solid #D5D5D5" }} />
                          <TextElement size="xs" weight="semibold" sx={{ fontSize: "0.68rem" }}>
                            {c.name}
                          </TextElement>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </>
            )}

            <Divider />

            {/* Layer Z-Index Order Controls */}
            <Box>
              <TextElement size="xs" weight="bold" sx={{ mb: 1 }}>
                Thứ Tự Lớp & Vị Trí
              </TextElement>
              <StackRowAlignJustBetween>
                <ButtonElement
                  variant="outline"
                  size="small"
                  rounded="md"
                  onClick={() => onBringForward(selectedLayer.id)}
                  leftIcon={<IconElement name="ArrowUpward" size="xs" />}
                >
                  Lên 1 Lớp
                </ButtonElement>
                <ButtonElement
                  variant="outline"
                  size="small"
                  rounded="md"
                  onClick={() => onSendBackward(selectedLayer.id)}
                  leftIcon={<IconElement name="ArrowDownward" size="xs" />}
                >
                  Xuống 1 Lớp
                </ButtonElement>
              </StackRowAlignJustBetween>
            </Box>

            <Divider />

            {/* Delete Layer Button */}
            <ButtonElement
              variant="outline"
              size="medium"
              fullWidth
              rounded="md"
              color="error"
              onClick={() => onDeleteLayer(selectedLayer.id)}
              leftIcon={<IconElement name="Delete" size="xs" />}
              sx={{ borderColor: COLOR.status.error.main, color: COLOR.status.error.main }}
            >
              Xóa Đối Tượng Này
            </ButtonElement>
          </StackCol>
        )}

        {/* Tab: Văn Bản (Text Presets) */}
        {activeTab === "text" && (
          <StackCol spacing={2.5}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1.05rem" }}>
              Mẫu Chữ Nghệ Thuật
            </HeadingElement>

            <ButtonElement
              variant="gradient"
              size="medium"
              fullWidth
              rounded="md"
              onClick={() => onAddText({ text: "TIÊU ĐỀ MỚI", fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: "bold" })}
              leftIcon={<IconElement name="Add" size="xs" />}
            >
              Thêm Tiêu Đề Lớn
            </ButtonElement>

            <ButtonElement
              variant="outline"
              size="small"
              fullWidth
              rounded="md"
              onClick={() => onAddText({ text: "Đoạn văn mô tả lời mời", fontSize: 14, fontFamily: "Inter, sans-serif" })}
            >
              + Thêm Đoạn Văn
            </ButtonElement>

            <Divider />

            <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="wide">
              MẪU CHỮ CƯỚI (NHẤP ĐỂ CHÈN)
            </TextElement>

            {[
              { label: "SAVE THE DATE", sub: "Hoàng Gia Sang Trọng", size: 12, font: "Inter, sans-serif", weight: "bold" as const, fill: "#B78628" },
              { label: "LỄ THÀNH HÔN", sub: "Font Serif Cổ Điển", size: 16, font: "'Playfair Display', serif", weight: "bold" as const, fill: "#221A13" },
              { label: "Minh Quân & Thanh Trúc", sub: "Tên Cặp Đôi", size: 26, font: "'Playfair Display', serif", weight: "bold" as const, fill: "#221A13" },
              { label: "Trân trọng kính mời quý khách", sub: "Nét Nghiêng Quý Tộc", size: 13, font: "Inter, sans-serif", weight: "normal" as const, fill: "#6D5E4D" },
              { label: "CHỦ NHẬT • 20.11.2026", sub: "Ngày Cưới", size: 13, font: "Inter, sans-serif", weight: "bold" as const, fill: "#B78628" },
              { label: "Park Hyatt Sài Gòn", sub: "Trung Tâm Sự Kiện", size: 13, font: "Inter, sans-serif", weight: "normal" as const, fill: "#4A3E31" },
            ].map((preset, idx) => (
              <Paper
                key={idx}
                elevation={0}
                onClick={() => onAddText({ text: preset.label, fontSize: preset.size, fontFamily: preset.font, fontWeight: preset.weight, fill: preset.fill })}
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  borderRadius: RADIUS.md,
                  border: "1px solid #ECE7DD",
                  backgroundColor: "#FAF9F6",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: COLOR.gold.main,
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(183, 134, 40, 0.15)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.68rem" }}>
                  {preset.sub}
                </TextElement>
                <HeadingElement variant="h6" weight="bold" sx={{ fontFamily: preset.font, color: preset.fill, mt: 0.5, fontSize: "0.95rem" }}>
                  {preset.label}
                </HeadingElement>
              </Paper>
            ))}
          </StackCol>
        )}

        {/* Tab: Stickers & Họa Tiết Cưới */}
        {activeTab === "stickers" && (
          <StackCol spacing={2}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1.05rem" }}>
              Họa Tiết & Sticker Cưới
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

            {/* Floral Collection */}
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
                          border: "1px solid #ECE7DD",
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

            {/* Rings & Love Collection */}
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
                          border: "1px solid #ECE7DD",
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

            {/* Royal Badges */}
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
                          border: "1px solid #ECE7DD",
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

        {/* Tab: Khung Viền & Hình Khối */}
        {activeTab === "shapes" && (
          <StackCol spacing={2}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1.05rem" }}>
              Khung Viền & Dải Phân Cách
            </HeadingElement>

            <Paper
              elevation={0}
              onClick={() => onAddShape("divider")}
              sx={{
                p: 2,
                cursor: "pointer",
                borderRadius: RADIUS.md,
                border: "1px solid #ECE7DD",
                backgroundColor: "#FAF9F6",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": { borderColor: COLOR.gold.main, backgroundColor: "#FFFFFF" },
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
                border: "1px solid #ECE7DD",
                backgroundColor: "#FAF9F6",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": { borderColor: COLOR.gold.main, backgroundColor: "#FFFFFF" },
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
                border: "1px solid #ECE7DD",
                backgroundColor: "#FAF9F6",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": { borderColor: COLOR.gold.main, backgroundColor: "#FFFFFF" },
              }}
            >
              <Box sx={{ width: 28, height: 28, border: "2px solid #B78628", borderRadius: "50%" }} />
              <TextElement size="sm" weight="bold">
                Khung Tròn Chân Dung
              </TextElement>
            </Paper>
          </StackCol>
        )}

        {/* Tab: Tải Ảnh Cá Nhân (Uploads) */}
        {activeTab === "uploads" && (
          <StackCol spacing={2.5}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1.05rem" }}>
              Tải Ảnh Cưới Lên
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
                      border: "1px solid #ECE7DD",
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "scale(1.04)", borderColor: COLOR.gold.main },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </StackCol>
        )}

        {/* Tab: Bảng Màu Nền (Backgrounds) */}
        {activeTab === "backgrounds" && (
          <StackCol spacing={2}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1.05rem" }}>
              Bảng Màu Nền Thiệp
            </HeadingElement>

            {[
              { name: "Trắng Hoàng Kim", color: "#FFFFFF", border: "#C59B4B" },
              { name: "Kem Ngọc Trai", color: "#FAF8F5", border: "#E0D1B9" },
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
                  p: SPACING.px12,
                  cursor: "pointer",
                  borderRadius: RADIUS.md,
                  border: `2px solid ${bg.border}`,
                  backgroundColor: bg.color,
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING.px16,
                  transition: ANIMATION.sm,
                  "&:hover": { transform: "scale(1.02)", boxShadow: SHADOW.sm },
                }}
              >
                <Box sx={{ width: 28, height: 28, borderRadius: RADIUS.full, backgroundColor: bg.border }} />
                <TextElement size="sm" weight="bold" sx={{ color: bg.color === "#3B1117" || bg.color === "#161B26" ? COLOR.textInverse : COLOR.textPrimary }}>
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
