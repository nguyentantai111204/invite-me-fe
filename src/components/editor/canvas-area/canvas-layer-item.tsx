"use client";

import React, { forwardRef } from "react";
import { Box } from "@mui/material";
import {
  ICanvasLayer,
  ICanvasTextLayer,
  ICanvasImageLayer,
  ICanvasStickerLayer,
  ICanvasShapeLayer,
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

    return null;
  }
);

CanvasLayerItem.displayName = "CanvasLayerItem";
