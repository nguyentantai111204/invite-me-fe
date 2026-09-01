"use client";

import React, { useState } from "react";
import { Box, Container, IconButton, keyframes } from "@mui/material";
import Link from "next/link";
import { IFestivalBannerConfig } from "@/interfaces/home-cms.interface";
import {
  COLOR,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
  ANIMATION,
} from "@/constants/style.constant";
import { TextElement, IconElement, STACK_ROW_ALIGN_JUST_CENTER } from "@/components/shared";

interface IFestivalBannerProps {
  config?: IFestivalBannerConfig;
}

// Keyframes: Pulse Glow for Badge & Shimmer for Banner
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(229, 139, 123, 0.75);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(229, 139, 123, 0);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(229, 139, 123, 0);
    transform: scale(1);
  }
`;

const beaconBlink = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.7); }
`;

const shimmerBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const FestivalBanner: React.FC<IFestivalBannerProps> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!config?.enabled || !config.text || !isVisible) return null;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: config.bgColor || COLOR.bgDark,
        color: COLOR.textInverse,
        py: 1,
        px: { xs: 2, sm: 6 },
        position: "relative",
        zIndex: 100,
        borderRadius: 0,
        borderBottom: `1px solid ${COLOR.borderGoldLight}`,
        // Animated subtle gold accent bar at top
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${COLOR.gold.main}, ${COLOR.gold.light}, ${COLOR.btnSecondary}, ${COLOR.gold.light}, ${COLOR.gold.main})`,
          backgroundSize: "200% 200%",
          animation: `${shimmerBorder} 4s ease infinite`,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          ...STACK_ROW_ALIGN_JUST_CENTER,
          gap: 1.5,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          textAlign: "center",
          justifyContent: "center",
          pr: { xs: 5, sm: 0 },
        }}
      >
        {/* Eye-catching Blinking & Pulsing Badge */}
        {config.badge && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              backgroundColor: COLOR.btnSecondary,
              color: COLOR.textInverse,
              borderRadius: RADIUS.full,
              px: 1.5,
              py: 0.35,
              fontSize: FONT_SIZE.xs,
              fontWeight: FONT_WEIGHT.bold,
              textTransform: "uppercase",
              letterSpacing: LETTER_SPACING.wide,
              animation: `${pulseGlow} 2.5s infinite`,
              flexShrink: 0,
            }}
          >
            {/* Blinking live beacon indicator */}
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: RADIUS.full,
                backgroundColor: COLOR.textWhite,
                animation: `${beaconBlink} 1.2s ease-in-out infinite`,
              }}
            />
            {config.badge}
          </Box>
        )}

        {/* Banner Text Message */}
        <TextElement
          size="sm"
          weight="medium"
          colorVariant="white"
          sx={{
            fontSize: { xs: FONT_SIZE.xs, sm: FONT_SIZE.sm },
            lineHeight: 1.3,
          }}
        >
          {config.text}
        </TextElement>

        {/* Action Link with Glowing Underline & Arrow */}
        {config.link && config.linkText && (
          <Link
            href={config.link}
            style={{
              color: COLOR.gold.light,
              fontWeight: FONT_WEIGHT.bold,
              fontSize: FONT_SIZE.sm,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              whiteSpace: "nowrap",
              transition: ANIMATION.sm,
            }}
          >
            {config.linkText} →
          </Link>
        )}
      </Container>

      {/* Close Button Pinned to the Far Right of Banner Bar */}
      <IconButton
        size="small"
        onClick={() => setIsVisible(false)}
        aria-label="Đóng thông báo"
        sx={{
          position: "absolute",
          right: { xs: 8, sm: 16 },
          top: "50%",
          transform: "translateY(-50%)",
          color: COLOR.textMutedWhite,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          p: 0.5,
          borderRadius: RADIUS.full,
          transition: ANIMATION.sm,
          "&:hover": {
            color: COLOR.textWhite,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            transform: "translateY(-50%) scale(1.1)",
          },
        }}
      >
        <IconElement name="Close" size="xs" />
      </IconButton>
    </Box>
  );
};
