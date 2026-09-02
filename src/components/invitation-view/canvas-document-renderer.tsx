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

              // 5. Calendar Layer
              if (layer.type === "calendar") {
                const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
                const startOffset = layer.startDayOfWeek !== undefined ? layer.startDayOfWeek : 6;
                const totalDays = layer.daysCount || 30;
                const primary = layer.primaryColor || "#851C24";

                const gridCells: (number | null)[] = [];
                for (let i = 0; i < startOffset; i++) gridCells.push(null);
                for (let d = 1; d <= totalDays; d++) gridCells.push(d);

                return (
                  <Box
                    key={layer.id}
                    sx={{
                      position: "absolute",
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      width: `${layer.width || 300}px`,
                      backgroundColor: layer.backgroundColor || "#FFFFFF",
                      border: `1px solid ${layer.accentColor || "#EBDBC8"}`,
                      borderRadius: "18px",
                      boxShadow: "0 8px 24px -6px rgba(133, 28, 36, 0.08)",
                      p: "14px 18px",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      zIndex: layer.zIndex,
                      transform: transformStyle,
                      ...animStyles,
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: primary,
                        mb: "6px",
                        textAlign: "center",
                      }}
                    >
                      {layer.monthTitle || "Tháng 11 / 2026"}
                    </Box>
                    <Box sx={{ width: "100%", height: "1px", backgroundColor: "#EBDBC8", mb: "10px" }} />

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        width: "100%",
                        textAlign: "center",
                        mb: "6px",
                      }}
                    >
                      {daysOfWeek.map((dow, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            fontSize: "10.5px",
                            fontWeight: "600",
                            color: "#9E6B38",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {dow}
                        </Box>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        width: "100%",
                        rowGap: "5px",
                        textAlign: "center",
                      }}
                    >
                      {gridCells.map((day, idx) => {
                        if (day === null) {
                          return <Box key={idx} sx={{ height: 24 }} />;
                        }
                        const isEventDay = day === layer.selectedDay;
                        return (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 24,
                            }}
                          >
                            {isEventDay ? (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  backgroundColor: primary,
                                  color: "#FFFFFF",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "10.5px",
                                  fontWeight: "bold",
                                  boxShadow: `0 2px 6px ${primary}66`,
                                }}
                              >
                                {day}
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  fontSize: "11px",
                                  fontWeight: "500",
                                  color: "#4A3E31",
                                  fontFamily: "Inter, sans-serif",
                                }}
                              >
                                {day}
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                );
              }

              // 6. Timeline Layer
              if (layer.type === "timeline") {
                const primary = layer.primaryColor || "#851C24";
                const accent = layer.accentColor || "#D4AF37";

                return (
                  <Box
                    key={layer.id}
                    sx={{
                      position: "absolute",
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      width: `${layer.width || 340}px`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      zIndex: layer.zIndex,
                      transform: transformStyle,
                      boxSizing: "border-box",
                      ...animStyles,
                    }}
                  >
                    {layer.title && (
                      <Box
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: primary,
                          letterSpacing: "2px",
                          textAlign: "center",
                          mb: "14px",
                        }}
                      >
                        {layer.title}
                      </Box>
                    )}

                    <Box sx={{ width: "100%", position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: "64px",
                          top: "8px",
                          bottom: "8px",
                          width: "1.5px",
                          backgroundColor: accent,
                        }}
                      />

                      {layer.items?.map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: idx === layer.items.length - 1 ? 0 : "14px",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              width: "52px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: primary,
                              fontFamily: "Inter, sans-serif",
                              textAlign: "right",
                              pr: "10px",
                              lineHeight: "18px",
                            }}
                          >
                            {item.time}
                          </Box>

                          <Box
                            sx={{
                              width: 9,
                              height: 9,
                              borderRadius: "50%",
                              backgroundColor: primary,
                              border: "2px solid #FAF7F2",
                              boxShadow: `0 0 0 1px ${accent}`,
                              mt: "4px",
                              mr: "12px",
                              flexShrink: 0,
                              zIndex: 2,
                            }}
                          />

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#3B2F23",
                                fontFamily: "Inter, sans-serif",
                                lineHeight: "18px",
                              }}
                            >
                              {item.title}
                            </Box>
                            {item.subTitle && (
                              <Box
                                sx={{
                                  fontSize: "10.5px",
                                  color: "#7A6A58",
                                  fontFamily: "Inter, sans-serif",
                                  mt: "1px",
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.subTitle}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              }

              // 7. Countdown Layer
              if (layer.type === "countdown") {
                const primary = layer.primaryColor || "#851C24";

                return (
                  <Box
                    key={layer.id}
                    sx={{
                      position: "absolute",
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      width: `${layer.width || 300}px`,
                      backgroundColor: layer.backgroundColor || "#FFFFFF",
                      border: `1px solid #EBDBC8`,
                      borderRadius: "16px",
                      boxShadow: "0 8px 24px -6px rgba(133, 28, 36, 0.08)",
                      p: "12px 16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxSizing: "border-box",
                      zIndex: layer.zIndex,
                      transform: transformStyle,
                      ...animStyles,
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontSize: "13.5px",
                        fontWeight: "bold",
                        color: primary,
                        mb: "8px",
                        textAlign: "center",
                      }}
                    >
                      {layer.title || "Đếm ngược đến giờ sự kiện"}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "18px", width: "100%" }}>
                      {[
                        { val: layer.days !== undefined ? layer.days : 13, label: "Ngày" },
                        { val: layer.hours !== undefined ? layer.hours : 15, label: "Giờ" },
                        { val: layer.minutes !== undefined ? layer.minutes : 48, label: "Phút" },
                      ].map((unit, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            minWidth: 48,
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              color: primary,
                              fontFamily: "Inter, sans-serif",
                              lineHeight: 1,
                            }}
                          >
                            {String(unit.val).padStart(2, "0")}
                          </Box>
                          <Box
                            sx={{
                              fontSize: "10.5px",
                              fontWeight: "600",
                              color: "#851C24",
                              fontFamily: "Inter, sans-serif",
                              mt: "3px",
                            }}
                          >
                            {unit.label}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              }

              // 8. Event Info Layer
              if (layer.type === "event-info") {
                const primary = layer.primaryColor || "#851C24";
                const accent = layer.accentColor || "#E2D3BE";

                return (
                  <Box
                    key={layer.id}
                    sx={{
                      position: "absolute",
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      width: `${layer.width || 340}px`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      zIndex: layer.zIndex,
                      transform: transformStyle,
                      boxSizing: "border-box",
                      ...animStyles,
                    }}
                  >
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Box sx={{ fontSize: "10.5px", fontWeight: "bold", color: "#9E6B38", letterSpacing: 1.2, mb: "3px" }}>
                        📅 {layer.dateLabel || "NGÀY"}
                      </Box>
                      <Box sx={{ fontSize: "12.5px", fontWeight: "bold", color: primary, lineHeight: 1.35, whiteSpace: "pre-line" }}>
                        {layer.dateValue}
                      </Box>
                    </Box>

                    <Box sx={{ width: "1.5px", height: "42px", backgroundColor: accent, mx: "6px" }} />

                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Box sx={{ fontSize: "10.5px", fontWeight: "bold", color: "#9E6B38", letterSpacing: 1.2, mb: "3px" }}>
                        🕒 {layer.timeLabel || "GIỜ"}
                      </Box>
                      <Box sx={{ fontSize: "12.5px", fontWeight: "bold", color: primary, lineHeight: 1.35, whiteSpace: "pre-line" }}>
                        {layer.timeValue}
                      </Box>
                    </Box>
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

