"use client";

import React from "react";
import {
  Box,
  Divider,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  Slider,
} from "@mui/material";
import {
  ICanvasLayer,
  ICanvasTextLayer,
  ICanvasImageLayer,
  ICanvasShapeLayer,
  ICanvasCalendarLayer,
  ICanvasTimelineLayer,
  ICanvasCountdownLayer,
  ICanvasEventInfoLayer,
  CanvasElementAnimationType,
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
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  IconName,
  StackCol,
  StackRow,
  StackRowAlignJustBetween,
  StackRowAlignJustStart,
  StackCenter,
} from "@/components/shared";

export interface ICanvasPropertiesInspectorProps {
  selectedLayer: ICanvasLayer | null;
  canvasBg: string;
  canvasHeight: number;
  ambientParticle?: CanvasAmbientParticleType;
  openingEffect?: CanvasOpeningEffectType;
  onUpdateLayer: (id: string, updates: Partial<ICanvasLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer?: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onDeselect: () => void;
  onSetBackground: (color: string) => void;
  onSetOpeningEffect?: (effect: CanvasOpeningEffectType) => void;
  onSetAmbientParticle?: (particle: CanvasAmbientParticleType) => void;
  onExpandHeight: (delta: number) => void;
}

const LUXURY_PALETTE = [
  { label: "Vàng Hoàng Kim", hex: "#B78628" },
  { label: "Vàng Sâm Panh", hex: "#C59B4B" },
  { label: "Đỏ Rượu Vang", hex: "#8B1E2B" },
  { label: "Nhung Đỏ Đậm", hex: "#3B1117" },
  { label: "Hồng San Hô", hex: "#DE7C66" },
  { label: "Hổ Phách Ấm", hex: "#D97706" },
  { label: "Nâu Espresso", hex: "#221A12" },
  { label: "Xanh Rêu Quý Tộc", hex: "#1A2F23" },
  { label: "Xám Đá Tinh Tế", hex: "#6B7280" },
  { label: "Trắng Ngọc Trai", hex: "#FFFFFF" },
];

const FONT_OPTIONS = [
  { label: "Playfair Display", value: "'Playfair Display', serif", category: "Serif Quý Phái" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif", category: "Serif Cổ Điển" },
  { label: "Inter", value: "Inter, sans-serif", category: "Hiện Đại Tối Giản" },
  { label: "Be Vietnam Pro", value: "'Be Vietnam Pro', sans-serif", category: "Chuẩn Tiếng Việt" },
  { label: "Great Vibes", value: "'Great Vibes', cursive", category: "Thư Pháp Sang Trọng" },
  { label: "Cinzel", value: "'Cinzel', serif", category: "Hoàng Gia Châu Âu" },
];

const BG_PALETTES = [
  { name: "Trắng Hoàng Kim", color: "#FFFFFF", border: "#C59B4B", darkText: true },
  { name: "Kem Ngọc Trai", color: "#FCFAF6", border: "#E0D1B9", darkText: true },
  { name: "Hồng Pastel", color: "#FFF8F7", border: "#E58B7B", darkText: true },
  { name: "Nhung Đỏ Hoàng Gia", color: "#3B1117", border: "#8B1E2B", darkText: false },
  { name: "Xanh Rêu Quý Tộc", color: "#1A2F23", border: "#2D5A43", darkText: false },
  { name: "Espresso Đậm", color: "#1A1612", border: "#4A3B2C", darkText: false },
];

const ANIMATION_OPTIONS: { label: string; value: CanvasElementAnimationType; icon: IconName }[] = [
  { label: "Không hiệu ứng", value: "none", icon: "Clear" },
  { label: "Hiện mờ dần (Fade In)", value: "fade-in", icon: "Visibility" },
  { label: "Trượt lên (Slide Up)", value: "slide-up", icon: "ArrowUpward" },
  { label: "Phóng to nhẹ (Zoom In)", value: "zoom-in", icon: "CenterFocusStrong" },
  { label: "Tỏa sáng (Shimmer)", value: "shimmer", icon: "AutoAwesome" },
  { label: "Nhấp nhô (Bounce)", value: "bounce", icon: "TouchApp" },
];

const OPENING_OPTIONS: { label: string; value: CanvasOpeningEffectType; desc: string }[] = [
  { label: "Bao thư 3D (Envelope)", value: "envelope-3d", desc: "Mở nắp phong bì chạm nổi" },
  { label: "Cánh cửa đôi (Gate Fold)", value: "gate-fold", desc: "Mở 2 cánh sang hai bên" },
  { label: "Cuộn thư cổ (Scroll)", value: "scroll", desc: "Mở cuộn hoàng gia từ từ" },
  { label: "Hiện mờ (Fade In)", value: "fade", desc: "Xuất hiện êm dịu và sang trọng" },
];

const PARTICLE_OPTIONS: { label: string; value: CanvasAmbientParticleType; desc: string }[] = [
  { label: "Không có", value: "none", desc: "Không hiệu ứng hạt" },
  { label: "Hoa anh đào (Sakura)", value: "sakura", desc: "Cánh hoa đào rơi nhẹ nhàng" },
  { label: "Bụi vàng (Gold Dust)", value: "gold-dust", desc: "Bụi kim tuyến hoàng kim lấp lánh" },
  { label: "Trái tim (Hearts)", value: "hearts", desc: "Tim bay lãng mạn tình yêu" },
  { label: "Bông tuyết (Snow)", value: "snow", desc: "Tuyết rơi mùa đông kỳ diệu" },
];

// Reusable Section Card Styling
const SECTION_CARD_SX = {
  width: "100%",
  boxSizing: "border-box" as const,
  p: SPACING.px12,
  borderRadius: RADIUS.md,
  border: `1px solid ${COLOR.borderGoldLight}`,
  backgroundColor: COLOR.bgSecondary,
  display: "flex",
  flexDirection: "column" as const,
  gap: SPACING.px8,
};

export const CanvasPropertiesInspector: React.FC<ICanvasPropertiesInspectorProps> = ({
  selectedLayer,
  canvasBg,
  canvasHeight,
  ambientParticle = "gold-dust",
  openingEffect = "envelope-3d",
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onBringForward,
  onSendBackward,
  onDeselect,
  onSetBackground,
  onSetOpeningEffect,
  onSetAmbientParticle,
  onExpandHeight,
}) => {
  const isText = selectedLayer?.type === "text";
  const isImage = selectedLayer?.type === "image";
  const isShape = selectedLayer?.type === "shape";
  const isCalendar = selectedLayer?.type === "calendar";
  const isTimeline = selectedLayer?.type === "timeline";
  const isCountdown = selectedLayer?.type === "countdown";
  const isEventInfo = selectedLayer?.type === "event-info";

  const txtLayer = isText ? (selectedLayer as ICanvasTextLayer) : null;
  const imgLayer = isImage ? (selectedLayer as ICanvasImageLayer) : null;
  const shapeLayer = isShape ? (selectedLayer as ICanvasShapeLayer) : null;
  const calLayer = isCalendar ? (selectedLayer as ICanvasCalendarLayer) : null;
  const tmLayer = isTimeline ? (selectedLayer as ICanvasTimelineLayer) : null;
  const cdLayer = isCountdown ? (selectedLayer as ICanvasCountdownLayer) : null;
  const eiLayer = isEventInfo ? (selectedLayer as ICanvasEventInfoLayer) : null;

  const currentFill = txtLayer?.fill || shapeLayer?.fill || "#B78628";

  const handleCenterAlignHorizontal = () => {
    if (!selectedLayer) return;
    const width = selectedLayer.width || 300;
    const centeredX = Math.max(0, Math.round((390 - width) / 2));
    onUpdateLayer(selectedLayer.id, { x: centeredX });
  };

  const getLayerIcon = (): IconName => {
    if (!selectedLayer) return "Settings";
    switch (selectedLayer.type) {
      case "text":
        return "TextFields";
      case "image":
        return "Image";
      case "shape":
        return "Crop";
      case "sticker":
        return "AutoAwesome";
      case "calendar":
        return "CalendarToday";
      case "timeline":
        return "History";
      case "countdown":
        return "DashboardCustomize";
      case "event-info":
        return "CalendarToday";
      default:
        return "Layers";
    }
  };

  const getLayerTypeName = () => {
    if (!selectedLayer) return "CÀI ĐẶT THIỆP";
    switch (selectedLayer.type) {
      case "text":
        return "VĂN BẢN";
      case "image":
        return "HÌNH ẢNH";
      case "shape":
        return "HÌNH KHỐI";
      case "sticker":
        return "HỌA TIẾT";
      case "calendar":
        return "LỊCH SAVE THE DATE";
      case "timeline":
        return "LỊCH TRÌNH SỰ KIỆN";
      case "countdown":
        return "ĐẾM NGƯỢC NGÀY CƯỚI";
      case "event-info":
        return "KHUNG NGÀY & GIỜ";
      default:
        return "ĐỐI TƯỢNG";
    }
  };

  return (
    <Box
      data-tour="properties-inspector"
      sx={{
        width: 320,
        height: "100%",
        backgroundColor: COLOR.bgPaper,
        borderLeft: `1px solid ${COLOR.borderGoldLight}`,
        boxShadow: SHADOW.sm,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",
        p: SPACING.px16,
        zIndex: 20,
        flexShrink: 0,
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": {
          background: COLOR.borderSubtle,
          borderRadius: RADIUS.full,
        },
      }}
    >
      {selectedLayer ? (
        <StackCol spacing={SPACING.px16} sx={{ width: "100%" }}>
          {/* 1. Header Bar: Icon, Name & Fast Action Tools */}
          <StackRowAlignJustBetween
            sx={{
              width: "100%",
              pb: SPACING.px12,
              borderBottom: `1px solid ${COLOR.divider}`,
              alignItems: "center",
            }}
          >
            <StackRowAlignJustStart sx={{ gap: SPACING.px8, alignItems: "center", minWidth: 0, flex: 1 }}>
              <StackCenter
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: RADIUS.sm,
                  backgroundColor: COLOR.gold[50],
                  border: `1px solid ${COLOR.borderGoldLight}`,
                  color: COLOR.gold.main,
                  flexShrink: 0,
                }}
              >
                <IconElement name={getLayerIcon()} size="xs" />
              </StackCenter>
              <StackCol spacing={0} sx={{ minWidth: 0, flex: 1 }}>
                <TextElement
                  size="xs"
                  weight="bold"
                  colorVariant="primary"
                  sx={{
                    letterSpacing: "0.06em",
                    fontSize: "0.68rem",
                    lineHeight: 1.2,
                  }}
                >
                  {getLayerTypeName()}
                </TextElement>
                <TextElement
                  size="xs"
                  colorVariant="gold"
                  weight="semibold"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 120,
                  }}
                >
                  {selectedLayer.name || "Đối tượng"}
                </TextElement>
              </StackCol>
            </StackRowAlignJustStart>

