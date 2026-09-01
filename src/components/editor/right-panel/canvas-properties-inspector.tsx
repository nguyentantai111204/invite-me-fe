"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Divider,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ICanvasLayer, ICanvasTextLayer } from "@/interfaces/canvas-editor.interface";
import { COLOR, RADIUS, SHADOW, FONT_SIZE, FONT_WEIGHT, SPACING, ANIMATION } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackCol,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
} from "@/components/shared";

interface ICanvasPropertiesInspectorProps {
  selectedLayer: ICanvasLayer | null;
  canvasBg: string;
  canvasHeight: number;
  onUpdateLayer: (id: string, updates: Partial<ICanvasLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onDeselect: () => void;
  onSetBackground: (color: string) => void;
  onExpandHeight: (delta: number) => void;
}

const PRESET_COLORS = [
  { label: "Vàng Hoàng Kim", hex: "#B78628" },
  { label: "Vàng Mù Tạt",    hex: "#C59B4B" },
  { label: "Nâu Đen Đậm",    hex: "#221A12" },
  { label: "Nhung Đỏ",       hex: "#8B1E2B" },
  { label: "Rượu Vang",      hex: "#8B2435" },
  { label: "Hồng Đào",       hex: "#DE7C66" },
  { label: "Hổ Phách",       hex: "#D97706" },
  { label: "Nâu Đồng",       hex: "#78350F" },
  { label: "Xám Đá",         hex: "#6B7280" },
  { label: "Xám Nhạt",       hex: "#E5E7EB" },
  { label: "Trắng Tinh Khôi", hex: "#FFFFFF" },
];

const BG_PALETTES = [
  { name: "Trắng Hoàng Kim", color: "#FFFFFF", border: "#C59B4B" },
  { name: "Kem Ngọc Trai",   color: "#FCFAF6", border: "#E0D1B9" },
  { name: "Hồng Pastel",     color: "#FFF8F7", border: "#E58B7B" },
  { name: "Nhung Đỏ Cổ Điển", color: "#3B1117", border: "#8B1E2B" },
];

export const CanvasPropertiesInspector: React.FC<ICanvasPropertiesInspectorProps> = ({
  selectedLayer,
  canvasBg,
  canvasHeight,
  onUpdateLayer,
  onDeleteLayer,
  onBringForward,
  onSendBackward,
  onDeselect,
  onSetBackground,
  onExpandHeight,
}) => {
  const [customHex, setCustomHex] = useState<string>("#B78628");

  const isText = selectedLayer?.type === "text";
  const txtLayer = isText ? (selectedLayer as ICanvasTextLayer) : null;

  const handleHexChange = (hex: string) => {
    setCustomHex(hex);
    if (txtLayer) {
      onUpdateLayer(txtLayer.id, { fill: hex });
    }
  };

  return (
    <Box
      sx={{
        width: 330,
        height: "100%",
        backgroundColor: COLOR.bgPaper,
        borderLeft: `1px solid ${COLOR.borderGoldLight}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        p: SPACING.px16,
        zIndex: 20,
        flexShrink: 0,
        "&::-webkit-scrollbar": { width: "5px" },
        "&::-webkit-scrollbar-thumb": {
          background: COLOR.borderSubtle,
          borderRadius: RADIUS.xs,
        },
      }}
    >
      {selectedLayer ? (
        <StackCol spacing={SPACING.px16}>
          {/* Header */}
          <StackRowAlignJustBetween sx={{ alignItems: "center", pt: 0.5 }}>
            <StackCol spacing={0}>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
                THUỘC TÍNH ĐỐI TƯỢNG
              </HeadingElement>
              <TextElement size="xs" colorVariant="gold" weight="bold">
                {selectedLayer.name || selectedLayer.type.toUpperCase()}
              </TextElement>
            </StackCol>

            <Tooltip title="Xóa đối tượng này khỏi thiệp" arrow>
              <IconButton
                size="small"
                onClick={() => onDeleteLayer(selectedLayer.id)}
                sx={{
                  color: COLOR.status.error.main,
                  backgroundColor: COLOR.status.error.light,
                  borderRadius: RADIUS.md,
                  p: 0.75,
                  "&:hover": { backgroundColor: `${COLOR.status.error.main}33` },
                }}
              >
                <IconElement name="Delete" size="xs" />
              </IconButton>
            </Tooltip>
          </StackRowAlignJustBetween>

          {/* 1. Kiểu chữ & Font (nếu là layer Text) */}
          {isText && txtLayer && (
            <Paper
              elevation={0}
              sx={{
                p: SPACING.px16,
                borderRadius: RADIUS.md,
                border: `1px solid ${COLOR.borderGoldLight}`,
                backgroundColor: COLOR.bgSecondary,
              }}
            >
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px12 }}>
                ✍️ Kiểu chữ & Cỡ chữ
              </TextElement>

              <StackCol spacing={SPACING.px12}>
                {/* Font Selector */}
                <Box>
                  <TextElement size="xs" weight="semibold" sx={{ mb: SPACING.px4 }}>
                    Phông chữ nghệ thuật
                  </TextElement>
                  <Select
                    fullWidth
                    size="small"
                    value={txtLayer.fontFamily || "'Playfair Display', serif"}
                    onChange={(e) => onUpdateLayer(txtLayer.id, { fontFamily: e.target.value })}
                    sx={{ backgroundColor: COLOR.bgPaper, fontSize: FONT_SIZE.sm, borderRadius: RADIUS.sm }}
                  >
                    <MenuItem value="'Playfair Display', serif">Playfair Display (Serif Quý Tộc)</MenuItem>
                    <MenuItem value="Inter, sans-serif">Inter (Hiện Đại Sang Trọng)</MenuItem>
                    <MenuItem value="'Great Vibes', cursive">Great Vibes (Nghệ Thuật Uốn Lượn)</MenuItem>
                    <MenuItem value="'Cinzel', serif">Cinzel (Hoàng Gia Châu Âu)</MenuItem>
                  </Select>
                </Box>

                {/* Size & Bold/Italic */}
                <Box>
                  <StackRowAlignJustBetween sx={{ mb: SPACING.px4 }}>
                    <TextElement size="xs" weight="semibold">
                      Cỡ chữ (px)
                    </TextElement>
                    <TextElement size="xs" weight="semibold">
                      Đậm / Nghiêng
                    </TextElement>
                  </StackRowAlignJustBetween>
                  <StackRowAlignJustBetween>
                    <Select
                      size="small"
                      value={txtLayer.fontSize || 22}
                      onChange={(e) => onUpdateLayer(txtLayer.id, { fontSize: Number(e.target.value) })}
                      sx={{ width: 110, backgroundColor: COLOR.bgPaper, fontSize: FONT_SIZE.sm, borderRadius: RADIUS.sm }}
                    >
                      {[11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 30, 32, 36, 42, 48].map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}px
                        </MenuItem>
                      ))}
                    </Select>

                    <ToggleButtonGroup size="small" sx={{ backgroundColor: COLOR.bgPaper }}>
                      <ToggleButton
                        value="bold"
                        selected={txtLayer.fontWeight === "bold"}
                        onClick={() =>
                          onUpdateLayer(txtLayer.id, {
                            fontWeight: txtLayer.fontWeight === "bold" ? "normal" : "bold",
                          })
                        }
                      >
                        <Tooltip title="In đậm" arrow>
                          <span><IconElement name="FormatBold" size="xs" /></span>
                        </Tooltip>
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
                        <Tooltip title="In nghiêng" arrow>
                          <span><IconElement name="FormatItalic" size="xs" /></span>
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </StackRowAlignJustBetween>
                </Box>

                {/* Căn lề */}
                <Box>
                  <TextElement size="xs" weight="semibold" sx={{ mb: SPACING.px4 }}>
                    Căn lề dòng chữ
                  </TextElement>
                  <ToggleButtonGroup
                    fullWidth
                    size="small"
                    value={txtLayer.textAlign || "center"}
                    exclusive
                    onChange={(_, val) => val && onUpdateLayer(txtLayer.id, { textAlign: val })}
                    sx={{ backgroundColor: COLOR.bgPaper }}
                  >
                    <ToggleButton value="left">
                      <Tooltip title="Căn trái" arrow><span><IconElement name="FormatAlignLeft" size="xs" /></span></Tooltip>
                    </ToggleButton>
                    <ToggleButton value="center">
                      <Tooltip title="Căn giữa" arrow><span><IconElement name="FormatAlignCenter" size="xs" /></span></Tooltip>
                    </ToggleButton>
                    <ToggleButton value="right">
                      <Tooltip title="Căn phải" arrow><span><IconElement name="FormatAlignRight" size="xs" /></span></Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </StackCol>
            </Paper>
          )}

          {/* 2. Màu sắc (nếu là Text) */}
          {isText && txtLayer && (
            <Paper
              elevation={0}
              sx={{
                p: SPACING.px16,
                borderRadius: RADIUS.md,
                border: `1px solid ${COLOR.borderGoldLight}`,
                backgroundColor: COLOR.bgSecondary,
              }}
            >
              <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px12 }}>
                🎨 Màu chữ & Bảng màu
              </TextElement>

              {/* Swatches */}
              <Grid container spacing={SPACING.px6} sx={{ mb: SPACING.px12 }}>
                {PRESET_COLORS.map((item) => {
                  const isSelected = txtLayer.fill?.toLowerCase() === item.hex.toLowerCase();
                  return (
                    <Grid size={{ xs: 2 }} key={item.hex}>
                      <Tooltip title={item.label} arrow>
                        <Box
                          onClick={() => onUpdateLayer(txtLayer.id, { fill: item.hex })}
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: RADIUS.full,
                            backgroundColor: item.hex,
                            border: `1px solid ${COLOR.borderSubtle}`,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: isSelected ? `0 0 0 2px ${COLOR.bgSecondary}, 0 0 0 4px ${COLOR.gold.main}` : "none",
                            transition: ANIMATION.sm,
                            "&:hover": { transform: "scale(1.15)" },
                          }}
                        >
                          {isSelected && (
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: item.hex === "#FFFFFF" || item.hex === "#FAF8F5" ? COLOR.textPrimary : COLOR.textInverse,
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Custom Color Input */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: COLOR.bgPaper,
                  borderRadius: RADIUS.sm,
                  border: `1px solid ${COLOR.borderSubtle}`,
                  px: SPACING.px12,
                  py: SPACING.px6,
                  gap: SPACING.px8,
                  transition: ANIMATION.sm,
                  "&:focus-within": {
                    borderColor: COLOR.gold.main,
                    boxShadow: `0 0 0 2px ${COLOR.gold[100]}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: RADIUS.xs,
                    backgroundColor: txtLayer.fill || "#B78628",
                    border: `1px solid ${COLOR.borderSubtle}`,
                    flexShrink: 0,
                  }}
                />
                <input
                  type="text"
                  value={txtLayer.fill || "#B78628"}
                  onChange={(e) => onUpdateLayer(txtLayer.id, { fill: e.target.value })}
                  placeholder="#B78628"
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
                <Tooltip title="Chọn từ bảng màu" arrow>
                  <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <IconElement name="ColorLens" size="xs" color={COLOR.gold.main} />
                    <input
                      type="color"
                      value={txtLayer.fill?.startsWith("#") ? txtLayer.fill : "#B78628"}
                      onChange={(e) => handleHexChange(e.target.value)}
                      style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                    />
                  </label>
                </Tooltip>
              </Box>
            </Paper>
          )}

