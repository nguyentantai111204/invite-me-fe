"use client";

import React from "react";
import { Box, IconButton, Tooltip, Select, MenuItem } from "@mui/material";
import Link from "next/link";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
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
    <Box
      sx={{
        height: 60,
        backgroundColor: "#FFFFFF",
        borderBottom: `1px solid #ECE7DD`,
        px: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: SHADOW.sm,
        zIndex: 100,
      }}
    >
      {/* Left: Back & Title */}
      <StackRowAlignJustCenter spacing={2}>
        <Tooltip title="Quay về trang chủ">
          <IconButton component={Link} href="/" size="small" sx={{ border: `1px solid ${COLOR.borderSecondary}` }}>
            <IconElement name="ArrowBack" size="xs" />
          </IconButton>
        </Tooltip>

        <Box>
          <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "0.95rem", lineHeight: 1.2 }}>
            {title || "Thiệp Cưới Hoàng Kim Minh Quân & Thanh Trúc"}
          </HeadingElement>
          <TextElement size="xs" colorVariant="secondary">
            Cố định chuẩn Mobile 390px • Auto-save
          </TextElement>
        </Box>
      </StackRowAlignJustCenter>

      {/* Center: Undo/Redo & Zoom & Add Length */}
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

        <Box sx={{ width: "1px", height: 20, backgroundColor: COLOR.divider, mx: 1 }} />

        {/* Zoom Selector */}
        <Select
          size="small"
          value={scale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          sx={{ height: 32, fontSize: "0.8rem", width: 85, backgroundColor: "#FFFFFF" }}
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
            sx={{ height: 32, ml: 1, backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", textTransform: "none", fontSize: "0.8rem" }}
          >
            + Add length
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
          sx={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
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
    </Box>
  );
};