            {/* Quick Actions */}
            <StackRow sx={{ gap: SPACING.px4, flexShrink: 0 }}>
              {onDuplicateLayer && (
                <Tooltip title="Nhân bản (Ctrl+D)" arrow>
                  <IconButton
                    size="small"
                    onClick={() => onDuplicateLayer(selectedLayer.id)}
                    sx={{
                      borderRadius: RADIUS.xs,
                      p: 0.5,
                      color: COLOR.textSecondary,
                      "&:hover": { color: COLOR.gold.main, backgroundColor: COLOR.gold[50] },
                    }}
                  >
                    <IconElement name="ContentCopy" size="xs" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={selectedLayer.isHidden ? "Bật hiển thị" : "Ẩn đối tượng"} arrow>
                <IconButton
                  size="small"
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, { isHidden: !selectedLayer.isHidden })
                  }
                  sx={{
                    borderRadius: RADIUS.xs,
                    p: 0.5,
                    color: selectedLayer.isHidden ? COLOR.gold.main : COLOR.textSecondary,
                    backgroundColor: selectedLayer.isHidden ? COLOR.gold[50] : "transparent",
                    "&:hover": { color: COLOR.gold.main, backgroundColor: COLOR.gold[50] },
                  }}
                >
                  <IconElement name={selectedLayer.isHidden ? "VisibilityOff" : "Visibility"} size="xs" />
                </IconButton>
              </Tooltip>