          {/* 3. Hiệu ứng xuất hiện khi cuộn */}
          <Paper
            elevation={0}
            sx={{
              p: SPACING.px16,
              borderRadius: RADIUS.md,
              border: `1px solid ${COLOR.borderGoldLight}`,
              backgroundColor: COLOR.bgSecondary,
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px8 }}>
              ✨ Hiệu ứng xuất hiện khi cuộn tới
            </TextElement>
            <Select
              fullWidth
              size="small"
              value={selectedLayer.animation || "fade-in"}
              onChange={(e) => onUpdateLayer(selectedLayer.id, { animation: e.target.value as any })}
              sx={{ backgroundColor: COLOR.bgPaper, fontSize: FONT_SIZE.sm, borderRadius: RADIUS.sm }}
            >
              <MenuItem value="none">Không hiệu ứng (Tĩnh)</MenuItem>
              <MenuItem value="fade-in">Hiện mờ ảo nhẹ nhàng (Fade In)</MenuItem>
              <MenuItem value="slide-up">Trượt êm từ dưới lên (Slide Up)</MenuItem>
              <MenuItem value="zoom-in">Phóng to nhẹ trang trọng (Zoom In)</MenuItem>
            </Select>
          </Paper>

          {/* 4. Thứ tự lớp */}
          <Paper
            elevation={0}
            sx={{
              p: SPACING.px16,
              borderRadius: RADIUS.md,
              border: `1px solid ${COLOR.borderGoldLight}`,
              backgroundColor: COLOR.bgSecondary,
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px8 }}>
              📑 Thứ tự lớp & Hiển thị
            </TextElement>
            <StackRowAlignJustBetween sx={{ gap: SPACING.px8 }}>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="md"
                onClick={() => onBringForward(selectedLayer.id)}
                leftIcon={<IconElement name="ArrowUpward" size="xs" />}
                sx={{ flex: 1, backgroundColor: COLOR.bgPaper, fontSize: FONT_SIZE.xs }}
              >
                Lên 1 Lớp
              </ButtonElement>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="md"
                onClick={() => onSendBackward(selectedLayer.id)}
                leftIcon={<IconElement name="ArrowDownward" size="xs" />}
                sx={{ flex: 1, backgroundColor: COLOR.bgPaper, fontSize: FONT_SIZE.xs }}
              >
                Xuống 1 Lớp
              </ButtonElement>
            </StackRowAlignJustBetween>
          </Paper>

