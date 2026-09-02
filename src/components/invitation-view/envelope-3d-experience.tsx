"use client";

import React, { useState } from "react";
import { Box, keyframes } from "@mui/material";
import { IInvitation } from "@/interfaces/invitation.interface";
import { CanvasOpeningEffectType } from "@/interfaces/canvas-editor.interface";
import { COLOR, RADIUS, SHADOW, SPACING } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  IconElement,
  StackCenter,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
} from "@/components/shared";

interface IEnvelope3dProps {
  invitation: IInvitation;
  openingEffect?: CanvasOpeningEffectType;
  guestName?: string;
  onOpened: () => void;
}

// Keyframes
const floatCard = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(0.5deg); }
`;

const pulseRing = keyframes`
  0% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(183, 134, 40, 0.5); }
  70% { transform: translateX(-50%) scale(1.05); box-shadow: 0 0 0 16px rgba(183, 134, 40, 0); }
  100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(183, 134, 40, 0); }
`;

const shimmerGold = keyframes`
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.03); }
`;

export const Envelope3dExperience: React.FC<IEnvelope3dProps> = ({
  invitation,
  openingEffect = "envelope-3d",
  guestName: propGuestName,
  onOpened,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const groomName = invitation.coupleData?.groom.fullName || "Minh Quân";
  const brideName = invitation.coupleData?.bride.fullName || "Thanh Trúc";
  const guestName = propGuestName;
  const formattedDate = invitation.eventDate
    ? new Date(invitation.eventDate).toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Chủ Nhật, 20 Tháng 11, 2026";

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // After 1.3s of smooth 3D animation, fade out overlay to reveal invitation
    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onOpened();
      }, 500);
    }, 1300);
  };

  return (
    <StackCenter
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: `radial-gradient(ellipse at 50% 40%, #2A241E 0%, #120F0D 100%)`,
        p: SPACING.px16,
        opacity: isFadingOut ? 0 : 1,
        transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isFadingOut ? "none" : "auto",
      }}
    >
      <StackColAlignJustCenter spacing={SPACING.px32} sx={{ width: "100%", maxWidth: 430 }}>
        {/* ================= 1. ENVELOPE 3D OPENING ================= */}
        {openingEffect === "envelope-3d" && (
          <Box
            onClick={handleOpen}
            sx={{
              width: "100%",
              maxWidth: 390,
              height: 270,
              backgroundColor: invitation.themeConfig?.envelopeColor || "#E8D8C3",
              borderRadius: RADIUS.md,
              border: `2px solid ${COLOR.borderGold}`,
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              cursor: isOpen ? "default" : "pointer",
              animation: !isOpen ? `${floatCard} 4s ease-in-out infinite` : "none",
              perspective: 1000,
              overflow: isOpen ? "visible" : "hidden",
            }}
          >
            {/* Back Pocket Background */}
            <Box sx={{ position: "absolute", inset: 0, backgroundColor: "#D8C5AE", zIndex: 1 }} />

            {/* Sliding Letter Card Inside */}
            <StackColAlignJustCenter
              sx={{
                position: "absolute",
                top: 20,
                left: 20,
                right: 20,
                height: 230,
                backgroundColor: COLOR.bgPaper,
                borderRadius: RADIUS.sm,
                border: `1.5px solid ${COLOR.borderGold}`,
                p: SPACING.px24,
                textAlign: "center",
                boxShadow: SHADOW.md,
                transition: "all 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isOpen ? "translateY(-130px) scale(1.04)" : "translateY(0px)",
                opacity: isOpen ? 1 : 0,
                zIndex: isOpen ? 10 : 2,
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
            </StackColAlignJustCenter>

            {/* Envelope Front Pocket */}
            <Box sx={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
              <Box sx={{ position: "absolute", inset: 0, backgroundColor: "#E2D0BA", clipPath: "polygon(0 0, 0 100%, 50% 55%)" }} />
              <Box sx={{ position: "absolute", inset: 0, backgroundColor: "#E2D0BA", clipPath: "polygon(100% 0, 100% 100%, 50% 55%)" }} />
              <Box sx={{ position: "absolute", inset: 0, backgroundColor: "#EADCC8", clipPath: "polygon(0 100%, 100% 100%, 50% 48%)" }} />
            </Box>

            {/* Flap Triangle */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 140,
                backgroundColor: "#DFCAB0",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                zIndex: isOpen ? 1 : 6,
                borderBottom: `1.5px solid ${COLOR.borderGold}`,
              }}
            />

            {/* Red Wax Seal */}
            {!isOpen && (
              <StackCenter
                sx={{
                  position: "absolute",
                  top: 115,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 56,
                  height: 56,
                  borderRadius: RADIUS.full,
                  backgroundColor: invitation.themeConfig?.waxSealColor || "#A82424",
                  color: "#FFFFFF",
                  boxShadow: SHADOW.lg,
                  zIndex: 8,
                  border: "2px solid #781515",
                  animation: `${pulseRing} 2s infinite`,
                }}
              >
                <IconElement name="Favorite" size="sm" />
              </StackCenter>
            )}
          </Box>
        )}

        {/* ================= 2. GOLDEN GATE FOLD 3D ================= */}
        {openingEffect === "gate-fold" && (
          <Box
            onClick={handleOpen}
            sx={{
              width: "100%",
              maxWidth: 390,
              height: 380,
              perspective: 1200,
              cursor: isOpen ? "default" : "pointer",
              position: "relative",
              boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
              borderRadius: RADIUS.md,
            }}
          >
            {/* Left Gate Door */}
            <StackCenter
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                height: "100%",
                backgroundColor: "#1A1512",
                border: `2px solid ${COLOR.borderGold}`,
                borderRight: `1px solid ${COLOR.borderGold}`,
                borderTopLeftRadius: RADIUS.md,
                borderBottomLeftRadius: RADIUS.md,
                transformOrigin: "left center",
                transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isOpen ? "rotateY(-130deg)" : "rotateY(0deg)",
                zIndex: 5,
                justifyContent: "flex-end",
                pr: SPACING.px16,
              }}
            >
              <Box sx={{ fontSize: "2rem" }}>⚜️</Box>
            </StackCenter>

            {/* Right Gate Door */}
            <StackCenter
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "50%",
                height: "100%",
                backgroundColor: "#1A1512",
                border: `2px solid ${COLOR.borderGold}`,
                borderLeft: `1px solid ${COLOR.borderGold}`,
                borderTopRightRadius: RADIUS.md,
                borderBottomRightRadius: RADIUS.md,
                transformOrigin: "right center",
                transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isOpen ? "rotateY(130deg)" : "rotateY(0deg)",
                zIndex: 5,
                justifyContent: "flex-start",
                pl: SPACING.px16,
              }}
            >
              <Box sx={{ fontSize: "2rem" }}>⚜️</Box>
            </StackCenter>

            {/* Inner Invitation Card Behind Gate */}
            <StackColAlignJustCenter
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: COLOR.bgPrimary,
                borderRadius: RADIUS.md,
                p: SPACING.px32,
                textAlign: "center",
                border: `2px solid ${COLOR.gold.main}`,
              }}
            >
              <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest" sx={{ mb: 1 }}>
                THIỆP CƯỚI HOÀNG KIM
              </TextElement>
              <HeadingElement variant="h3" fontFamilyType="serif" weight="bold" sx={{ my: 1 }}>
                {groomName} & {brideName}
              </HeadingElement>
              <TextElement size="xs" colorVariant="secondary">
                {formattedDate}
              </TextElement>
            </StackColAlignJustCenter>
          </Box>
        )}

        {/* ================= 3. VINTAGE ROYAL SCROLL 3D ================= */}
        {openingEffect === "scroll" && (
          <StackColAlignJustCenter
            onClick={handleOpen}
            sx={{
              width: "100%",
              maxWidth: 390,
              height: 360,
              backgroundColor: COLOR.bgSecondary,
              border: `3px solid ${COLOR.gold.main}`,
              borderRadius: RADIUS.md,
              p: SPACING.px32,
              cursor: isOpen ? "default" : "pointer",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              textAlign: "center",
              transition: "transform 0.8s ease",
              transform: isOpen ? "scale(1.05)" : "scale(1)",
            }}
          >
            <Box sx={{ fontSize: "2.5rem", mb: 1, animation: `${shimmerGold} 2s infinite` }}>📜</Box>
            <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest">
              LỄ THÀNH HÔN HOÀNG CUNG
            </TextElement>
            <HeadingElement variant="h3" fontFamilyType="serif" weight="bold" sx={{ my: 1 }}>
              {groomName} & {brideName}
            </HeadingElement>
            <TextElement size="sm" colorVariant="secondary" sx={{ fontStyle: "italic" }}>
              {formattedDate}
            </TextElement>
          </StackColAlignJustCenter>
        )}

        {/* ================= 4. LUXURY FADE OPENING ================= */}
        {openingEffect === "fade" && (
          <StackColAlignJustCenter
            onClick={handleOpen}
            sx={{
              width: "100%",
              maxWidth: 390,
              height: 320,
              backgroundColor: COLOR.bgSecondary,
              border: `2px solid ${COLOR.gold.main}`,
              borderRadius: RADIUS.md,
              p: SPACING.px32,
              cursor: isOpen ? "default" : "pointer",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              textAlign: "center",
              animation: `${floatCard} 4s ease-in-out infinite`,
            }}
          >
            <Box sx={{ fontSize: "2.5rem", mb: 1 }}>✨</Box>
            <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest">
              TRÂN TRỌNG KÍNH MỜI
            </TextElement>
            <HeadingElement variant="h3" fontFamilyType="serif" weight="bold" sx={{ my: 1 }}>
              {groomName} & {brideName}
            </HeadingElement>
            <TextElement size="xs" colorVariant="secondary">
              {formattedDate}
            </TextElement>
          </StackColAlignJustCenter>
        )}

        {/* Call to action prompt text */}
        <StackRowAlignJustCenter spacing={1} sx={{ color: COLOR.textGold, animation: !isOpen ? `${floatCard} 3s ease-in-out infinite` : "none" }}>
          <IconElement name="AutoAwesome" size="xs" color={COLOR.textGold} />
          <TextElement size="sm" weight="semibold" sx={{ color: COLOR.textInverse, opacity: 0.9 }}>
            Chạm để mở thiệp cưới
          </TextElement>
          <IconElement name="AutoAwesome" size="xs" color={COLOR.textGold} />
        </StackRowAlignJustCenter>
      </StackColAlignJustCenter>
    </StackCenter>
  );
};