              <Tooltip title={selectedLayer.isLocked ? "Mở khóa" : "Khóa vị trí"} arrow>
                <IconButton
                  size="small"
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, { isLocked: !selectedLayer.isLocked })
                  }
                  sx={{
                    borderRadius: RADIUS.xs,
                    p: 0.5,
                    color: selectedLayer.isLocked ? COLOR.gold.main : COLOR.textSecondary,
                    backgroundColor: selectedLayer.isLocked ? COLOR.gold[50] : "transparent",
                    "&:hover": { color: COLOR.gold.main, backgroundColor: COLOR.gold[50] },
                  }}
                >
                  <IconElement name={selectedLayer.isLocked ? "Lock" : "LockOpen"} size="xs" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Xóa đối tượng" arrow>
                <IconButton
                  size="small"
                  onClick={() => onDeleteLayer(selectedLayer.id)}
                  sx={{
                    borderRadius: RADIUS.xs,
                    p: 0.5,
                    color: COLOR.status.error.main,
                    "&:hover": {
                      color: COLOR.status.error.dark,
                      backgroundColor: COLOR.status.error.light,
                    },
                  }}
                >
                  <IconElement name="DeleteOutlined" size="xs" />
                </IconButton>
              </Tooltip>
            </StackRow>
          </StackRowAlignJustBetween>

          {selectedLayer.isLocked && (
            <StackRowAlignJustBetween
              sx={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: COLOR.bgSecondary,
                border: `1px solid ${COLOR.borderGoldLight}`,
                borderRadius: RADIUS.sm,
                p: SPACING.px8,
                alignItems: "center",
              }}
            >
              <StackRow sx={{ gap: SPACING.px6, alignItems: "center", minWidth: 0, flex: 1 }}>
                <IconElement name="Lock" size="xs" color={COLOR.gold.main} />
                <TextElement size="xs" colorVariant="primary" sx={{ fontSize: "0.7rem", fontWeight: FONT_WEIGHT.medium }}>
                  Đối tượng đang bị khóa vị trí
                </TextElement>
              </StackRow>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="xs"
                onClick={() => onUpdateLayer(selectedLayer.id, { isLocked: false })}
                sx={{
                  fontSize: "0.68rem",
                  py: 0.2,
                  px: SPACING.px8,
                  borderColor: COLOR.gold.main,
                  color: COLOR.gold.main,
                  fontWeight: FONT_WEIGHT.bold,
                  "&:hover": { backgroundColor: COLOR.bgPaper },
                }}
              >
                Mở Khóa
              </ButtonElement>
            </StackRowAlignJustBetween>
          )}

          {selectedLayer.isHidden && (
            <StackRowAlignJustBetween
              sx={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: COLOR.bgSecondary,
                border: `1px dashed ${COLOR.borderGoldLight}`,
                borderRadius: RADIUS.sm,
                p: SPACING.px8,
                alignItems: "center",
              }}
            >
              <StackRow sx={{ gap: SPACING.px6, alignItems: "center", minWidth: 0, flex: 1 }}>
                <IconElement name="VisibilityOff" size="xs" color={COLOR.textSecondary} />
                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.7rem", fontWeight: FONT_WEIGHT.medium }}>
                  Layer này đang ở chế độ Ẩn
                </TextElement>
              </StackRow>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="xs"
                onClick={() => onUpdateLayer(selectedLayer.id, { isHidden: false })}
                sx={{
                  fontSize: "0.68rem",
                  py: 0.2,
                  px: SPACING.px8,
                  borderColor: COLOR.borderGoldLight,
                  color: COLOR.textPrimary,
                  "&:hover": { borderColor: COLOR.gold.main },
                }}
              >
                Hiện lại
              </ButtonElement>
            </StackRowAlignJustBetween>
          )}

          {/* 2. Section: Typography (Text Layer) */}
          {isText && txtLayer && (
            <StackCol spacing={SPACING.px12} sx={{ width: "100%" }}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
              >
                Văn Bản & Kiểu Chữ
              </TextElement>

              {/* Quick Text Edit Input */}
              <Box
                sx={{
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: COLOR.bgSecondary,
                  borderRadius: RADIUS.sm,
                  border: `1px solid ${COLOR.borderGoldLight}`,
                  p: SPACING.px8,
                  transition: ANIMATION.sm,
                  "&:focus-within": {
                    borderColor: COLOR.gold.main,
                    boxShadow: `0 0 0 2px ${COLOR.gold[100]}`,
                  },
                }}
              >
                <input
                  type="text"
                  value={txtLayer.text || ""}
                  onChange={(e) =>
                    onUpdateLayer(txtLayer.id, {
                      text: e.target.value,
                      name: e.target.value.slice(0, 18) || "Văn bản",
                    })
                  }
                  placeholder="Nhập nội dung văn bản..."
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: FONT_SIZE.xs,
                    color: COLOR.textPrimary,
                    fontWeight: FONT_WEIGHT.medium,
                  }}
                />
              </Box>

              {/* Font Family Dropdown */}
              <Select
                fullWidth
                size="small"
                value={txtLayer.fontFamily || "'Playfair Display', serif"}
                onChange={(e) => onUpdateLayer(txtLayer.id, { fontFamily: e.target.value })}
                sx={{
                  backgroundColor: COLOR.bgSecondary,
                  fontSize: FONT_SIZE.xs,
                  borderRadius: RADIUS.sm,
                  height: 36,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLOR.borderGoldLight,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLOR.gold.main,
                  },
                }}
              >
                {FONT_OPTIONS.map((f) => (
                  <MenuItem key={f.value} value={f.value}>
                    <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center" }}>
                      <TextElement size="sm" sx={{ fontFamily: f.value }}>
                        {f.label}
                      </TextElement>
                      <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.65rem", ml: 1 }}>
                        {f.category}
                      </TextElement>
                    </StackRowAlignJustBetween>
                  </MenuItem>
                ))}
              </Select>

              {/* Font Size Stepper & Bold / Italic */}
              <StackRow sx={{ width: "100%", gap: SPACING.px8, alignItems: "center" }}>
                <StackRow
                  sx={{
                    flex: 1,
                    backgroundColor: COLOR.bgSecondary,
                    borderRadius: RADIUS.sm,
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    alignItems: "center",
                    px: SPACING.px4,
                    height: 36,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() =>
                      onUpdateLayer(txtLayer.id, {
                        fontSize: Math.max(10, (txtLayer.fontSize || 22) - 1),
                      })
                    }
                    sx={{ p: 0.4, color: COLOR.textSecondary }}
                  >
                    <IconElement name="Remove" size="xs" />
                  </IconButton>

                  <TextElement
                    size="xs"
                    weight="bold"
                    colorVariant="primary"
                    sx={{ flex: 1, textAlign: "center", userSelect: "none" }}
                  >
                    {txtLayer.fontSize || 22}px
                  </TextElement>

                  <IconButton
                    size="small"
                    onClick={() =>
                      onUpdateLayer(txtLayer.id, {
                        fontSize: Math.min(96, (txtLayer.fontSize || 22) + 1),
                      })
                    }
                    sx={{ p: 0.4, color: COLOR.textSecondary }}
                  >
                    <IconElement name="Add" size="xs" />
                  </IconButton>
                </StackRow>

                <ToggleButtonGroup
                  size="small"
                  sx={{
                    backgroundColor: COLOR.bgSecondary,
                    height: 36,
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    borderRadius: RADIUS.sm,
                  }}
                >
                  <ToggleButton
                    value="bold"
                    selected={txtLayer.fontWeight === "bold" || txtLayer.fontWeight === "700"}
                    onClick={() =>
                      onUpdateLayer(txtLayer.id, {
                        fontWeight:
                          txtLayer.fontWeight === "bold" || txtLayer.fontWeight === "700"
                            ? "normal"
                            : "bold",
                      })
                    }
                    sx={{ px: SPACING.px8, border: "none" }}
                  >
                    <Tooltip title="In đậm" arrow>
                      <Box component="span">
                        <IconElement name="FormatBold" size="xs" />
                      </Box>
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
                    sx={{ px: SPACING.px8, border: "none" }}
                  >
                    <Tooltip title="In nghiêng" arrow>
                      <Box component="span">
                        <IconElement name="FormatItalic" size="xs" />
                      </Box>
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </StackRow>

              {/* Text Alignment */}
              <ToggleButtonGroup
                fullWidth
                size="small"
                value={txtLayer.textAlign || "center"}
                exclusive
                onChange={(_, val) => val && onUpdateLayer(txtLayer.id, { textAlign: val })}
                sx={{
                  width: "100%",
                  backgroundColor: COLOR.bgSecondary,
                  height: 34,
                  border: `1px solid ${COLOR.borderGoldLight}`,
                  borderRadius: RADIUS.sm,
                }}
              >
                <ToggleButton value="left" sx={{ flex: 1, border: "none" }}>
                  <Tooltip title="Căn trái" arrow>
                    <Box component="span">
                      <IconElement name="FormatAlignLeft" size="xs" />
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="center" sx={{ flex: 1, border: "none" }}>
                  <Tooltip title="Căn giữa" arrow>
                    <Box component="span">
                      <IconElement name="FormatAlignCenter" size="xs" />
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="right" sx={{ flex: 1, border: "none" }}>
                  <Tooltip title="Căn phải" arrow>
                    <Box component="span">
                      <IconElement name="FormatAlignRight" size="xs" />
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="justify" sx={{ flex: 1, border: "none" }}>
                  <Tooltip title="Căn đều" arrow>
                    <Box component="span">
                      <IconElement name="FormatAlignJustify" size="xs" />
                    </Box>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Tracking & Line Height Card */}
              <Box sx={SECTION_CARD_SX}>
                <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center" }}>
                  <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                    Dãn chữ (Tracking)
                  </TextElement>
                  <TextElement size="xs" weight="bold" colorVariant="gold">
                    {txtLayer.letterSpacing !== undefined ? `${txtLayer.letterSpacing}px` : "0px"}
                  </TextElement>
                </StackRowAlignJustBetween>
                <Slider
                  size="small"
                  min={-1}
                  max={10}
                  step={0.5}
                  value={txtLayer.letterSpacing || 0}
                  onChange={(_, val) => onUpdateLayer(txtLayer.id, { letterSpacing: val as number })}
                  sx={{
                    color: COLOR.gold.main,
                    py: 0.5,
                    "& .MuiSlider-thumb": { width: 14, height: 14 },
                  }}
                />

                <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center", mt: SPACING.px4 }}>
                  <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                    Dãn dòng (Line Height)
                  </TextElement>
                  <TextElement size="xs" weight="bold" colorVariant="gold">
                    {txtLayer.lineHeight || 1.4}
                  </TextElement>
                </StackRowAlignJustBetween>
                <Slider
                  size="small"
                  min={1}
                  max={2.4}
                  step={0.1}
                  value={txtLayer.lineHeight || 1.4}
                  onChange={(_, val) => onUpdateLayer(txtLayer.id, { lineHeight: val as number })}
                  sx={{
                    color: COLOR.gold.main,
                    py: 0.5,
                    "& .MuiSlider-thumb": { width: 14, height: 14 },
                  }}
                />
              </Box>
            </StackCol>
          )}

          {/* 3. Section: Image Specifics */}
          {isImage && imgLayer && (
            <StackCol spacing={SPACING.px12} sx={{ width: "100%" }}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
              >
                Thuộc Tính Hình Ảnh
              </TextElement>

              <Box sx={SECTION_CARD_SX}>
                <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center" }}>
                  <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                    Bo góc (Border Radius)
                  </TextElement>
                  <TextElement size="xs" weight="bold" colorVariant="gold">
                    {typeof imgLayer.borderRadius === "number" ? imgLayer.borderRadius : parseFloat(String(imgLayer.borderRadius)) || 0}px
                  </TextElement>
                </StackRowAlignJustBetween>
                <Slider
                  size="small"
                  min={0}
                  max={140}
                  value={typeof imgLayer.borderRadius === "number" ? imgLayer.borderRadius : parseFloat(String(imgLayer.borderRadius)) || 0}
                  onChange={(_, val) => onUpdateLayer(imgLayer.id, { borderRadius: val as number })}
                  sx={{ color: COLOR.gold.main, py: 0.5 }}
                />
              </Box>
            </StackCol>
          )}

          {/* 4. Section: Shape Specifics */}
          {isShape && shapeLayer && (
            <StackCol spacing={SPACING.px12} sx={{ width: "100%" }}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
              >
                Hình Khối & Đường Nét
              </TextElement>

              <Box sx={SECTION_CARD_SX}>
                <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center" }}>
                  <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                    Độ dày nét viền (Stroke)
                  </TextElement>
                  <TextElement size="xs" weight="bold" colorVariant="gold">
                    {shapeLayer.strokeWidth || 1}px
                  </TextElement>
                </StackRowAlignJustBetween>
                <Slider
                  size="small"
                  min={0}
                  max={12}
                  step={0.5}
                  value={shapeLayer.strokeWidth || 1}
                  onChange={(_, val) => onUpdateLayer(shapeLayer.id, { strokeWidth: val as number })}
                  sx={{ color: COLOR.gold.main, py: 0.5 }}
                />
              </Box>
            </StackCol>
          )}

          {/* 5. Section: Color & Palette */}
          {(isText || isShape) && (
            <StackCol spacing={SPACING.px8} sx={{ width: "100%" }}>
              <Divider sx={{ my: SPACING.px2, borderColor: COLOR.divider }} />
              <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center" }}>
                <TextElement
                  size="xs"
                  weight="bold"
                  colorVariant="secondary"
                  sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
                >
                  {isText ? "Màu Chữ Hoàng Gia" : "Màu Nền Khối (Fill)"}
                </TextElement>
                {isShape && (
                  <ButtonElement
                    variant="text"
                    size="small"
                    onClick={() => onUpdateLayer(selectedLayer.id, { fill: "transparent" })}
                    sx={{ fontSize: "0.68rem", py: 0, px: 0.5, color: COLOR.textSecondary }}
                  >
                    Trong suốt
                  </ButtonElement>
                )}
              </StackRowAlignJustBetween>

              {/* Luxury Palette Swatches: 2 rows of 5 circular chips */}
              <Box
                sx={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: SPACING.px8,
                  justifyItems: "center",
                  alignItems: "center",
                  py: SPACING.px4,
                }}
              >
                {LUXURY_PALETTE.map((item) => {
                  const isSelected = currentFill.toLowerCase() === item.hex.toLowerCase();
                  return (
                    <Tooltip title={item.label} arrow key={item.hex}>
                      <Box
                        onClick={() => onUpdateLayer(selectedLayer.id, { fill: item.hex })}
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: RADIUS.full,
                          backgroundColor: item.hex,
                          border: `1px solid ${item.hex === "#FFFFFF" ? COLOR.borderSubtle : "transparent"}`,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: isSelected
                            ? `0 0 0 2px ${COLOR.bgPaper}, 0 0 0 4px ${COLOR.gold.main}`
                            : "0 1px 2px rgba(0,0,0,0.06)",
                        }}
                      >
                        {isSelected && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: RADIUS.full,
                              backgroundColor:
                                item.hex === "#FFFFFF" ? COLOR.textPrimary : COLOR.textInverse,
                            }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>

              {/* Custom Color Input */}
              <StackRowAlignJustBetween
                sx={{
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: COLOR.bgSecondary,
                  borderRadius: RADIUS.sm,
                  border: `1px solid ${COLOR.borderGoldLight}`,
                  px: SPACING.px8,
                  py: SPACING.px4,
                  alignItems: "center",
                }}
              >
                <StackRow sx={{ gap: SPACING.px8, alignItems: "center", flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: RADIUS.full,
                      backgroundColor: currentFill,
                      border: `1px solid ${COLOR.borderSubtle}`,
                      flexShrink: 0,
                    }}
                  />
                  <input
                    type="text"
                    value={currentFill}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { fill: e.target.value })}
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
                </StackRow>

                <label
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    flexShrink: 0,
                  }}
                >
                  <IconElement name="ColorLens" size="xs" color={COLOR.gold.main} />
                  <input
                    type="color"
                    value={currentFill.startsWith("#") ? currentFill : "#B78628"}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { fill: e.target.value })}
                    style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                  />
                </label>
              </StackRowAlignJustBetween>
            </StackCol>
          )}

          {/* 5b. Section: Calendar Specifics */}
          {isCalendar && calLayer && (
            <StackCol spacing={SPACING.px12} sx={{ width: "100%" }}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
              >
                Cài Đặt Lịch Save The Date
              </TextElement>

              <Box sx={SECTION_CARD_SX}>
                {/* Month and Year Selectors */}
                <StackRowAlignJustBetween sx={{ gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.7rem", mb: 0.5 }}>
                      Chọn Tháng
                    </TextElement>
                    <Select
                      size="small"
                      fullWidth
                      value={calLayer.month || 11}
                      onChange={(e) => {
                        const m = Number(e.target.value);
                        const y = calLayer.year || 2026;
                        const startDayOfWeek = (new Date(y, m - 1, 1).getDay() + 6) % 7;
                        const daysCount = new Date(y, m, 0).getDate();
                        onUpdateLayer(calLayer.id, {
                          month: m,
                          monthTitle: `Tháng ${m} / ${y}`,
                          startDayOfWeek,
                          daysCount,
                          selectedDay: Math.min(calLayer.selectedDay || 20, daysCount),
                        });
                      }}
                      sx={{ height: 32, fontSize: "0.78rem" }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <MenuItem key={m} value={m} sx={{ fontSize: "0.78rem" }}>
                          Tháng {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.7rem", mb: 0.5 }}>
                      Chọn Năm
                    </TextElement>
                    <Select
                      size="small"
                      fullWidth
                      value={calLayer.year || 2026}
                      onChange={(e) => {
                        const y = Number(e.target.value);
                        const m = calLayer.month || 11;
                        const startDayOfWeek = (new Date(y, m - 1, 1).getDay() + 6) % 7;
                        const daysCount = new Date(y, m, 0).getDate();
                        onUpdateLayer(calLayer.id, {
                          year: y,
                          monthTitle: `Tháng ${m} / ${y}`,
                          startDayOfWeek,
                          daysCount,
                          selectedDay: Math.min(calLayer.selectedDay || 20, daysCount),
                        });
                      }}
                      sx={{ height: 32, fontSize: "0.78rem" }}
                    >
                      {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                        <MenuItem key={y} value={y} sx={{ fontSize: "0.78rem" }}>
                          Năm {y}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </StackRowAlignJustBetween>

                {/* Day Selection */}
                <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center", mt: 1 }}>
                  <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                    Ngày hôn lễ (❤️ Trái tim)
                  </TextElement>
                  <TextElement size="xs" weight="bold" colorVariant="gold">
                    Ngày {calLayer.selectedDay || 20}
                  </TextElement>
                </StackRowAlignJustBetween>
                <Slider
                  size="small"
                  min={1}
                  max={calLayer.daysCount || 31}
                  value={calLayer.selectedDay || 20}
                  onChange={(_, val) => onUpdateLayer(calLayer.id, { selectedDay: val as number })}
                  sx={{ color: COLOR.gold.main, py: 0.5 }}
                />
              </Box>
            </StackCol>
          )}

          {/* 5c. Section: Countdown Specifics */}
          {isCountdown && cdLayer && (
            <StackCol spacing={SPACING.px12} sx={{ width: "100%" }}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
              >
                Cài Đặt Đếm Ngược
              </TextElement>

              <Box sx={SECTION_CARD_SX}>
                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                  Tiêu đề đếm ngược
                </TextElement>
                <input
                  type="text"
                  value={cdLayer.title || "Đếm ngược đến giờ sự kiện"}
                  onChange={(e) => onUpdateLayer(cdLayer.id, { title: e.target.value })}
                  style={{
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                />

                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem", mt: 1 }}>
                  Chọn Ngày & Giờ cử hành sự kiện
                </TextElement>
                <input
                  type="datetime-local"
                  value={cdLayer.targetDate || "2026-11-20T18:00"}
                  onChange={(e) => {
                    const targetStr = e.target.value;
                    const targetTime = new Date(targetStr).getTime();
                    const now = Date.now();
                    const diff = Math.max(0, targetTime - now);
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                    onUpdateLayer(cdLayer.id, {
                      targetDate: targetStr,
                      days,
                      hours,
                      minutes,
                    });
                  }}
                  style={{
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: "0.8rem",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />

                <StackRowAlignJustBetween sx={{ gap: 1, mt: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <TextElement size="xs" sx={{ fontSize: "0.68rem" }}>Ngày</TextElement>
                    <input
                      type="number"
                      value={cdLayer.days !== undefined ? cdLayer.days : 13}
                      onChange={(e) => onUpdateLayer(cdLayer.id, { days: parseInt(e.target.value) || 0 })}
                      style={{ width: "100%", padding: "4px", fontSize: "0.8rem", borderRadius: 4, border: `1px solid ${COLOR.borderGoldLight}` }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextElement size="xs" sx={{ fontSize: "0.68rem" }}>Giờ</TextElement>
                    <input
                      type="number"
                      value={cdLayer.hours !== undefined ? cdLayer.hours : 15}
                      onChange={(e) => onUpdateLayer(cdLayer.id, { hours: parseInt(e.target.value) || 0 })}
                      style={{ width: "100%", padding: "4px", fontSize: "0.8rem", borderRadius: 4, border: `1px solid ${COLOR.borderGoldLight}` }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextElement size="xs" sx={{ fontSize: "0.68rem" }}>Phút</TextElement>
                    <input
                      type="number"
                      value={cdLayer.minutes !== undefined ? cdLayer.minutes : 48}
                      onChange={(e) => onUpdateLayer(cdLayer.id, { minutes: parseInt(e.target.value) || 0 })}
                      style={{ width: "100%", padding: "4px", fontSize: "0.8rem", borderRadius: 4, border: `1px solid ${COLOR.borderGoldLight}` }}
                    />
                  </Box>
                </StackRowAlignJustBetween>
              </Box>
            </StackCol>
          )}

          {/* 5d. Section: Event Info Specifics */}
          {isEventInfo && eiLayer && (
            <StackCol spacing={SPACING.px12} sx={{ width: "100%" }}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
              >
                Cài Đặt Khung Ngày & Giờ
              </TextElement>

              <Box sx={SECTION_CARD_SX}>
                {/* Chọn Ngày Cưới */}
                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                  📅 Chọn Ngày Cưới
                </TextElement>
                <input
                  type="date"
                  onChange={(e) => {
                    const dateVal = e.target.value;
                    if (dateVal) {
                      const d = new Date(dateVal + "T00:00:00");
                      const daysMap = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
                      const dayOfWeek = daysMap[d.getDay()];
                      const dd = String(d.getDate()).padStart(2, "0");
                      const mm = String(d.getMonth() + 1).padStart(2, "0");
                      const yyyy = d.getFullYear();
                      const formatted = `${dayOfWeek}\n${dd}.${mm}.${yyyy}`;
                      onUpdateLayer(eiLayer.id, { dateValue: formatted });
                    }
                  }}
                  style={{
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: "0.8rem",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />

                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem", mt: 1 }}>
                  Hiển thị Cột Ngày (Chỉnh tay nếu muốn)
                </TextElement>
                <textarea
                  rows={2}
                  value={eiLayer.dateValue || "Chủ Nhật\n20.11.2026"}
                  onChange={(e) => onUpdateLayer(eiLayer.id, { dateValue: e.target.value })}
                  style={{
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: "0.8rem",
                    outline: "none",
                    resize: "none",
                  }}
                />

                <Divider sx={{ my: 1, borderColor: COLOR.divider }} />

                {/* Chọn Giờ Đón Khách */}
                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                  🕒 Chọn Giờ Cử Hành
                </TextElement>
                <StackRowAlignJustBetween sx={{ gap: 1 }}>
                  <Select
                    size="small"
                    defaultValue="Đón khách"
                    onChange={(e) => {
                      const prefix = e.target.value;
                      const timeOnly = eiLayer.timeValue.split("\n")[1] || "18:00";
                      onUpdateLayer(eiLayer.id, { timeValue: `${prefix}\n${timeOnly}` });
                    }}
                    sx={{ flex: 1, height: 32, fontSize: "0.75rem" }}
                  >
                    <MenuItem value="Đón khách" sx={{ fontSize: "0.75rem" }}>Đón khách</MenuItem>
                    <MenuItem value="Lễ thành hôn" sx={{ fontSize: "0.75rem" }}>Lễ thành hôn</MenuItem>
                    <MenuItem value="Khai tiệc" sx={{ fontSize: "0.75rem" }}>Khai tiệc</MenuItem>
                    <MenuItem value="Giờ đẹp" sx={{ fontSize: "0.75rem" }}>Giờ đẹp</MenuItem>
                  </Select>

                  <input
                    type="time"
                    defaultValue="18:00"
                    onChange={(e) => {
                      const t = e.target.value;
                      const prefix = eiLayer.timeValue.split("\n")[0] || "Đón khách";
                      onUpdateLayer(eiLayer.id, { timeValue: `${prefix}\n${t}` });
                    }}
                    style={{
                      border: `1px solid ${COLOR.borderGoldLight}`,
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: "0.8rem",
                      outline: "none",
                      width: "100px",
                    }}
                  />
                </StackRowAlignJustBetween>

                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem", mt: 1 }}>
                  Hiển thị Cột Giờ (Chỉnh tay nếu muốn)
                </TextElement>
                <textarea
                  rows={2}
                  value={eiLayer.timeValue || "Đón khách\n18:00"}
                  onChange={(e) => onUpdateLayer(eiLayer.id, { timeValue: e.target.value })}
                  style={{
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: "0.8rem",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </Box>
            </StackCol>
          )}

          {/* 5e. Section: Timeline Specifics */}
          {isTimeline && tmLayer && (
            <StackCol spacing={SPACING.px12} sx={{ width: "100%" }}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
              >
                Cài Đặt Lịch Trình Sự Kiện
              </TextElement>

              <Box sx={SECTION_CARD_SX}>
                <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                  Tiêu đề lịch trình
                </TextElement>
                <input
                  type="text"
                  value={tmLayer.title || "LỊCH TRÌNH SỰ KIỆN"}
                  onChange={(e) => onUpdateLayer(tmLayer.id, { title: e.target.value })}
                  style={{
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: "0.8rem",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />

                <Divider sx={{ my: 1, borderColor: COLOR.divider }} />

                <TextElement size="xs" weight="bold" sx={{ fontSize: "0.72rem", color: "#851C24", mb: 0.5 }}>
                  Danh Sách Mốc Sự Kiện ({tmLayer.items?.length || 0} mốc)
                </TextElement>

                <StackCol spacing={SPACING.px8}>
                  {tmLayer.items?.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: "8px 10px",
                        borderRadius: RADIUS.sm,
                        border: `1px solid ${COLOR.borderGoldLight}`,
                        backgroundColor: COLOR.bgPaper,
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <StackRowAlignJustBetween sx={{ alignItems: "center" }}>
                        <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ fontSize: "0.7rem" }}>
                          Mốc {idx + 1}
                        </TextElement>
                        {tmLayer.items.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={() => {
                              const newItems = tmLayer.items.filter((_, i) => i !== idx);
                              onUpdateLayer(tmLayer.id, { items: newItems, height: Math.max(160, newItems.length * 48 + 50) });
                            }}
                            sx={{ p: 0.25, color: COLOR.status.error.main }}
                          >
                            <IconElement name="Delete" size="xs" />
                          </IconButton>
                        )}
                      </StackRowAlignJustBetween>

                      {/* Time selector/input */}
                      <StackRowAlignJustBetween sx={{ gap: 1, alignItems: "center" }}>
                        <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.68rem", width: 50 }}>
                          Thời gian
                        </TextElement>
                        <input
                          type="time"
                          value={item.time || "18:00"}
                          onChange={(e) => {
                            const newItems = [...tmLayer.items];
                            newItems[idx] = { ...newItems[idx], time: e.target.value };
                            onUpdateLayer(tmLayer.id, { items: newItems });
                          }}
                          style={{
                            border: `1px solid ${COLOR.borderGoldLight}`,
                            borderRadius: 4,
                            padding: "3px 6px",
                            fontSize: "0.78rem",
                            outline: "none",
                            flex: 1,
                          }}
                        />
                      </StackRowAlignJustBetween>

                      {/* Title input */}
                      <StackRowAlignJustBetween sx={{ gap: 1, alignItems: "center" }}>
                        <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.68rem", width: 50 }}>
                          Sự kiện
                        </TextElement>
                        <input
                          type="text"
                          value={item.title || ""}
                          placeholder="Tên mốc sự kiện"
                          onChange={(e) => {
                            const newItems = [...tmLayer.items];
                            newItems[idx] = { ...newItems[idx], title: e.target.value };
                            onUpdateLayer(tmLayer.id, { items: newItems });
                          }}
                          style={{
                            border: `1px solid ${COLOR.borderGoldLight}`,
                            borderRadius: 4,
                            padding: "3px 6px",
                            fontSize: "0.78rem",
                            outline: "none",
                            flex: 1,
                          }}
                        />
                      </StackRowAlignJustBetween>

                      {/* SubTitle input */}
                      <StackRowAlignJustBetween sx={{ gap: 1, alignItems: "center" }}>
                        <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.68rem", width: 50 }}>
                          Ghi chú
                        </TextElement>
                        <input
                          type="text"
                          value={item.subTitle || ""}
                          placeholder="Mô tả phụ (không bắt buộc)"
                          onChange={(e) => {
                            const newItems = [...tmLayer.items];
                            newItems[idx] = { ...newItems[idx], subTitle: e.target.value };
                            onUpdateLayer(tmLayer.id, { items: newItems });
                          }}
                          style={{
                            border: `1px solid ${COLOR.borderGoldLight}`,
                            borderRadius: 4,
                            padding: "3px 6px",
                            fontSize: "0.75rem",
                            outline: "none",
                            flex: 1,
                          }}
                        />
                      </StackRowAlignJustBetween>
                    </Box>
                  ))}
                </StackCol>

                {/* Add new milestone button */}
                <ButtonElement
                  variant="outline"
                  size="small"
                  fullWidth
                  rounded="sm"
                  onClick={() => {
                    const currentItems = tmLayer.items || [];
                    const newItems = [
                      ...currentItems,
                      { time: "20:00", title: "Sự kiện mới", subTitle: "Mô tả chi tiết" },
                    ];
                    onUpdateLayer(tmLayer.id, {
                      items: newItems,
                      height: Math.max(160, newItems.length * 48 + 50),
                    });
                  }}
                  leftIcon={<IconElement name="Add" size="xs" />}
                  sx={{
                    mt: 1,
                    height: 32,
                    fontSize: "0.75rem",
                    borderColor: COLOR.borderGoldLight,
                    "&:hover": { borderColor: COLOR.gold.main },
                  }}
                >
                  Thêm Mốc Sự Kiện Mới
                </ButtonElement>
              </Box>
            </StackCol>
          )}

          {/* 6. Section: Opacity Slider */}
          <Box sx={SECTION_CARD_SX}>
            <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center" }}>
              <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                Độ mờ đục (Opacity)
              </TextElement>
              <TextElement size="xs" weight="bold" colorVariant="gold">
                {Math.round((selectedLayer.opacity ?? 1) * 100)}%
              </TextElement>
            </StackRowAlignJustBetween>
            <Slider
              size="small"
              min={0.05}
              max={1}
              step={0.05}
              value={selectedLayer.opacity ?? 1}
              onChange={(_, val) => onUpdateLayer(selectedLayer.id, { opacity: val as number })}
              sx={{
                color: COLOR.gold.main,
                py: 0.5,
                "& .MuiSlider-thumb": { width: 14, height: 14 },
              }}
            />
          </Box>

          {/* 7. Section: Entrance Animation */}
          <Divider sx={{ my: SPACING.px2, borderColor: COLOR.divider }} />
          <StackCol spacing={SPACING.px8} sx={{ width: "100%" }}>
            <TextElement
              size="xs"
              weight="bold"
              colorVariant="secondary"
              sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
            >
              Hiệu Ứng Xuất Hiện
            </TextElement>

            <Select
              fullWidth
              size="small"
              value={selectedLayer.animation || "fade-in"}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  animation: e.target.value as CanvasElementAnimationType,
                })
              }
              sx={{
                backgroundColor: COLOR.bgSecondary,
                fontSize: FONT_SIZE.xs,
                borderRadius: RADIUS.sm,
                height: 36,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: COLOR.borderGoldLight,
                },
              }}
            >
              {ANIMATION_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <StackRowAlignJustStart sx={{ gap: SPACING.px6, alignItems: "center" }}>
                    <IconElement name={opt.icon} size="xs" color={COLOR.gold.main} />
                    <TextElement size="xs" sx={{ fontSize: "0.8rem" }}>
                      {opt.label}
                    </TextElement>
                  </StackRowAlignJustStart>
                </MenuItem>
              ))}
            </Select>

            {/* Delay Chips */}
            <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center", mt: SPACING.px2 }}>
              <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.72rem" }}>
                Độ trễ (Delay):
              </TextElement>
              <StackRow sx={{ gap: SPACING.px6 }}>
                {[0, 0.3, 0.6, 1].map((delay) => {
                  const isSelected = (selectedLayer.animationDelay || 0) === delay;
                  return (
                    <Box
                      key={delay}
                      onClick={() => onUpdateLayer(selectedLayer.id, { animationDelay: delay })}
                      sx={{
                        px: SPACING.px8,
                        py: SPACING.px2,
                        borderRadius: RADIUS.xs,
                        fontSize: "0.7rem",
                        fontWeight: FONT_WEIGHT.bold,
                        cursor: "pointer",
                        backgroundColor: isSelected ? COLOR.gold.main : COLOR.bgSecondary,
                        color: isSelected ? COLOR.textInverse : COLOR.textSecondary,
                        border: `1px solid ${isSelected ? COLOR.gold.main : COLOR.borderGoldLight}`,
                        transition: ANIMATION.sm,
                        "&:hover": { borderColor: COLOR.gold.main },
                      }}
                    >
                      {delay}s
                    </Box>
                  );
                })}
              </StackRow>
            </StackRowAlignJustBetween>
          </StackCol>

          {/* 8. Section: Layer Arrangement (Bố trí & Thứ tự tầng) */}
          <Divider sx={{ my: SPACING.px2, borderColor: COLOR.divider }} />
          <StackCol spacing={SPACING.px8} sx={{ width: "100%" }}>
            <TextElement
              size="xs"
              weight="bold"
              colorVariant="secondary"
              sx={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}
            >
              Bố Trí & Thứ Tự Tầng
            </TextElement>

            {/* Row 1: Căn giữa trang */}
            <ButtonElement
              variant="outline"
              size="small"
              rounded="sm"
              onClick={handleCenterAlignHorizontal}
              leftIcon={<IconElement name="AlignHorizontalCenter" size="xs" />}
              sx={{
                width: "100%",
                backgroundColor: COLOR.bgSecondary,
                borderColor: COLOR.borderGoldLight,
                fontSize: "0.75rem",
                py: 0.6,
              }}
            >
              Căn Giữa Trang
            </ButtonElement>

            {/* Row 2: Lên trên / Xuống dưới 2 cột cân đối */}
            <StackRow sx={{ width: "100%", gap: SPACING.px8 }}>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="sm"
                onClick={() => onBringForward(selectedLayer.id)}
                leftIcon={<IconElement name="ArrowUpward" size="xs" />}
                sx={{
                  flex: 1,
                  backgroundColor: COLOR.bgSecondary,
                  borderColor: COLOR.borderGoldLight,
                  fontSize: "0.75rem",
                  py: 0.6,
                }}
              >
                Lên Trên
              </ButtonElement>

              <ButtonElement
                variant="outline"
                size="small"
                rounded="sm"
                onClick={() => onSendBackward(selectedLayer.id)}
                leftIcon={<IconElement name="ArrowDownward" size="xs" />}
                sx={{
                  flex: 1,
                  backgroundColor: COLOR.bgSecondary,
                  borderColor: COLOR.borderGoldLight,
                  fontSize: "0.75rem",
                  py: 0.6,
                }}
              >
                Xuống Dưới
              </ButtonElement>
            </StackRow>
          </StackCol>

          {/* Deselect Button */}
          <ButtonElement
            variant="text"
            size="small"
            onClick={onDeselect}
            leftIcon={<IconElement name="Close" size="xs" />}
            sx={{
              width: "100%",
              color: COLOR.textSecondary,
              fontSize: "0.75rem",
              mt: SPACING.px4,
              "&:hover": { color: COLOR.textPrimary },
            }}
          >
            Bỏ chọn layer
          </ButtonElement>
        </StackCol>
      ) : (
        /* Unselected State: Document Settings (Cài đặt trang thiệp) */
        <StackCol spacing={SPACING.px16} sx={{ width: "100%" }}>
          {/* Header */}
          <StackRowAlignJustStart
            sx={{
              width: "100%",
              pb: SPACING.px12,
              borderBottom: `1px solid ${COLOR.divider}`,
              gap: SPACING.px8,
              alignItems: "center",
            }}
          >
            <StackCenter
              sx={{
                width: 32,
                height: 32,
                borderRadius: RADIUS.sm,
                backgroundColor: COLOR.gold[50],
                border: `1px solid ${COLOR.borderGoldLight}`,
                color: COLOR.gold.main,
              }}
            >
              <IconElement name="Settings" size="xs" />
            </StackCenter>
            <StackCol spacing={0}>
              <HeadingElement variant="h6" weight="bold" sx={{ fontSize: FONT_SIZE.sm }}>
                CÀI ĐẶT THIỆP
              </HeadingElement>
              <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.7rem" }}>
                Thiết lập hiệu ứng & nền tổng thể
              </TextElement>
            </StackCol>
          </StackRowAlignJustStart>

          {/* 1. Kích thước & Độ dài thiệp */}
          <Box sx={SECTION_CARD_SX}>
            <StackRowAlignJustBetween sx={{ width: "100%", alignItems: "center" }}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
              >
                Độ dài thiệp
              </TextElement>
              <TextElement size="xs" colorVariant="gold" weight="bold">
                390 × {canvasHeight}px
              </TextElement>
            </StackRowAlignJustBetween>

            <StackRow sx={{ width: "100%", gap: SPACING.px8, mt: SPACING.px4 }}>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="sm"
                onClick={() => onExpandHeight(300)}
                leftIcon={<IconElement name="Add" size="xs" />}
                sx={{
                  flex: 1,
                  backgroundColor: COLOR.bgPaper,
                  borderColor: COLOR.borderGoldLight,
                  fontSize: FONT_SIZE.xs,
                  py: 0.6,
                }}
              >
                Kéo Dài (+300)
              </ButtonElement>
              {canvasHeight > 780 && (
                <ButtonElement
                  variant="outline"
                  size="small"
                  rounded="sm"
                  onClick={() => onExpandHeight(-300)}
                  leftIcon={<IconElement name="Remove" size="xs" />}
                  sx={{
                    flex: 1,
                    backgroundColor: COLOR.bgPaper,
                    borderColor: COLOR.borderGoldLight,
                    fontSize: FONT_SIZE.xs,
                    py: 0.6,
                  }}
                >
                  Thu Gọn
                </ButtonElement>
              )}
            </StackRow>
          </Box>

          {/* 2. Tông màu nền thiệp */}
          <Box sx={SECTION_CARD_SX}>
            <TextElement
              size="xs"
              weight="bold"
              colorVariant="secondary"
              sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
            >
              Tông màu nền thiệp
            </TextElement>

            <Box
              sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: SPACING.px6,
              }}
            >
              {BG_PALETTES.map((bg) => {
                const isSelected = canvasBg === bg.color;
                return (
                  <Box
                    key={bg.color}
                    onClick={() => onSetBackground(bg.color)}
                    sx={{
                      p: "6px 8px",
                      boxSizing: "border-box",
                      minWidth: 0,
                      borderRadius: RADIUS.sm,
                      border: `1.5px solid ${isSelected ? COLOR.gold.main : COLOR.borderGoldLight}`,
                      backgroundColor: bg.color,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: SPACING.px6,
                      transition: ANIMATION.sm,
                      boxShadow: isSelected ? `0 0 0 2px ${COLOR.gold.light}44` : "none",
                      "&:hover": { borderColor: COLOR.gold.main },
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: RADIUS.full,
                        backgroundColor: bg.border,
                        flexShrink: 0,
                        border: `1px solid ${COLOR.borderSubtle}`,
                      }}
                    />
                    <TextElement
                      size="xs"
                      weight="semibold"
                      sx={{
                        fontSize: "0.68rem",
                        color: bg.darkText ? COLOR.textPrimary : COLOR.textInverse,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {bg.name}
                    </TextElement>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* 3. Hiệu ứng mở thiệp (Opening Effect) */}
          {onSetOpeningEffect && (
            <Box sx={SECTION_CARD_SX}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
              >
                Hiệu ứng mở bao thư
              </TextElement>
              <Select
                fullWidth
                size="small"
                value={openingEffect}
                onChange={(e) => onSetOpeningEffect(e.target.value as CanvasOpeningEffectType)}
                sx={{
                  backgroundColor: COLOR.bgPaper,
                  fontSize: FONT_SIZE.xs,
                  borderRadius: RADIUS.sm,
                  height: 36,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLOR.borderGoldLight,
                  },
                }}
              >
                {OPENING_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <StackCol spacing={0}>
                      <TextElement size="xs" weight="semibold" sx={{ fontSize: "0.8rem" }}>
                        {opt.label}
                      </TextElement>
                      <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.68rem" }}>
                        {opt.desc}
                      </TextElement>
                    </StackCol>
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {/* 4. Hiệu ứng hạt rơi (Ambient Particle) */}
          {onSetAmbientParticle && (
            <Box sx={SECTION_CARD_SX}>
              <TextElement
                size="xs"
                weight="bold"
                colorVariant="secondary"
                sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
              >
                Hiệu ứng hạt rơi (Particle)
              </TextElement>
              <Select
                fullWidth
                size="small"
                value={ambientParticle}
                onChange={(e) =>
                  onSetAmbientParticle(e.target.value as CanvasAmbientParticleType)
                }
                sx={{
                  backgroundColor: COLOR.bgPaper,
                  fontSize: FONT_SIZE.xs,
                  borderRadius: RADIUS.sm,
                  height: 36,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLOR.borderGoldLight,
                  },
                }}
              >
                {PARTICLE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <StackCol spacing={0}>
                      <TextElement size="xs" weight="semibold" sx={{ fontSize: "0.8rem" }}>
                        {opt.label}
                      </TextElement>
                      <TextElement size="xs" colorVariant="secondary" sx={{ fontSize: "0.68rem" }}>
                        {opt.desc}
                      </TextElement>
                    </StackCol>
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </StackCol>
      )}
    </Box>
  );
};
