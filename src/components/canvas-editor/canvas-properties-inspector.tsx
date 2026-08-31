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
  TextField,
  InputAdornment,
} from "@mui/material";
import { ICanvasLayer, ICanvasTextLayer, ICanvasImageLayer, ICanvasShapeLayer } from "@/interfaces/canvas-editor.interface";
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

  const PRESET_COLORS = [
    "#B78628", // Gold
    "#C59B4B", // Mustard Gold
    "#221A12", // Dark Espresso
    "#8B1E2B", // Burgundy Crimson
    "#8B2435", // Velvet Wine
    "#DE7C66", // Rose Peach
    "#D97706", // Amber
    "#78350F", // Deep Bronze
    "#6B7280", // Slate Gray
    "#E5E7EB", // Light Gray
    "#FFFFFF", // Pure White
    "transparent", // Transparent
  ];

  const handleHexChange = (hex: string) => {
    setCustomHex(hex);
    if (txtLayer) {
      onUpdateLayer(txtLayer.id, { fill: hex });
    }
  };

  return (
    <Box
      sx={{
        width: { xs: 280, sm: 320 },
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderLeft: "1px solid #ECE7DD",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        p: 2.5,
        zIndex: 20,
      }}
    >
      {selectedLayer ? (
        <StackCol spacing={2.5}>
          {/* Header with Title & Trash Icon at Top Right */}
          <StackRowAlignJustBetween sx={{ alignItems: "center" }}>
            <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1rem", letterSpacing: "0.02em" }}>
              THUỘC TÍNH ĐỐI TƯỢNG
            </HeadingElement>
            <Tooltip title="Xóa đối tượng">
              <IconButton
                size="small"
                onClick={() => onDeleteLayer(selectedLayer.id)}
                sx={{
                  color: "#D32F2F",
                  backgroundColor: "#FEE2E2",
                  borderRadius: RADIUS.md,
                  p: 0.75,
                  "&:hover": { backgroundColor: "#FCA5A5" },
                }}
              >
                <IconElement name="Delete" size="xs" />
              </IconButton>
            </Tooltip>
          </StackRowAlignJustBetween>

          {/* Group 1: [typography] */}
          {isText && txtLayer && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: RADIUS.md,
                border: "1px solid #F0ECE1",
                backgroundColor: "#FAF9F6",
              }}
            >
              <TextElement size="xs" weight="bold" colorVariant="secondary" sx={{ textTransform: "lowercase", mb: 1.5, letterSpacing: "0.05em" }}>
                [typography]
              </TextElement>

              <StackCol spacing={2}>
                {/* Font Selector */}
                <Box>
                  <TextElement size="xs" weight="semibold" sx={{ mb: 0.5 }}>
                    Font
                  </TextElement>
                  <Select
                    fullWidth
                    size="small"
                    value={txtLayer.fontFamily || "'Playfair Display', serif"}
                    onChange={(e) => onUpdateLayer(txtLayer.id, { fontFamily: e.target.value })}
                    sx={{ backgroundColor: "#FFFFFF", fontSize: "0.82rem", borderRadius: RADIUS.sm }}
                  >
                    <MenuItem value="Inter, sans-serif">Inter (Hiện Đại Sang Trọng)</MenuItem>
                    <MenuItem value="'Playfair Display', serif">Playfair Display (Serif Quý Tộc)</MenuItem>
                    <MenuItem value="'Great Vibes', cursive">Great Vibes (Nghệ Thuật Uốn Lượn)</MenuItem>
                    <MenuItem value="'Cinzel', serif">Cinzel (Hoàng Gia Châu Âu)</MenuItem>
                  </Select>
                </Box>

                {/* Size & Inline Styles */}
                <Box>
                  <StackRowAlignJustBetween sx={{ mb: 0.5 }}>
                    <TextElement size="xs" weight="semibold">
                      Size
                    </TextElement>
                    <TextElement size="xs" weight="semibold">
                      Kiểu:
                    </TextElement>
                  </StackRowAlignJustBetween>
                  <StackRowAlignJustBetween>
                    <Select
                      size="small"
                      value={txtLayer.fontSize || 22}
                      onChange={(e) => onUpdateLayer(txtLayer.id, { fontSize: Number(e.target.value) })}
                      sx={{ width: 110, backgroundColor: "#FFFFFF", fontSize: "0.82rem", borderRadius: RADIUS.sm }}
                    >
                      {[11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 30, 32, 36, 42, 48].map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}px
                        </MenuItem>
                      ))}
                    </Select>

                    <ToggleButtonGroup size="small" sx={{ backgroundColor: "#FFFFFF" }}>
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
                      <ToggleButton
                        value="underline"
                        selected={txtLayer.fontStyle === "italic"}
                        onClick={() =>
                          onUpdateLayer(txtLayer.id, {
                            fontStyle: txtLayer.fontStyle === "italic" ? "normal" : "italic",
                          })
                        }
                      >
                        <IconElement name="FormatUnderlined" size="xs" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </StackRowAlignJustBetween>
                </Box>

                {/* Alignment */}
                <Box>
                  <TextElement size="xs" weight="semibold" sx={{ mb: 0.5 }}>
                    Alignment
                  </TextElement>
                  <ToggleButtonGroup
                    fullWidth
                    size="small"
                    value={txtLayer.textAlign || "center"}
                    exclusive
                    onChange={(_, val) => val && onUpdateLayer(txtLayer.id, { textAlign: val })}
                    sx={{ backgroundColor: "#FFFFFF" }}
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
                    <ToggleButton value="justify">
                      <IconElement name="FormatAlignJustify" size="xs" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </StackCol>
            </Paper>
          )}

          {/* Group 2: [colors & effects] */}
          {isText && txtLayer && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: RADIUS.md,
                border: "1px solid #F0ECE1",
                backgroundColor: "#FAF9F6",
              }}
            >
              <TextElement size="xs" weight="bold" colorVariant="secondary" sx={{ textTransform: "lowercase", mb: 1.5, letterSpacing: "0.05em" }}>
                [colors & effects]
              </TextElement>

              <StackCol spacing={2}>
                {/* Preset Colors Grid */}
                <Box>
                  <TextElement size="xs" weight="semibold" sx={{ mb: 1 }}>
                    Preset colors
                  </TextElement>
                  <Grid container spacing={1}>
                    {PRESET_COLORS.map((color, idx) => {
                      const isSelected = txtLayer.fill === color;
                      return (
                        <Grid size={{ xs: 2 }} key={idx}>
                          <Box
                            onClick={() => onUpdateLayer(txtLayer.id, { fill: color })}
                            sx={{
                              height: 32,
                              borderRadius: RADIUS.sm,
                              backgroundColor: color === "transparent" ? "#F3F4F6" : color,
                              border: isSelected ? "2px solid #B78628" : "1px solid #D5D5D5",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: isSelected ? "0 0 0 2px #E5D5BC" : "none",
                              transition: "transform 0.15s ease",
                              "&:hover": { transform: "scale(1.1)" },
                            }}
                          >
                            {color === "transparent" && <Box sx={{ fontSize: "0.6rem", color: "#666" }}>none</Box>}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                {/* Custom HEX Codes with Native Color Picker */}
                <Box>
                  <TextElement size="xs" weight="semibold" sx={{ mb: 0.5 }}>
                    Custom HEX codes
                  </TextElement>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#FFFFFF",
                      borderRadius: RADIUS.sm,
                      border: "1px solid #E5E7EB",
                      px: 1.5,
                      py: 0.75,
                      gap: 1,
                    }}
                  >
                    <input
                      type="text"
                      value={txtLayer.fill || customHex}
                      onChange={(e) => handleHexChange(e.target.value)}
                      style={{
                        border: "none",
                        outline: "none",
                        width: "100%",
                        fontSize: "0.85rem",
                        fontFamily: "monospace",
                        color: "#374151",
                        background: "transparent",
                      }}
                    />
                    <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <IconElement name="ColorLens" size="xs" color="#B78628" />
                      <input
                        type="color"
                        value={txtLayer.fill?.startsWith("#") ? txtLayer.fill : "#B78628"}
                        onChange={(e) => handleHexChange(e.target.value)}
                        style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                      />
                    </label>
                  </Box>
                </Box>
              </StackCol>
            </Paper>
          )}

          {/* Group 3: [layers] */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: RADIUS.md,
              border: "1px solid #F0ECE1",
              backgroundColor: "#FAF9F6",
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="secondary" sx={{ textTransform: "lowercase", mb: 1.5, letterSpacing: "0.05em" }}>
              [layers]
            </TextElement>

            <StackRowAlignJustBetween>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="md"
                onClick={() => onBringForward(selectedLayer.id)}
                leftIcon={<IconElement name="ArrowUpward" size="xs" />}
                sx={{ flex: 1, mr: 1, backgroundColor: "#FFFFFF" }}
              >
                ↑ Lên 1 Lớp
              </ButtonElement>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="md"
                onClick={() => onSendBackward(selectedLayer.id)}
                leftIcon={<IconElement name="ArrowDownward" size="xs" />}
                sx={{ flex: 1, backgroundColor: "#FFFFFF" }}
              >
                ↓ Xuống 1 Lớp
              </ButtonElement>
            </StackRowAlignJustBetween>
          </Paper>
        </StackCol>
      ) : (
        /* When nothing is selected: General Settings */
        <StackCol spacing={2.5}>
          <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1rem" }}>
            CÀI ĐẶT THIỆP CƯỚI
          </HeadingElement>

          <TextElement size="xs" colorVariant="secondary">
            Chạm vào bất kỳ dòng chữ hoặc hình ảnh nào trên thiệp để mở thanh chỉnh sửa thuộc tính.
          </TextElement>

          <Divider />

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: RADIUS.md,
              border: "1px solid #F0ECE1",
              backgroundColor: "#FAF9F6",
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="secondary" sx={{ textTransform: "lowercase", mb: 1 }}>
              [kích thước thiệp]
            </TextElement>
            <TextElement size="sm" weight="bold" colorVariant="gold" sx={{ mb: 1.5 }}>
              390px × {canvasHeight}px
            </TextElement>

            <StackRowAlignJustBetween>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="md"
                onClick={() => onExpandHeight(300)}
                leftIcon={<IconElement name="Add" size="xs" />}
                sx={{ backgroundColor: "#FFFFFF" }}
              >
                + Dài 300px
              </ButtonElement>
              {canvasHeight > 780 && (
                <ButtonElement
                  variant="outline"
                  size="small"
                  rounded="md"
                  onClick={() => onExpandHeight(-300)}
                  leftIcon={<IconElement name="Remove" size="xs" />}
                  sx={{ backgroundColor: "#FFFFFF" }}
                >
                  - Thu Gọn
                </ButtonElement>
              )}
            </StackRowAlignJustBetween>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: RADIUS.md,
              border: "1px solid #F0ECE1",
              backgroundColor: "#FAF9F6",
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="secondary" sx={{ textTransform: "lowercase", mb: 1.5 }}>
              [màu nền thiệp]
            </TextElement>
            <Grid container spacing={1}>
              {[
                { name: "Trắng", color: "#FFFFFF", border: "#C59B4B" },
                { name: "Kem", color: "#FCFAF6", border: "#E0D1B9" },
                { name: "Hồng", color: "#FFF8F7", border: "#E58B7B" },
                { name: "Nhung", color: "#3B1117", border: "#8B1E2B" },
              ].map((bg) => (
                <Grid size={{ xs: 6 }} key={bg.color}>
                  <Paper
                    elevation={0}
                    onClick={() => onSetBackground(bg.color)}
                    sx={{
                      p: 1,
                      borderRadius: RADIUS.sm,
                      border: `2px solid ${canvasBg === bg.color ? COLOR.gold.main : "#ECE7DD"}`,
                      backgroundColor: bg.color,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ width: 14, height: 14, borderRadius: RADIUS.full, backgroundColor: bg.border }} />
                    <TextElement size="xs" weight="semibold" sx={{ fontSize: "0.68rem", color: bg.color === "#3B1117" ? "#FFFFFF" : "#2A231C" }}>
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
