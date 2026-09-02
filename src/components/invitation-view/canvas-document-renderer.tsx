"use client";

import React, { useState, useEffect } from "react";
import { Box, Tooltip, IconButton, keyframes } from "@mui/material";
import {
  ICanvasDocument,
  ICanvasLayer,
} from "@/interfaces/canvas-editor.interface";
import { COLOR, RADIUS, SHADOW, FONT_FAMILY } from "@/constants/style.constant";
import { IconElement } from "@/components/shared";

// Keyframes
const fadeInKeyframes = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUpKeyframes = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
`;

const zoomInKeyframes = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
`;

const pulseHeartKeyframes = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
`;

const shimmerKeyframes = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.4)); }
  50% { filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.9)); }
  100% { filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.4)); }
`;

interface ICanvasDocumentRendererProps {
  document: ICanvasDocument;
}

export const CanvasDocumentRenderer: React.FC<ICanvasDocumentRendererProps> = ({ document }) => {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const docWidth = document.width || 390;
  const docHeight = document.height || 1800;

  // Responsive scale handler for smaller viewports (e.g. 360px, 375px mobile screens)
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < docWidth) {
        setScale(screenWidth / docWidth);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [docWidth]);

  const handleCopyStk = (stk: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(stk);
      setCopiedBank(stk);
      setTimeout(() => setCopiedBank(null), 2500);
    }
  };

  const getAnimationStyles = (layer: ICanvasLayer) => {
    const delay = layer.animationDelay || 0;
    switch (layer.animation) {
      case "slide-up":
        return {
          animation: `${slideUpKeyframes} 0.8s cubic-bezier(0.16, 1, 0.3, 1) both`,
          animationDelay: `${delay}s`,
        };
      case "zoom-in":
        return {
          animation: `${zoomInKeyframes} 0.7s cubic-bezier(0.16, 1, 0.3, 1) both`,
          animationDelay: `${delay}s`,
        };
      case "bounce":
        return {
          animation: `${pulseHeartKeyframes} 2s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        };
      case "shimmer":
        return {
          animation: `${shimmerKeyframes} 2.5s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        };
      case "fade-in":
        return {
          animation: `${fadeInKeyframes} 0.8s ease both`,
          animationDelay: `${delay}s`,
        };
      default:
        return {};
    }
  };

  const getTransformStyle = (layer: ICanvasLayer) => {
    const transforms: string[] = [];
    if (layer.rotation) {
      transforms.push(`rotate(${layer.rotation}deg)`);
    }
    if (layer.scaleX !== undefined && layer.scaleX !== 1) {
      transforms.push(`scaleX(${layer.scaleX})`);
    }
    if (layer.scaleY !== undefined && layer.scaleY !== 1) {
      transforms.push(`scaleY(${layer.scaleY})`);
    }
    return transforms.length > 0 ? transforms.join(" ") : undefined;
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: COLOR.bgDark,
        py: { xs: 0, sm: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowX: "hidden",
      }}
    >
      {/* Outer Scaled Wrapper to maintain exact canvas proportions on any screen width */}
      <Box
        sx={{
          width: `${docWidth * scale}px`,
          height: `${docHeight * scale}px`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* Mobile Portrait Canvas Frame (390px Width Base) */}
        <Box
          sx={{
            width: `${docWidth}px`,
            height: `${docHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            backgroundColor: document.backgroundColor || COLOR.bgPrimary,
            position: "relative",
            boxShadow: { xs: "none", sm: SHADOW.xl },
            borderRadius: { xs: 0, sm: RADIUS.lg },
            overflow: "hidden",
          }}
        >
          {document.layers
            .filter((l) => !l.isHidden)
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
            .map((layer) => {
              const animStyles = getAnimationStyles(layer);
              const transformStyle = getTransformStyle(layer);

              // 1. Shape Layer (Outer border, inner border, divider line, card background)
              if (layer.type === "shape") {
                const isDivider =
                  layer.shapeType === "divider" ||
                  layer.id.includes("div") ||
                  (typeof layer.height === "number" && layer.height <= 3);

                if (isDivider) {
                  return (
                    <Box
                      key={layer.id}
                      sx={{
                        position: "absolute",
                        left: `${layer.x}px`,
                        top: `${layer.y}px`,
                        width: `${layer.width}px`,
                        height: `${layer.height || layer.strokeWidth || 1.5}px`,
                        backgroundColor: layer.stroke || layer.fill || COLOR.gold.main,
                        opacity: layer.opacity ?? 1,
                        zIndex: layer.zIndex,
                        pointerEvents: layer.isLocked ? "none" : "auto",
                        transform: transformStyle,
                        ...animStyles,
                      }}
                    />
                  );
                }

                if (layer.shapeType === "circle") {
                  const radius = (layer.width || 100) / 2;
                  return (
                    <Box
                      key={layer.id}
                      sx={{
                        position: "absolute",
                        left: `${layer.x - radius}px`,
                        top: `${layer.y - radius}px`,
                        width: `${layer.width}px`,
                        height: `${layer.height || layer.width}px`,
                        backgroundColor: layer.fill || "transparent",
                        border: layer.stroke ? `${layer.strokeWidth || 1}px solid ${layer.stroke}` : "none",
                        borderRadius: RADIUS.full,
                        opacity: layer.opacity ?? 1,
                        zIndex: layer.zIndex,
                        pointerEvents: layer.isLocked ? "none" : "auto",
                        transform: transformStyle,
                        ...animStyles,
                      }}
                    />
                  );
                }

                return (
                  <Box
                    key={layer.id}
                    sx={{
                      position: "absolute",
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      width: `${layer.width}px`,
                      height: `${layer.height}px`,
                      backgroundColor: layer.fill || "transparent",
                      border: layer.stroke ? `${layer.strokeWidth || 1}px solid ${layer.stroke}` : "none",
                      borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : "0px",
                      opacity: layer.opacity ?? 1,
                      zIndex: layer.zIndex,
                      pointerEvents: layer.isLocked ? "none" : "auto",
                      transform: transformStyle,
                      ...animStyles,
                    }}
                  />
                );
              }

              // 2. Image Layer (Photo arch, Couple portrait, Gallery photos, QR codes)
              if (layer.type === "image") {
                return (
                  <Box
                    key={layer.id}
                    component="img"
                    src={layer.src}
                    alt={layer.name || "Wedding Image"}
                    sx={{
                      position: "absolute",
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      width: `${layer.width}px`,
                      height: `${layer.height}px`,
                      borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : "0px",
                      objectFit: "cover",
                      opacity: layer.opacity ?? 1,
                      zIndex: layer.zIndex,
                      boxShadow: SHADOW.sm,
                      transform: transformStyle,
                      ...animStyles,
                    }}
                  />
                );
              }

              // 3. Sticker Layer (Emojis, Floral garlands, rings, badges, crests)
              if (layer.type === "sticker") {
                return (
                  <Box
                    key={layer.id}
                    sx={{
                      position: "absolute",
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      width: layer.width ? `${layer.width}px` : "auto",
                      fontSize: `${layer.fontSize || 32}px`,
                      lineHeight: 1.2,
                      textAlign: "center",
                      opacity: layer.opacity ?? 1,
                      zIndex: layer.zIndex,
                      userSelect: "none",
                      display: "block",
                      transform: transformStyle,
                      ...animStyles,
                    }}
                  >
                    {layer.content}
                  </Box>
                );
              }

              // 4. Text Layer (Typography, couple names, date, quotes, schedule, RSVP text)
              if (layer.type === "text") {
                const isStkText = layer.text.includes("1018899999") || layer.text.includes("190338888888");

                return (
                  <Box
                    key={layer.id}
                    sx={{
                      position: "absolute",
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      width: layer.width ? `${layer.width}px` : "auto",
                      fontFamily: layer.fontFamily || FONT_FAMILY.sans,
                      fontSize: `${layer.fontSize}px`,
                      fontWeight: layer.fontWeight || "normal",
                      fontStyle: layer.fontStyle || "normal",
                      color: layer.fill || COLOR.textPrimary,
                      textAlign: layer.textAlign || "center",
                      lineHeight: layer.lineHeight || 1.4,
                      letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : "normal",
                      whiteSpace: "pre-line", // Preserves \n newlines exactly like Konva Canvas
                      wordBreak: "break-word",
                      opacity: layer.opacity ?? 1,
                      zIndex: layer.zIndex,
                      transform: transformStyle,
                      ...animStyles,
                    }}
                  >
                    {layer.text}

                    {/* Interactive STK Copy Button for VietQR layers */}
                    {isStkText && (
                      <Tooltip title={copiedBank === layer.text ? "Đã sao chép!" : "Sao chép số tài khoản"}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopyStk(layer.text.replace(/[^0-9]/g, ""))}
                          sx={{
                            ml: 0.5,
                            p: 0.25,
                            color: COLOR.gold.main,
                            "&:hover": { backgroundColor: "rgba(183,134,40,0.1)" },
                          }}
                        >
                          <IconElement name={copiedBank === layer.text ? "Check" : "ContentCopy"} size="xs" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                );
              }

              return null;
            })}
        </Box>
      </Box>
    </Box>
  );
};

