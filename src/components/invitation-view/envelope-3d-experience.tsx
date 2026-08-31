"use client";

import React, { useState } from "react";
import { Box, keyframes } from "@mui/material";
import { IInvitation } from "@/interfaces/invitation.interface";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT, FONT_SIZE } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  IconElement,
  StackCenter,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
} from "@/components/shared";

interface IEnvelope3dExperienceProps {
  invitation: IInvitation;
  guestName?: string;
  onOpened: () => void;
}

const pulseRing = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.6); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 16px rgba(212, 175, 55, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
`;

const floatCard = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

export const Envelope3dExperience: React.FC<IEnvelope3dExperienceProps> = ({
  invitation,
  guestName,
  onOpened,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const groomName = invitation.coupleData?.groom.shortName || "Minh Quân";
  const brideName = invitation.coupleData?.bride.shortName || "Thanh Trúc";
  const formattedDate = new Date(invitation.eventDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Sau khi nắp lật và thiệp trượt lên (1.2s), fade out và kích hoạt xem trang đầy đủ
    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onOpened();
      }, 600);
    }, 1200);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: `radial-gradient(ellipse at 50% 40%, #2A241E 0%, #14110E 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        opacity: isFadingOut ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isFadingOut ? "none" : "auto",
      }}
    >
      <StackColAlignJustCenter spacing={4} sx={{ width: "100%", maxWidth: 420 }}>
        {/* Envelope Outer Box */}
        <Box
          onClick={handleOpenEnvelope}
          sx={{
            width: "100%",
            height: 270,
            backgroundColor: invitation.themeConfig?.envelopeColor || "#E8D8C3",
            borderRadius: RADIUS.md,
            border: `2px solid ${COLOR.borderGold}`,
            position: "relative",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            cursor: isOpen ? "default" : "pointer",
            animation: !isOpen ? `${floatCard} 4s ease-in-out infinite` : "none",
            perspective: 1000,
          }}
        >
          {/* Flap Triangle (Nắp Phong Bì) */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 120,
              backgroundColor: "#DFCAB0",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformOrigin: "top center",
              transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              zIndex: isOpen ? 1 : 4,
              borderBottom: `1.5px solid ${COLOR.borderGold}`,
            }}
          />

          {/* Red Monogram Wax Seal (Tem Sáp Niêm Phong) */}
          {!isOpen && (
            <StackCenter
              sx={{
                position: "absolute",
                top: 90,
                left: "50%",
                transform: "translateX(-50%)",
                width: 54,
                height: 54,
                borderRadius: RADIUS.full,
                backgroundColor: invitation.themeConfig?.waxSealColor || "#A82424",
                color: "#FFFFFF",
                boxShadow: SHADOW.lg,
                zIndex: 6,
                border: "2px solid #781515",
                animation: `${pulseRing} 2s infinite`,
              }}
            >
              <IconElement name="Favorite" size="sm" />
            </StackCenter>
          )}

          {/* Sliding Letter Card Inside (Lá Thiệp Trượt Ra) */}
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              height: 230,
              backgroundColor: "#FFFDF9",
              borderRadius: RADIUS.sm,
              border: `1.5px solid ${COLOR.borderGold}`,
              p: 3,
              textAlign: "center",
              boxShadow: SHADOW.md,
              transition: "all 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isOpen ? "translateY(-110px) scale(1.05)" : "translateY(0px)",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest" sx={{ mb: 1 }}>
              SAVE THE DATE
            </TextElement>

            <HeadingElement variant="h4" fontFamilyType="serif" weight="bold" sx={{ color: COLOR.textPrimary, my: 0.5 }}>
              {groomName} & {brideName}
            </HeadingElement>

            <StackRowAlignJustCenter spacing={1} sx={{ my: 1, width: "50%" }}>
              <Box sx={{ flex: 1, height: "1px", backgroundColor: COLOR.borderGold }} />
              <Box sx={{ color: COLOR.gold.main, fontSize: "0.75rem" }}>💍</Box>
              <Box sx={{ flex: 1, height: "1px", backgroundColor: COLOR.borderGold }} />
            </StackRowAlignJustCenter>

            <TextElement size="xs" weight="bold" colorVariant="secondary" sx={{ letterSpacing: "0.1em" }}>
              {formattedDate}
            </TextElement>

            {guestName && (
              <TextElement size="xs" colorVariant="gold" weight="semibold" sx={{ mt: 1.5 }}>
                Kính gửi: {guestName}
              </TextElement>
            )}
          </Box>

          {/* Envelope Bottom Pocket Texture */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 140,
              backgroundColor: "#DFCAB0",
              clipPath: "polygon(0 100%, 100% 100%, 100% 20%, 50% 85%, 0 20%)",
              zIndex: 5,
              borderTop: `1px solid ${COLOR.borderGold}`,
            }}
          />
        </Box>

        {/* Tap to Open Hint */}
        <StackRowAlignJustCenter spacing={1} sx={{ opacity: isOpen ? 0 : 0.9, transition: "opacity 0.3s ease" }}>
          <IconElement name="AutoAwesome" size="xs" color={COLOR.textGold} />
          <TextElement size="sm" weight="semibold" colorVariant="white" letterSpacingType="wide">
            Chạm vào phong bì để mở thiệp cưới
          </TextElement>
          <IconElement name="AutoAwesome" size="xs" color={COLOR.textGold} />
        </StackRowAlignJustCenter>
      </StackColAlignJustCenter>
    </Box>
  );
};
