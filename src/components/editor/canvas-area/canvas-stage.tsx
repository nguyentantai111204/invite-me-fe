"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Paper, IconButton, Tooltip } from "@mui/material";
import Moveable, { OnDrag, OnResize, OnRotate } from "react-moveable";
import {
  ICanvasDocument,
  ICanvasLayer,
  ICanvasTextLayer,
} from "@/interfaces/canvas-editor.interface";
import { COLOR, RADIUS, SHADOW, SPACING } from "@/constants/style.constant";
import { IconElement, StackRowAlignJustCenter } from "@/components/shared";
import { CanvasLayerItem } from "./canvas-layer-item";

interface ICanvasStageProps {
  document: ICanvasDocument;
  selectedId: string | null;
  scale?: number;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<ICanvasLayer>) => void;
  onDuplicateLayer?: (id: string) => void;
  onDeleteLayer?: (id: string) => void;
}

export const CanvasStage: React.FC<ICanvasStageProps> = ({
  document,
  selectedId,
  scale = 1,
  onSelectLayer,
  onUpdateLayer,
  onDuplicateLayer,
  onDeleteLayer,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<HTMLElement | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextVal, setEditingTextVal] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update Moveable Target when selectedId changes
  useEffect(() => {
    if (!isClient) return;
    if (selectedId) {
      const el = containerRef.current?.querySelector<HTMLElement>(`[data-layer-id="${selectedId}"]`);
      setSelectedTarget(el || null);
    } else {
      setSelectedTarget(null);
    }
  }, [selectedId, isClient, document.layers]);

  // Keyboard shortcut listener (Delete / Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTextId) return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && onDeleteLayer) {
        // Prevent deleting if focus is inside an input/textarea
        if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
        onDeleteLayer(selectedId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, onDeleteLayer, editingTextId]);

  // Handle Double Click to edit Text in-place
  const handleTextDblClick = (layer: ICanvasTextLayer) => {
    if (layer.isLocked) return;
    setEditingTextId(layer.id);
    setEditingTextVal(layer.text);
  };

  const handleFinishTextEdit = () => {
    if (editingTextId) {
      onUpdateLayer(editingTextId, { text: editingTextVal });
      setEditingTextId(null);
    }
  };

  // Drag handlers for Moveable
  const handleDrag = useCallback(({ target, left, top }: OnDrag) => {
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
  }, []);

  const handleDragEnd = useCallback(
    ({ target, isDrag }: { target: HTMLElement | SVGElement; isDrag: boolean }) => {
      if (isDrag && selectedId) {
        const x = parseFloat(target.style.left) || 0;
        const y = parseFloat(target.style.top) || 0;
        onUpdateLayer(selectedId, { x: Math.round(x), y: Math.round(y) });
      }
    },
    [onUpdateLayer, selectedId]
  );

  // Resize handlers for Moveable
  const handleResize = useCallback(({ target, width, height, drag }: OnResize) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    target.style.left = `${drag.left}px`;
    target.style.top = `${drag.top}px`;
  }, []);

  const handleResizeEnd = useCallback(
    ({ target, isDrag }: { target: HTMLElement | SVGElement; isDrag: boolean }) => {
      if (isDrag && selectedId) {
        const width = parseFloat(target.style.width) || 0;
        const height = parseFloat(target.style.height) || 0;
        const x = parseFloat(target.style.left) || 0;
        const y = parseFloat(target.style.top) || 0;
        onUpdateLayer(selectedId, {
          width: Math.round(width),
          height: Math.round(height),
          x: Math.round(x),
          y: Math.round(y),
        });
      }
    },
    [onUpdateLayer, selectedId]
  );

  // Rotate handlers for Moveable
  const handleRotate = useCallback(({ target, transform }: OnRotate) => {
    target.style.transform = transform;
  }, []);

  const handleRotateEnd = useCallback(
    ({ isDrag, lastEvent }: any) => {
      if (isDrag && selectedId && lastEvent) {
        onUpdateLayer(selectedId, { rotation: Math.round(lastEvent.rotation || 0) });
      }
    },
    [onUpdateLayer, selectedId]
  );

  const layersList = [...(document.layers || [])].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  const selectedLayer = layersList.find((l) => l.id === selectedId);
  const editingLayer = layersList.find((l) => l.id === editingTextId) as ICanvasTextLayer | undefined;

  // Guidelines for smart snapping (center, edges, and other layer bounds)
  const elementGuidelines = React.useMemo(() => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>("[data-layer-id]")).filter(
      (el) => el.getAttribute("data-layer-id") !== selectedId
    );
  }, [selectedId]);

  const docWidth = document.width || 390;
  const docHeight = document.height || 1800;

  if (!isClient) {
    return (
      <Box
        sx={{
          width: docWidth,
          height: docHeight,
          backgroundColor: document.backgroundColor || COLOR.bgPrimary,
          borderRadius: RADIUS.lg,
          boxShadow: SHADOW.xl,
        }}
      />
    );
  }

  return (
    <Box
      data-tour="canvas-stage"
      sx={{
        position: "relative",
        width: `${docWidth * scale}px`,
        height: `${docHeight * scale}px`,
        display: "flex",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* Floating Context Toolbar */}
      {selectedLayer && !editingTextId && (() => {
        const layerTop = selectedLayer.y * scale;
        const layerHeight = ((selectedLayer as any).height || (selectedLayer as any).fontSize || 35) * scale;
        const layerCenterX = (selectedLayer.x + (selectedLayer.width || 200) / 2) * scale;
        const toolbarTop = layerTop > 55 ? layerTop - 46 : layerTop + layerHeight + 12;
        const toolbarLeft = Math.max(120, Math.min(docWidth * scale - 120, layerCenterX));

        return (
          <Paper
            elevation={6}
            sx={{
              position: "absolute",
              top: `${toolbarTop}px`,
              left: `${toolbarLeft}px`,
              transform: "translateX(-50%)",
              zIndex: 1200,
              borderRadius: RADIUS.full,
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${COLOR.borderGoldLight}`,
              boxShadow: SHADOW.md,
              display: "flex",
              alignItems: "center",
              p: SPACING.px4,
              px: SPACING.px12,
              gap: SPACING.px4,
              whiteSpace: "nowrap",
            }}
          >
            {selectedLayer.type === "text" && (
              <StackRowAlignJustCenter spacing={SPACING.px2}>
                <Tooltip title="In Đậm (Bold)">
                  <IconButton
                    size="small"
                    onClick={() =>
                      onUpdateLayer(selectedLayer.id, {
                        fontWeight:
                          (selectedLayer as ICanvasTextLayer).fontWeight === "bold" ? "normal" : "bold",
                      })
                    }
                    sx={{
                      color:
                        (selectedLayer as ICanvasTextLayer).fontWeight === "bold"
                          ? COLOR.gold.main
                          : "inherit",
                    }}
                  >
                    <IconElement name="FormatBold" size="xs" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="In Nghiêng (Italic)">
                  <IconButton
                    size="small"
                    onClick={() =>
                      onUpdateLayer(selectedLayer.id, {
                        fontStyle:
                          (selectedLayer as ICanvasTextLayer).fontStyle === "italic" ? "normal" : "italic",
                      })
                    }
                    sx={{
                      color:
                        (selectedLayer as ICanvasTextLayer).fontStyle === "italic"
                          ? COLOR.gold.main
                          : "inherit",
                    }}
                  >
                    <IconElement name="FormatItalic" size="xs" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Căn Lề">
                  <IconButton
                    size="small"
                    onClick={() => {
                      const currentAlign = (selectedLayer as ICanvasTextLayer).textAlign || "center";
                      const nextAlign =
                        currentAlign === "center" ? "left" : currentAlign === "left" ? "right" : "center";
                      onUpdateLayer(selectedLayer.id, { textAlign: nextAlign });
                    }}
                  >
                    <IconElement name="FormatAlignCenter" size="xs" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Đổi Màu Hoàng Kim">
                  <IconButton
                    size="small"
                    onClick={() => {
                      const colors = ["#B78628", "#221A12", "#8B1E2B", "#DE7C66"];
                      const current = (selectedLayer as ICanvasTextLayer).fill || "#B78628";
                      const nextColor = colors[(colors.indexOf(current) + 1) % colors.length];
                      onUpdateLayer(selectedLayer.id, { fill: nextColor });
                    }}
                  >
                    <IconElement name="Palette" size="xs" color={COLOR.textGold} />
                  </IconButton>
                </Tooltip>
              </StackRowAlignJustCenter>
            )}

            {onDuplicateLayer && (
              <Tooltip title="Nhân Bản (Duplicate)">
                <IconButton size="small" onClick={() => onDuplicateLayer(selectedLayer.id)}>
                  <IconElement name="ContentCopy" size="xs" />
                </IconButton>
              </Tooltip>
            )}

            {onDeleteLayer && (
              <Tooltip title="Xóa">
                <IconButton size="small" color="error" onClick={() => onDeleteLayer(selectedLayer.id)}>
                  <IconElement name="Delete" size="xs" />
                </IconButton>
              </Tooltip>
            )}
          </Paper>
        );
      })()}

      {/* Main HTML DOM Canvas Stage */}
      <Box
        ref={containerRef}
        onClick={(e) => {
          if (e.target === containerRef.current) {
            onSelectLayer(null);
            handleFinishTextEdit();
          }
        }}
        sx={{
          width: `${docWidth}px`,
          height: `${docHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          backgroundColor: document.backgroundColor || COLOR.bgPrimary,
          borderRadius: "20px",
          boxShadow: "0 20px 48px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Render all Layers as pure DOM elements */}
        {layersList.map((layer) => (
          <CanvasLayerItem
            key={layer.id}
            layer={layer}
            isSelected={selectedId === layer.id}
            isEditing={editingTextId === layer.id}
            isEditorMode={true}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLayer(layer.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (layer.type === "text") {
                handleTextDblClick(layer as ICanvasTextLayer);
              }
            }}
          />
        ))}

        {/* Moveable Controller for Selected Layer */}
        {selectedTarget && selectedLayer && !selectedLayer.isLocked && (
          <Moveable
            ref={moveableRef}
            target={selectedTarget}
            container={containerRef.current}
            origin={false}
            zoom={1}
            draggable={true}
            resizable={true}
            rotatable={true}
            snappable={true}
            verticalGuidelines={[docWidth / 2]}
            horizontalGuidelines={[docHeight / 2]}
            snapDirections={{ top: true, left: true, bottom: true, right: true, center: true, middle: true }}
            elementSnapDirections={{
              top: true,
              left: true,
              bottom: true,
              right: true,
              center: true,
              middle: true,
            }}
            elementGuidelines={elementGuidelines}
            snapThreshold={5}
            throttleDrag={0}
            throttleResize={0}
            throttleRotate={0}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
            onRotate={handleRotate}
            onRotateEnd={handleRotateEnd}
          />
        )}
      </Box>

      {/* In-place Inline Text Editing Overlay */}
      {editingLayer && (
        <textarea
          autoFocus
          value={editingTextVal}
          onChange={(e) => setEditingTextVal(e.target.value)}
          onBlur={handleFinishTextEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleFinishTextEdit();
            }
          }}
          style={{
            position: "absolute",
            top: `${editingLayer.y * scale}px`,
            left: `${editingLayer.x * scale}px`,
            width: `${(editingLayer.width || 200) * scale}px`,
            fontSize: `${editingLayer.fontSize * scale}px`,
            fontFamily: editingLayer.fontFamily || "'Playfair Display', serif",
            fontWeight: editingLayer.fontWeight || "normal",
            fontStyle: editingLayer.fontStyle || "normal",
            color: editingLayer.fill || "#2A231C",
            textAlign: editingLayer.textAlign || "center",
            background: "rgba(255, 255, 255, 0.98)",
            border: `1.5px dashed ${COLOR.gold.main}`,
            borderRadius: "4px",
            outline: "none",
            resize: "none",
            zIndex: 1500,
            padding: "2px 4px",
            lineHeight: 1.4,
            whiteSpace: "pre-line",
            boxSizing: "border-box",
          }}
        />
      )}
    </Box>
  );
};
