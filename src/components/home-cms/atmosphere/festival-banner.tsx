"use client";

import React, { useState } from "react";
import { Box, Container, IconButton } from "@mui/material";
import Link from "next/link";
import { IFestivalBannerConfig } from "@/interfaces/home-cms.interface";
import { COLOR, RADIUS } from "@/constants/style.constant";
import { TextElement, IconElement } from "@/components/shared";
import { STACK_ROW_ALIGN_JUST_CENTER } from "@/components/shared/stack-custom/stack-custom.style";

interface IFestivalBannerProps {
  config?: IFestivalBannerConfig;
}

export const FestivalBanner: React.FC<IFestivalBannerProps> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!config?.enabled || !config.text || !isVisible) return null;

  return (
    <Box
      sx={{
        backgroundColor: config.bgColor || COLOR.bgDark,
        color: COLOR.textInverse,
        py: 1,
        px: 2,
        position: "relative",
        zIndex: 100,
        borderBottom: `1px solid ${COLOR.borderGoldLight}`,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          ...STACK_ROW_ALIGN_JUST_CENTER,
          position: "relative",
          gap: 1.5,
        }}
      >
        {config.badge && (
          <Box
            sx={{
              backgroundColor: COLOR.btnSecondary,
              color: COLOR.textInverse,
              borderRadius: RADIUS.full,
              px: 1.2,
              py: 0.2,
              fontSize: "0.75rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {config.badge}
          </Box>
        )}

        <TextElement size="sm" weight="medium" colorVariant="white">
          {config.text}
        </TextElement>

        {config.link && config.linkText && (
          <Link
            href={config.link}
            style={{
              color: COLOR.gold.light,
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "underline",
              marginLeft: 4,
            }}
          >
            {config.linkText} →
          </Link>
        )}

        <IconButton
          size="small"
          onClick={() => setIsVisible(false)}
          sx={{
            position: "absolute",
            right: 0,
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": { color: "#FFFFFF" },
          }}
        >
          <IconElement name="Close" size="xs" />
        </IconButton>
      </Container>
    </Box>
  );
};