          {/* Bỏ chọn */}
          <ButtonElement
            variant="text"
            size="small"
            onClick={onDeselect}
            leftIcon={<IconElement name="Close" size="xs" />}
            sx={{ color: COLOR.textSecondary }}
          >
            Bỏ chọn đối tượng
          </ButtonElement>
        </StackCol>
      ) : (
        /* Unselected State: Document Level Settings */
        <StackCol spacing={SPACING.px20}>
          <Box>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.md }}>
              CÀI ĐẶT THIỆP CƯỚI
            </HeadingElement>
            <TextElement size="xs" colorVariant="secondary" sx={{ mt: SPACING.px4 }}>
              Tùy chỉnh kích thước & màu nền tổng thể.
            </TextElement>
          </Box>

          {/* Hướng dẫn nhanh */}
          <Paper
            elevation={0}
            sx={{
              p: SPACING.px12,
              borderRadius: RADIUS.md,
              backgroundColor: `${COLOR.gold.main}10`,
              border: `1px solid ${COLOR.borderGoldLight}`,
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ mb: SPACING.px4 }}>
              💡 Mẹo thiết kế nhanh:
            </TextElement>
            <TextElement size="xs" colorVariant="secondary" sx={{ lineHeight: 1.5 }}>
              • Nhấp trực tiếp vào bất kỳ dòng chữ, ảnh cưới hoặc họa tiết trên thiệp ở giữa để kéo thả và chỉnh sửa.
              <br />
              • Dùng thanh công cụ bên trái để thêm ảnh cưới, lời chúc hoặc đổi hiệu ứng mở thiệp 3D.
            </TextElement>
          </Paper>

          {/* Kích thước & Chiều dài thiệp */}
          <Paper
            elevation={0}
            sx={{
              p: SPACING.px16,
              borderRadius: RADIUS.md,
              border: `1px solid ${COLOR.borderGoldLight}`,
              backgroundColor: COLOR.bgSecondary,
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px4 }}>
              📐 Kích thước & Độ dài thiệp
            </TextElement>
            <TextElement size="xs" colorVariant="secondary" sx={{ mb: SPACING.px8 }}>
              Rộng 390px (Chuẩn Mobile) × Dài {canvasHeight}px
            </TextElement>

            <StackRowAlignJustBetween sx={{ gap: SPACING.px8 }}>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="md"
                onClick={() => onExpandHeight(300)}
                leftIcon={<IconElement name="Add" size="xs" />}
                sx={{ flex: 1, backgroundColor: COLOR.bgPaper, fontSize: FONT_SIZE.xs }}
              >
                + Kéo Dài (+300px)
              </ButtonElement>
              {canvasHeight > 780 && (
                <ButtonElement
                  variant="outline"
                  size="small"
                  rounded="md"
                  onClick={() => onExpandHeight(-300)}
                  leftIcon={<IconElement name="Remove" size="xs" />}
                  sx={{ flex: 1, backgroundColor: COLOR.bgPaper, fontSize: FONT_SIZE.xs }}
                >
                  - Thu Gọn (-300px)
                </ButtonElement>
              )}
            </StackRowAlignJustBetween>
          </Paper>

          {/* Màu nền tổng thể */}
          <Paper
            elevation={0}
            sx={{
              p: SPACING.px16,
              borderRadius: RADIUS.md,
              border: `1px solid ${COLOR.borderGoldLight}`,
              backgroundColor: COLOR.bgSecondary,
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: SPACING.px8 }}>
              🎨 Tông màu nền thiệp
            </TextElement>
            <Grid container spacing={SPACING.px8}>
              {BG_PALETTES.map((bg) => (
                <Grid size={{ xs: 6 }} key={bg.color}>
                  <Paper
                    elevation={0}
                    onClick={() => onSetBackground(bg.color)}
                    sx={{
                      p: SPACING.px8,
                      borderRadius: RADIUS.sm,
                      border: `2px solid ${canvasBg === bg.color ? COLOR.gold.main : COLOR.borderGoldLight}`,
                      backgroundColor: bg.color,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: SPACING.px6,
                      boxShadow: canvasBg === bg.color ? SHADOW.sm : "none",
                      transition: ANIMATION.sm,
                      "&:hover": { transform: "scale(1.03)" },
                    }}
                  >
                    <Box sx={{ width: 14, height: 14, borderRadius: RADIUS.full, backgroundColor: bg.border, flexShrink: 0 }} />
                    <TextElement size="xs" weight="semibold" sx={{ fontSize: FONT_SIZE.xs, color: bg.color === "#3B1117" ? COLOR.textInverse : COLOR.textPrimary, whiteSpace: "nowrap" }}>
                      {bg.name}
                    </TextElement>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </StackCol>
      )}
    </Box>
  );
};
