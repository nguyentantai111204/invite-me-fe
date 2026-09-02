"use client";

import React, { forwardRef } from "react";
import { Box } from "@mui/material";
import {
  ICanvasLayer,
  ICanvasTextLayer,
  ICanvasImageLayer,
  ICanvasStickerLayer,
  ICanvasShapeLayer,
  ICanvasCalendarLayer,
  ICanvasTimelineLayer,
  ICanvasTimelineItem,
  ICanvasCountdownLayer,
  ICanvasEventInfoLayer,
} from "@/interfaces/canvas-editor.interface";
import { COLOR, RADIUS, SHADOW, FONT_FAMILY } from "@/constants/style.constant";

export interface CanvasLayerItemProps {
  layer: ICanvasLayer;
  isSelected?: boolean;
  isEditing?: boolean;
  isEditorMode?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  customStyle?: React.CSSProperties;
}

export const CanvasLayerItem = forwardRef<HTMLDivElement, CanvasLayerItemProps>(
  (
    {
      layer,
      isSelected = false,
      isEditing = false,
      isEditorMode = false,
      onClick,
      onDoubleClick,
      customStyle,
    },
    ref
  ) => {
    if (layer.isHidden && (!isEditorMode || !isSelected)) return null;

    const transformStyles = [
      layer.rotation ? `rotate(${layer.rotation}deg)` : "",
      layer.scaleX !== undefined && layer.scaleX !== 1 ? `scaleX(${layer.scaleX})` : "",
      layer.scaleY !== undefined && layer.scaleY !== 1 ? `scaleY(${layer.scaleY})` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const baseWrapperStyle: React.CSSProperties = {
      position: "absolute",
      left: `${layer.x}px`,
      top: `${layer.y}px`,
      width: layer.width !== undefined ? `${layer.width}px` : "auto",
      height: layer.height !== undefined ? `${layer.height}px` : "auto",
      opacity: (layer.opacity ?? 1) * (layer.isHidden ? 0.55 : 1),
      zIndex: layer.zIndex || 1,
      transform: transformStyles || undefined,
      cursor: isEditorMode ? (layer.isLocked ? "pointer" : "move") : "default",
      userSelect: "none",
      pointerEvents: "auto",
      boxSizing: "border-box",
      outline: isEditorMode && isSelected && (layer.isLocked || layer.isHidden)
        ? `1.5px ${layer.isHidden ? "dashed" : "solid"} ${COLOR.gold.main}`
        : undefined,
      ...customStyle,
    };

    // 1. Text Layer
    if (layer.type === "text") {
      const txt = layer as ICanvasTextLayer;
      return (
        <Box
          ref={ref}
          id={`canvas-layer-${layer.id}`}
          data-layer-id={layer.id}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={baseWrapperStyle}
          sx={{
            fontFamily: txt.fontFamily || FONT_FAMILY.sans,
            fontSize: `${txt.fontSize}px`,
            fontWeight: txt.fontWeight || "normal",
            fontStyle: txt.fontStyle || "normal",
            color: txt.fill || COLOR.textPrimary,
            textAlign: txt.textAlign || "center",
            lineHeight: txt.lineHeight || 1.4,
            letterSpacing: txt.letterSpacing ? `${txt.letterSpacing}px` : "normal",
            whiteSpace: "pre-line",
            wordBreak: "break-word",
            visibility: isEditing ? "hidden" : "visible",
            outline: isEditorMode && isSelected ? `1.5px dashed ${COLOR.gold.main}` : "none",
            outlineOffset: "2px",
          }}
        >
          {txt.text}
        </Box>
      );
    }

    // 2. Image Layer
    if (layer.type === "image") {
      const img = layer as ICanvasImageLayer;
      return (
        <Box
          ref={ref}
          id={`canvas-layer-${layer.id}`}
          data-layer-id={layer.id}
          component="img"
          src={img.src}
          alt={img.name || "Wedding Canvas Image"}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={baseWrapperStyle}
          sx={{
            borderRadius: img.borderRadius ? `${img.borderRadius}px` : "0px",
            objectFit: "cover",
            boxShadow: SHADOW.sm,
            outline: isEditorMode && isSelected ? `2px solid ${COLOR.gold.main}` : "none",
            outlineOffset: "2px",
          }}
        />
      );
    }

    // 3. Sticker Layer
    if (layer.type === "sticker") {
      const stk = layer as ICanvasStickerLayer;
      return (
        <Box
          ref={ref}
          id={`canvas-layer-${layer.id}`}
          data-layer-id={layer.id}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={baseWrapperStyle}
          sx={{
            fontSize: `${stk.fontSize || 32}px`,
            lineHeight: 1.2,
            textAlign: "center",
            display: "block",
            outline: isEditorMode && isSelected ? `1.5px dashed ${COLOR.gold.main}` : "none",
            outlineOffset: "2px",
          }}
        >
          {stk.content}
        </Box>
      );
    }

    // 4. Shape Layer
    if (layer.type === "shape") {
      const shp = layer as ICanvasShapeLayer;
      const isDivider =
        shp.shapeType === "divider" ||
        shp.id.includes("div") ||
        (typeof shp.height === "number" && shp.height <= 3);

      if (isDivider) {
        return (
          <Box
            ref={ref}
            id={`canvas-layer-${layer.id}`}
            data-layer-id={layer.id}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            style={baseWrapperStyle}
            sx={{
              height: `${shp.height || shp.strokeWidth || 1.5}px`,
              backgroundColor: shp.stroke || shp.fill || COLOR.gold.main,
              outline: isEditorMode && isSelected ? `1.5px dashed ${COLOR.gold.main}` : "none",
              outlineOffset: "2px",
            }}
          />
        );
      }

      if (shp.shapeType === "circle") {
        return (
          <Box
            ref={ref}
            id={`canvas-layer-${layer.id}`}
            data-layer-id={layer.id}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            style={baseWrapperStyle}
            sx={{
              backgroundColor: shp.fill || "transparent",
              border: shp.stroke ? `${shp.strokeWidth || 1}px solid ${shp.stroke}` : "none",
              borderRadius: RADIUS.full,
              outline: isEditorMode && isSelected ? `1.5px dashed ${COLOR.gold.main}` : "none",
              outlineOffset: "2px",
            }}
          />
        );
      }

      return (
        <Box
          ref={ref}
          id={`canvas-layer-${layer.id}`}
          data-layer-id={layer.id}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={baseWrapperStyle}
          sx={{
            backgroundColor: shp.fill || "transparent",
            border: shp.stroke ? `${shp.strokeWidth || 1}px solid ${shp.stroke}` : "none",
            borderRadius: shp.borderRadius ? `${shp.borderRadius}px` : "0px",
            outline: isEditorMode && isSelected ? `1.5px dashed ${COLOR.gold.main}` : "none",
            outlineOffset: "2px",
          }}
        />
      );
    }

    // 5. Calendar Layer
    if (layer.type === "calendar") {
      const cal = layer as ICanvasCalendarLayer;
      const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
      const startOffset = cal.startDayOfWeek !== undefined ? cal.startDayOfWeek : 6;
      const totalDays = cal.daysCount || 30;
      const primary = cal.primaryColor || "#851C24";

      const gridCells: (number | null)[] = [];
      for (let i = 0; i < startOffset; i++) gridCells.push(null);
      for (let d = 1; d <= totalDays; d++) gridCells.push(d);

      return (
        <Box
          ref={ref}
          id={`canvas-layer-${layer.id}`}
          data-layer-id={layer.id}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={baseWrapperStyle}
          sx={{
            backgroundColor: cal.backgroundColor || "#FFFFFF",
            border: `1px solid ${cal.accentColor || "#EBDBC8"}`,
            borderRadius: "18px",
            boxShadow: "0 8px 24px -6px rgba(133, 28, 36, 0.08)",
            p: "14px 18px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            outline: isEditorMode && isSelected ? `2px solid ${COLOR.gold.main}` : "none",
            outlineOffset: "2px",
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
            {cal.monthTitle || "Tháng 11 / 2026"}
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
              const isEventDay = day === cal.selectedDay;
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
      const tm = layer as ICanvasTimelineLayer;
      const primary = tm.primaryColor || "#851C24";
      const accent = tm.accentColor || "#D4AF37";

      return (
        <Box
          ref={ref}
          id={`canvas-layer-${layer.id}`}
          data-layer-id={layer.id}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={baseWrapperStyle}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            outline: isEditorMode && isSelected ? `2px solid ${COLOR.gold.main}` : "none",
            outlineOffset: "2px",
            boxSizing: "border-box",
          }}
        >
          {tm.title && (
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
              {tm.title}
            </Box>
          )}

          <Box sx={{ width: "100%", position: "relative" }}>
            {/* Continuous Line */}
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

            {tm.items?.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: idx === tm.items.length - 1 ? 0 : "14px",
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
      const cd = layer as ICanvasCountdownLayer;
      const primary = cd.primaryColor || "#851C24";

      return (
        <Box
          ref={ref}
          id={`canvas-layer-${layer.id}`}
          data-layer-id={layer.id}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={baseWrapperStyle}
          sx={{
            backgroundColor: cd.backgroundColor || "#FFFFFF",
            border: `1px solid #EBDBC8`,
            borderRadius: "16px",
            boxShadow: "0 8px 24px -6px rgba(133, 28, 36, 0.08)",
            p: "12px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
            outline: isEditorMode && isSelected ? `2px solid ${COLOR.gold.main}` : "none",
            outlineOffset: "2px",
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
            {cd.title || "Đếm ngược đến giờ sự kiện"}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "18px", width: "100%" }}>
            {[
              { val: cd.days !== undefined ? cd.days : 13, label: "Ngày" },
              { val: cd.hours !== undefined ? cd.hours : 15, label: "Giờ" },
              { val: cd.minutes !== undefined ? cd.minutes : 48, label: "Phút" },
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
      const ei = layer as ICanvasEventInfoLayer;
      const primary = ei.primaryColor || "#851C24";
      const accent = ei.accentColor || "#E2D3BE";

      return (
        <Box
          ref={ref}
          id={`canvas-layer-${layer.id}`}
          data-layer-id={layer.id}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={baseWrapperStyle}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            outline: isEditorMode && isSelected ? `2px solid ${COLOR.gold.main}` : "none",
            outlineOffset: "2px",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Box sx={{ fontSize: "10.5px", fontWeight: "bold", color: "#9E6B38", letterSpacing: 1.2, mb: "3px" }}>
              📅 {ei.dateLabel || "NGÀY"}
            </Box>
            <Box sx={{ fontSize: "12.5px", fontWeight: "bold", color: primary, lineHeight: 1.35, whiteSpace: "pre-line" }}>
              {ei.dateValue}
            </Box>
          </Box>

          <Box sx={{ width: "1.5px", height: "42px", backgroundColor: accent, mx: "6px" }} />

          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Box sx={{ fontSize: "10.5px", fontWeight: "bold", color: "#9E6B38", letterSpacing: 1.2, mb: "3px" }}>
              🕒 {ei.timeLabel || "GIỜ"}
            </Box>
            <Box sx={{ fontSize: "12.5px", fontWeight: "bold", color: primary, lineHeight: 1.35, whiteSpace: "pre-line" }}>
              {ei.timeValue}
            </Box>
          </Box>
        </Box>
      );
    }

    return null;
  }
);

CanvasLayerItem.displayName = "CanvasLayerItem";
