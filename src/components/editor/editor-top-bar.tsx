"use client";

import React from "react";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import Link from "next/link";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT, FONT_SIZE } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
} from "@/components/shared";

interface IEditorTopBarProps {
  title: string;
  slug: string;
  isSaving: boolean;
  viewMode: "mobile" | "desktop";
  onViewModeChange: (mode: "mobile" | "desktop") => void;
  onPublish: () => void;
  isPublished?: boolean;
}

export const EditorTopBar: React.FC<IEditorTopBarProps> = ({
  title,
  slug,
  isSaving,
  viewMode,
  onViewModeChange,
  onPublish,
  isPublished,
}) => {
  return (
    <Box
      sx={{
        height: 64,
        backgroundColor: COLOR.bgPaper,
        borderBottom: `1px solid ${COLOR.borderGoldLight}`,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100,
        boxShadow: SHADOW.sm,
      }}
    >
      {/* Left Section: Back Button & Title */}
      <StackRowAlignJustCenter spacing={2}>
        <Tooltip title="Quay về trang chủ">
          <IconButton component={Link} href="/" size="small" sx={{ border: `1px solid ${COLOR.borderSecondary}` }}>
            <IconElement name="ArrowBack" size="xs" />
          </IconButton>
        </Tooltip>

        <Box>
          <HeadingElement variant="h6" weight="bold" sx={{ fontSize: "1.05rem", lineHeight: 1.2 }}>
            {title || "Studio Biên Tập Thiệp"}
          </HeadingElement>
          <StackRowAlignJustCenter spacing={1}>
            <TextElement size="xs" colorVariant="secondary">
              Slug: /i/{slug}
            </TextElement>
            {isPublished && (
              <Chip label="ĐÃ XUẤT BẢN" size="small" sx={{ height: 18, fontSize: "0.62rem", backgroundColor: "#E6F4EA", color: "#137333", fontWeight: "bold" }} />
            )}
          </StackRowAlignJustCenter>
        </Box>
      </StackRowAlignJustCenter>

      {/* Center Section: Device Switcher */}
      <Box
        sx={{
          backgroundColor: COLOR.bgSecondary,
          borderRadius: RADIUS.full,
          p: 0.5,
          border: `1px solid ${COLOR.borderGoldLight}`,
          display: { xs: "none", sm: "flex" },
        }}
      >
        <StackRowAlignJustCenter spacing={0.5}>
          <ButtonElement
            variant={viewMode === "mobile" ? "primary" : "text"}
            size="small"
            rounded="full"
            onClick={() => onViewModeChange("mobile")}
            leftIcon={<IconElement name="PhoneIphone" size="xs" />}
            sx={{ px: 2, minHeight: 32 }}
          >
            Mobile 3D
          </ButtonElement>

          <ButtonElement
            variant={viewMode === "desktop" ? "primary" : "text"}
            size="small"
            rounded="full"
            onClick={() => onViewModeChange("desktop")}
            leftIcon={<IconElement name="Laptop" size="xs" />}
            sx={{ px: 2, minHeight: 32 }}
          >
            Toàn Màn Hình
          </ButtonElement>
        </StackRowAlignJustCenter>
      </Box>

      {/* Right Section: Auto-save status, Live Preview & Publish */}
      <StackRowAlignJustCenter spacing={2}>
        <StackRowAlignJustCenter spacing={0.5}>
          <IconElement
            name={isSaving ? "Sync" : "CheckCircle"}
            size="xs"
            color={isSaving ? COLOR.textGold : "#137333"}
          />
          <TextElement size="xs" colorVariant={isSaving ? "gold" : "muted"}>
            {isSaving ? "Đang lưu..." : "Đã lưu tự động"}
          </TextElement>
        </StackRowAlignJustCenter>

        <ButtonElement
          component={Link}
          href={`/i/${slug}`}
          target="_blank"
          variant="outline"
          size="medium"
          rounded="md"
          leftIcon={<IconElement name="Visibility" size="xs" />}
        >
          Xem Thử 3D
        </ButtonElement>

        <ButtonElement
          variant="gradient"
          size="medium"
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
