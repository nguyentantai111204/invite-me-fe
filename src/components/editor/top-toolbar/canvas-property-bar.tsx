"use client";

import React from "react";
import {
  Box,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { ICanvasLayer, ICanvasTextLayer, ICanvasImageLayer, ICanvasShapeLayer } from "@/interfaces/canvas-editor.interface";
import { COLOR, RADIUS, SHADOW, FONT_SIZE, SPACING, ANIMATION } from "@/constants/style.constant";
import {
  TextElement,
  IconElement,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
} from "@/components/shared";

interface ICanvasPropertyBarProps {
  selectedLayer: ICanvasLayer | null;
  onUpdateLayer: (id: string, updates: Partial<ICanvasLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onDeselect: () => void;
}

export const CanvasPropertyBar: React.FC<ICanvasPropertyBarProps> = ({
  selectedLayer,
  onUpdateLayer,
  onDeleteLayer,
  onBringForward,
  onSendBackward,
  onDeselect,
}) => {
  if (!selectedLayer) {
    return (
      <StackRowAlignJustCenter
        sx={{
          height: 52,
          backgroundColor: COLOR.bgPaper,
          borderBottom: `1px solid ${COLOR.borderGoldLight}`,
          px: SPACING.px24,
          boxShadow: SHADOW.sm,
        }}
      >
        <TextElement size="xs" colorVariant="secondary" sx={{ fontStyle: "italic" }}>
          💡 Chạm vào bất kỳ đối tượng nào trên thiệp để chỉnh sửa kích thước, chữ, font và màu sắc.
        </TextElement>
      </StackRowAlignJustCenter>
    );
  }

  const isText = selectedLayer.type === "text";
  const txtLayer = isText ? (selectedLayer as ICanvasTextLayer) : null;

  // StackRowAlignJustBetween = display:flex, align:center, justify:space-between
  return (
    <StackRowAlignJustBetween
      sx={{
        height: 52,
        backgroundColor: COLOR.bgPaper,
        borderBottom: `1px solid ${COLOR.borderGoldLight}`,
        px: SPACING.px24,
        gap: SPACING.px16,
        overflowX: "auto",
        boxShadow: SHADOW.sm,
        zIndex: 50,
      }}
    >
      <StackRowAlignJustCenter spacing={1.5}>
        {/* Layer Type & Name */}
        <Box sx={{ minWidth: 90 }}>
          <TextElement size="xs" weight="bold" colorVariant="gold">
            {selectedLayer.name || selectedLayer.type.toUpperCase()}
          </TextElement>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* 1. Text Properties */}
        {isText && txtLayer && (
          <>
            {/* Font Family Select */}
            <Select
              size="small"
              value={txtLayer.fontFamily || "'Playfair Display', serif"}
              onChange={(e) => onUpdateLayer(txtLayer.id, { fontFamily: e.target.value })}
              sx={{ height: 32, fontSize: FONT_SIZE.xs, minWidth: 140 }}
            >
              <MenuItem value="'Playfair Display', serif">Playfair Display (Serif)</MenuItem>
              <MenuItem value="Inter, sans-serif">Inter (Hiện Đại)</MenuItem>
              <MenuItem value="'Great Vibes', cursive">Great Vibes (Uốn Lượn)</MenuItem>
              <MenuItem value="'Cinzel', serif">Cinzel (Quý Tộc)</MenuItem>
            </Select>

            {/* Font Size Select */}
            <Select
              size="small"
              value={txtLayer.fontSize || 18}
              onChange={(e) => onUpdateLayer(txtLayer.id, { fontSize: Number(e.target.value) })}
              sx={{ height: 32, fontSize: FONT_SIZE.xs, width: 70 }}
            >
              {[11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px
                </MenuItem>
              ))}
            </Select>

            {/* Bold / Italic */}
            <ToggleButtonGroup size="small" sx={{ height: 32 }}>
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

            {/* Text Alignment */}
            <ToggleButtonGroup
              size="small"
              value={txtLayer.textAlign || "center"}
              exclusive
              onChange={(_, val) => val && onUpdateLayer(txtLayer.id, { textAlign: val })}
              sx={{ height: 32 }}
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

            {/* Text Color Swatches */}
            <StackRowAlignJustCenter spacing={0.5}>
              {["#B78628", "#2A231C", "#8B1E2B", "#DE7C66", "#FFFFFF"].map((color) => (
                <Box
                  key={color}
                  onClick={() => onUpdateLayer(txtLayer.id, { fill: color })}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: RADIUS.full,
                    backgroundColor: color,
                    border: `1.5px solid ${txtLayer.fill === color ? COLOR.gold.main : COLOR.borderSubtle}`,
                    cursor: "pointer",
                    boxShadow: txtLayer.fill === color ? `0 0 0 2px ${COLOR.gold.main}` : "none",
                  }}
                />
              ))}
            </StackRowAlignJustCenter>
          </>
        )}
      </StackRowAlignJustCenter>

      {/* Layer Order & Actions */}
      <StackRowAlignJustCenter spacing={1}>
        <Tooltip title="Đưa lên trên 1 lớp">
          <IconButton size="small" onClick={() => onBringForward(selectedLayer.id)}>
            <IconElement name="ArrowUpward" size="xs" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Đưa xuống dưới 1 lớp">
          <IconButton size="small" onClick={() => onSendBackward(selectedLayer.id)}>
            <IconElement name="ArrowDownward" size="xs" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Xóa đối tượng">
          <IconButton size="small" color="error" onClick={() => onDeleteLayer(selectedLayer.id)}>
            <IconElement name="Delete" size="xs" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bỏ chọn">
          <IconButton size="small" onClick={onDeselect}>
            <IconElement name="Close" size="xs" />
          </IconButton>
        </Tooltip>
      </StackRowAlignJustCenter>
    </StackRowAlignJustBetween>
  );
};
