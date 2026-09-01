"use client";

import React from "react";
import { Box, IconButton, Tooltip, Select, MenuItem } from "@mui/material";
import Link from "next/link";
import { COLOR, SHADOW, FONT_SIZE, FONT_WEIGHT } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackCol,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
} from "@/components/shared";

interface ICanvasTopBarProps {
  title: string;
  slug: string;
  canUndo: boolean;
  canRedo: boolean;
  scale: number;
  onScaleChange: (scale: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onPublish: () => void;
  onAddLength?: () => void;
}

export const CanvasTopBar: React.FC<ICanvasTopBarProps> = ({
  title,
  slug,
  canUndo,
  canRedo,
  scale,
  onScaleChange,
  onUndo,
  onRedo,
  onPublish,
  onAddLength,
}) => {
  return (
    // StackRowAlignJustBetween = display:flex, alignItems:center, justifyContent:space-between
    <StackRowAlignJustBetween
      sx={{
        height: 60,
        backgroundColor: COLOR.bgPaper,
        borderBottom: `1px solid ${COLOR.borderGoldLight}`,
        px: 2.5,       // 20px — closest 4px-grid value to a standard topbar gutter
        boxShadow: SHADOW.sm,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Left: Back & Title */}
      <StackRowAlignJustCenter spacing={2}>
        <Tooltip title="Quay về trang chủ">
          <IconButton
            component={Link}
            href="/"
            size="small"
            sx={{ border: `1px solid ${COLOR.borderSecondary}` }}
          >
            <IconElement name="ArrowBack" size="xs" />
          </IconButton>
        </Tooltip>

        {/* StackCol = display:flex, flexDirection:column, no hardcoded flex props */}
        <StackCol spacing={0}>
          <HeadingElement
            variant="h6"
            weight="bold"
            sx={{ fontSize: FONT_SIZE.sm, lineHeight: 1.2 }}
          >
            {title || "Thiệp Cưới Hoàng Kim Minh Quân & Thanh Trúc"}
          </HeadingElement>
          <TextElement size="xs" colorVariant="secondary">
            Cố định chuẩn Mobile 390px • Tự động lưu
          </TextElement>
        </StackCol>
      </StackRowAlignJustCenter>

      {/* Center: Undo / Redo / Zoom / Expand */}
      <StackRowAlignJustCenter spacing={1}>
        <Tooltip title="Hoàn tác (Ctrl+Z)">
          <span>
            <IconButton size="small" onClick={onUndo} disabled={!canUndo}>
              <IconElement name="Undo" size="xs" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Làm lại (Ctrl+Y)">
          <span>
            <IconButton size="small" onClick={onRedo} disabled={!canRedo}>
              <IconElement name="Redo" size="xs" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Vertical Divider — 1px × 20px, not a spacing shorthand */}
        <Box sx={{ width: 1, height: 20, backgroundColor: COLOR.divider }} />

        {/* Zoom Selector */}
        <Select
          size="small"
          value={scale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          sx={{
            height: 32,
            width: 80,
            fontSize: FONT_SIZE.xs,
            backgroundColor: COLOR.bgPaper,
          }}
        >
          <MenuItem value={0.75}>75%</MenuItem>
          <MenuItem value={0.85}>85%</MenuItem>
          <MenuItem value={1}>100%</MenuItem>
          <MenuItem value={1.15}>115%</MenuItem>
        </Select>

        {onAddLength && (
          <ButtonElement
            variant="outline"
            size="small"
            rounded="md"
            onClick={onAddLength}
            leftIcon={<IconElement name="Add" size="xs" />}
            sx={{
              height: 32,
              backgroundColor: COLOR.bgPaper,
              borderColor: COLOR.borderSubtle,
              fontSize: FONT_SIZE.xs,
              fontWeight: FONT_WEIGHT.semibold,
            }}
          >
            Mở Rộng Thiệp
          </ButtonElement>
        )}
      </StackRowAlignJustCenter>

      {/* Right: Preview & Publish */}
      <StackRowAlignJustCenter spacing={1.5}>
        <ButtonElement
          component={Link}
          href={`/i/${slug}`}
          target="_blank"
          variant="outline"
          size="small"
          rounded="md"
          leftIcon={<IconElement name="Visibility" size="xs" />}
          sx={{ backgroundColor: COLOR.bgPaper, borderColor: COLOR.borderSubtle }}
        >
          Xem Thử Mobile
        </ButtonElement>

        <ButtonElement
          variant="gradient"
          size="small"
          rounded="md"
          onClick={onPublish}
          leftIcon={<IconElement name="Send" size="xs" />}
        >
          Xuất Bản Thiệp
        </ButtonElement>
      </StackRowAlignJustCenter>
    </StackRowAlignJustBetween>
  );
};
