"use client";

import React from "react";
import { Box, IconButton, Tooltip, Select, MenuItem, CircularProgress } from "@mui/material";
import Link from "next/link";
import { COLOR, SHADOW, RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING, ANIMATION } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackCol,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
  StackRowAlignJustStart,
} from "@/components/shared";

interface ICanvasTopBarProps {
  title: string;
  slug: string;
  canUndo: boolean;
  canRedo: boolean;
  scale: number;
  saveStatus?: "saved" | "saving";
  lastSavedTime?: Date | null;
  onScaleChange: (scale: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onPublish: () => void;
  onAddLength?: () => void;
  onStartTour?: () => void;
}

export const CanvasTopBar: React.FC<ICanvasTopBarProps> = ({
  title,
  slug,
  canUndo,
  canRedo,
  scale,
  saveStatus = "saved",
  lastSavedTime,
  onScaleChange,
  onUndo,
  onRedo,
  onPublish,
  onAddLength,
  onStartTour,
}) => {
  return (
    <StackRowAlignJustBetween
      data-tour="top-bar"
      sx={{
        height: 56,
        backgroundColor: COLOR.bgPaper,
        borderBottom: `1px solid ${COLOR.borderGoldLight}`,
        px: SPACING.px16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* ── Left: Back Button & Title ── */}
      <StackRowAlignJustCenter spacing={SPACING.px12}>
        <Tooltip title="Quay về trang chủ" arrow>
          <IconButton
            component={Link}
            href="/"
            size="small"
            sx={{
              width: 34,
              height: 34,
              borderRadius: RADIUS.sm,
              border: `1px solid ${COLOR.borderGoldLight}`,
              backgroundColor: COLOR.bgSecondary,
              color: COLOR.textPrimary,
              transition: ANIMATION.sm,
              "&:hover": {
                backgroundColor: COLOR.bgPaper,
                borderColor: COLOR.gold.main,
                color: COLOR.gold.main,
              },
            }}
          >
            <IconElement name="ArrowBack" size="xs" />
          </IconButton>
        </Tooltip>

        <StackCol spacing={0}>
          <HeadingElement
            variant="h6"
            weight="bold"
            sx={{
              fontSize: FONT_SIZE.xs,
              lineHeight: 1.2,
              color: COLOR.textPrimary,
              maxWidth: { xs: 140, sm: 220, md: 280 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title || "Thiệp Cưới Hoàng Kim"}
          </HeadingElement>

          {/* Dynamic Auto-Save Draft Status Badge */}
          <StackRowAlignJustStart sx={{ gap: "4px", alignItems: "center", mt: "2px" }}>
            {saveStatus === "saving" ? (
              <StackRowAlignJustStart sx={{ gap: "4px", alignItems: "center" }}>
                <CircularProgress size={9} sx={{ color: COLOR.gold.main }} />
                <TextElement size="xs" sx={{ fontSize: "0.68rem", color: COLOR.gold.main }}>
                  Đang lưu nháp...
                </TextElement>
              </StackRowAlignJustStart>
            ) : (
              <StackRowAlignJustStart sx={{ gap: "4px", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: RADIUS.full,
                    backgroundColor: COLOR.status.success.main,
                  }}
                />
                <TextElement
                  size="xs"
                  sx={{
                    fontSize: "0.68rem",
                    color: COLOR.status.success.dark,
                    fontWeight: FONT_WEIGHT.medium,
                  }}
                >
                  Đã lưu nháp {lastSavedTime ? `(${lastSavedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})` : "tự động"}
                </TextElement>
              </StackRowAlignJustStart>
            )}
          </StackRowAlignJustStart>
        </StackCol>
      </StackRowAlignJustCenter>

      {/* ── Center: Undo / Redo / Zoom / Expand Canvas ── */}
      <StackRowAlignJustCenter
        spacing={SPACING.px6}
        sx={{
          backgroundColor: COLOR.bgSecondary,
          p: "3px 6px",
          borderRadius: RADIUS.md,
          border: `1px solid ${COLOR.borderGoldLight}`,
        }}
      >
        <Tooltip title="Hoàn tác (Ctrl+Z)" arrow>
          <Box component="span">
            <IconButton
              size="small"
              onClick={onUndo}
              disabled={!canUndo}
              sx={{
                width: 28,
                height: 28,
                borderRadius: RADIUS.xs,
                color: canUndo ? COLOR.textPrimary : COLOR.textDisabled,
                "&:hover": { backgroundColor: COLOR.bgPaper },
              }}
            >
              <IconElement name="Undo" size="xs" />
            </IconButton>
          </Box>
        </Tooltip>

        <Tooltip title="Làm lại (Ctrl+Y)" arrow>
          <Box component="span">
            <IconButton
              size="small"
              onClick={onRedo}
              disabled={!canRedo}
              sx={{
                width: 28,
                height: 28,
                borderRadius: RADIUS.xs,
                color: canRedo ? COLOR.textPrimary : COLOR.textDisabled,
                "&:hover": { backgroundColor: COLOR.bgPaper },
              }}
            >
              <IconElement name="Redo" size="xs" />
            </IconButton>
          </Box>
        </Tooltip>

        {/* Divider */}
        <Box sx={{ width: "1px", height: 16, backgroundColor: COLOR.borderGoldLight, mx: "2px" }} />

        {/* Zoom Selector */}
        <Select
          size="small"
          value={scale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          sx={{
            height: 28,
            width: 74,
            fontSize: "0.75rem",
            fontWeight: FONT_WEIGHT.semibold,
            backgroundColor: COLOR.bgPaper,
            borderRadius: RADIUS.xs,
            "& .MuiSelect-select": {
              py: 0,
              px: "8px !important",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: COLOR.borderSubtle,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: COLOR.gold.main,
            },
          }}
        >
          <MenuItem value={0.75}>75%</MenuItem>
          <MenuItem value={0.85}>85%</MenuItem>
          <MenuItem value={1}>100%</MenuItem>
          <MenuItem value={1.15}>115%</MenuItem>
        </Select>

        {/* Expand Canvas Button */}
        {onAddLength && (
          <Tooltip title="Tăng chiều dài thiệp thêm 300px" arrow>
            <ButtonElement
              variant="outline"
              size="small"
              rounded="sm"
              onClick={onAddLength}
              leftIcon={<IconElement name="Add" size="xs" />}
              sx={{
                height: 28,
                px: 1,
                backgroundColor: COLOR.bgPaper,
                borderColor: COLOR.borderSubtle,
                fontSize: "0.72rem",
                fontWeight: FONT_WEIGHT.semibold,
                color: COLOR.textSecondary,
                "&:hover": {
                  borderColor: COLOR.gold.main,
                  color: COLOR.gold.main,
                  backgroundColor: COLOR.bgPaper,
                },
              }}
            >
              Mở Rộng
            </ButtonElement>
          </Tooltip>
        )}
      </StackRowAlignJustCenter>

      {/* ── Right: Tour Help / Mobile Preview / Publish Button ── */}
      <StackRowAlignJustCenter spacing={SPACING.px8}>
        {onStartTour && (
          <Tooltip title="Xem tour hướng dẫn nhanh" arrow>
            <ButtonElement
              variant="text"
              size="small"
              rounded="sm"
              onClick={onStartTour}
              leftIcon={<IconElement name="HelpOutlined" size="xs" color={COLOR.gold.main} />}
              sx={{
                height: 34,
                fontSize: FONT_SIZE.xs,
                color: COLOR.gold.main,
                fontWeight: FONT_WEIGHT.semibold,
                px: SPACING.px8,
                "&:hover": { backgroundColor: `${COLOR.gold.main}12` },
              }}
            >
              Hướng Dẫn
            </ButtonElement>
          </Tooltip>
        )}

        <ButtonElement
          component={Link}
          href={`/i/${slug}`}
          target="_blank"
          variant="outline"
          size="small"
          rounded="sm"
          leftIcon={<IconElement name="Visibility" size="xs" />}
          sx={{
            height: 34,
            px: SPACING.px12,
            backgroundColor: COLOR.bgPaper,
            borderColor: COLOR.borderGoldLight,
            fontSize: FONT_SIZE.xs,
            fontWeight: FONT_WEIGHT.semibold,
            color: COLOR.textPrimary,
            "&:hover": {
              borderColor: COLOR.gold.main,
              color: COLOR.gold.main,
            },
          }}
        >
          Xem Thử 3D
        </ButtonElement>

        <ButtonElement
          variant="gradient"
          size="small"
          rounded="sm"
          onClick={onPublish}
          leftIcon={<IconElement name="Send" size="xs" />}
          sx={{
            height: 34,
            px: SPACING.px16,
            fontSize: FONT_SIZE.xs,
            fontWeight: FONT_WEIGHT.bold,
            boxShadow: SHADOW.sm,
            "&:hover": {
              boxShadow: SHADOW.md,
            },
          }}
        >
          Xuất Bản Thiệp
        </ButtonElement>
      </StackRowAlignJustCenter>
    </StackRowAlignJustBetween>
  );
};
