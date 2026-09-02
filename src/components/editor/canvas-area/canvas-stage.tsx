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
import { IconElement, StackRowAlignJustCenter, TextElement, ButtonElement } from "@/components/shared";
import { CanvasLayerItem } from "./canvas-layer-item";

interface ICanvasStageProps {
  document: ICanvasDocument;
  selectedId: string | null;
  selectedIds?: string[];
  scale?: number;
  onSelectLayer: (id: string | null, isMulti?: boolean) => void;
  onUpdateLayer: (id: string, updates: Partial<ICanvasLayer>) => void;
  onMoveMultipleLayers?: (positions: { id: string; x: number; y: number }[]) => void;
  onGroupLayers?: (ids?: string[]) => void;
  onUngroupLayers?: (ids?: string[]) => void;
  onDuplicateLayer?: (id: string) => void;
  onDeleteLayer?: (id: string) => void;
}

export const CanvasStage: React.FC<ICanvasStageProps> = ({
  document,
  selectedId,
  selectedIds,
  scale = 1,
  onSelectLayer,
  onUpdateLayer,
  onMoveMultipleLayers,
  onGroupLayers,
  onUngroupLayers,
  onDuplicateLayer,
  onDeleteLayer,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<HTMLElement | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextVal, setEditingTextVal] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);
  const dragStartPositionsRef = useRef<{ id: string; x: number; y: number }[]>([]);

  const effectiveSelectedIds = React.useMemo(
    () => (selectedIds && selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : []),
    [selectedIds, selectedId]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update Moveable Target when selectedId or layers change, and force bounding box sync
  useEffect(() => {
    if (!isClient) return;
    if (selectedId) {
      const el = containerRef.current?.querySelector<HTMLElement>(`[data-layer-id="${selectedId}"]`);
      setSelectedTarget(el || null);
    } else {
      setSelectedTarget(null);
    }

    const timer = setTimeout(() => {
      moveableRef.current?.updateRect();
    }, 10);
    return () => clearTimeout(timer);
  }, [selectedId, isClient, document.layers, scale]);

  // Keyboard shortcut listener (Delete / Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTextId) return;
      if ((e.key === "Delete" || e.key === "Backspace") && onDeleteLayer && effectiveSelectedIds.length > 0) {
        if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
        effectiveSelectedIds.forEach((id) => onDeleteLayer(id));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [effectiveSelectedIds, onDeleteLayer, editingTextId]);

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

  const layersList = [...(document.layers || [])].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  const selectedLayers = layersList.filter((l) => effectiveSelectedIds.includes(l.id));
  const selectedLayer = layersList.find((l) => l.id === selectedId);
  const editingLayer = layersList.find((l) => l.id === editingTextId) as ICanvasTextLayer | undefined;
  const isGroupedSelection = selectedLayers.some((l) => !!l.groupId);

  // Drag handlers for Moveable
  const handleDragStart = useCallback(() => {
    dragStartPositionsRef.current = layersList
      .filter((l) => effectiveSelectedIds.includes(l.id))
      .map((l) => ({ id: l.id, x: l.x, y: l.y }));
  }, [effectiveSelectedIds, layersList]);

  const handleDrag = useCallback(
    ({ target, left, top, beforeTranslate }: OnDrag) => {
      if (effectiveSelectedIds.length > 1) {
        const [deltaX, deltaY] = beforeTranslate;
        dragStartPositionsRef.current.forEach((pos) => {
          const el = containerRef.current?.querySelector<HTMLElement>(`[data-layer-id="${pos.id}"]`);
          if (el) {
            el.style.transform = `translate3d(${Math.round(deltaX)}px, ${Math.round(deltaY)}px, 0px)`;
          }
        });
      } else {
        target.style.left = `${Math.round(left)}px`;
        target.style.top = `${Math.round(top)}px`;
      }
    },
    [effectiveSelectedIds]
  );

  const handleDragEnd = useCallback(
    ({ target, isDrag, lastEvent }: any) => {
      if (!isDrag) return;

      if (effectiveSelectedIds.length > 1 && onMoveMultipleLayers) {
        const deltaX = Math.round(lastEvent?.beforeTranslate?.[0] || 0);
        const deltaY = Math.round(lastEvent?.beforeTranslate?.[1] || 0);

        dragStartPositionsRef.current.forEach((pos) => {
          const el = containerRef.current?.querySelector<HTMLElement>(`[data-layer-id="${pos.id}"]`);
          if (el) el.style.transform = "";
        });

        const newPositions = dragStartPositionsRef.current.map((pos) => ({
          id: pos.id,
          x: pos.x + deltaX,
          y: pos.y + deltaY,
        }));
        onMoveMultipleLayers(newPositions);
      } else if (selectedId) {
        const x = Math.round(parseFloat(target.style.left) || 0);
        const y = Math.round(parseFloat(target.style.top) || 0);
        target.style.left = "";
        target.style.top = "";
        onUpdateLayer(selectedId, { x, y });
      }
    },
    [effectiveSelectedIds, onMoveMultipleLayers, onUpdateLayer, selectedId]
  );

  // Resize handlers for Moveable
  const handleResizeStart = useCallback(({ setOrigin }: any) => {
    setOrigin(["%", "%"]);
  }, []);

  const handleResize = useCallback(({ target, width, height, drag }: OnResize) => {
    target.style.width = `${Math.round(width)}px`;
    target.style.height = `${Math.round(height)}px`;
    target.style.transform = drag.transform;
  }, []);

  const handleResizeEnd = useCallback(
    ({ target, isDrag, lastEvent }: any) => {
      if (isDrag && selectedId && lastEvent && selectedLayer) {
        const newWidth = Math.round(lastEvent.width);
        const newHeight = Math.round(lastEvent.height);
        const deltaX = Math.round(lastEvent.drag?.beforeTranslate?.[0] || 0);
        const deltaY = Math.round(lastEvent.drag?.beforeTranslate?.[1] || 0);

        target.style.transform = "";
        target.style.width = "";
        target.style.height = "";

        onUpdateLayer(selectedId, {
          width: newWidth,
          height: newHeight,
          x: selectedLayer.x + deltaX,
          y: selectedLayer.y + deltaY,
        });
      }
    },
    [onUpdateLayer, selectedId, selectedLayer]
  );

  // Rotate handlers for Moveable
  const handleRotate = useCallback(({ target, transform }: OnRotate) => {
    target.style.transform = transform;
  }, []);

  const handleRotateEnd = useCallback(
    ({ target, isDrag, lastEvent }: any) => {
      if (isDrag && selectedId && lastEvent) {
        target.style.transform = "";
        onUpdateLayer(selectedId, {
          rotation: Math.round(lastEvent.rotation || 0),
        });
      }
    },
    [onUpdateLayer, selectedId]
  );

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
      {/* Floating Context Toolbar: Single Selected Layer */}
      {effectiveSelectedIds.length === 1 && selectedLayer && !editingTextId && (() => {
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

      {/* Floating Context Toolbar: Multi-Selected / Grouped Layers */}
      {effectiveSelectedIds.length > 1 && (() => {
        const minTop = Math.min(...selectedLayers.map((l) => l.y)) * scale;
        const avgX =
          (selectedLayers.reduce((acc, l) => acc + l.x + (l.width || 200) / 2, 0) / selectedLayers.length) * scale;
        const toolbarTop = minTop > 55 ? minTop - 46 : minTop + 80;
        const toolbarLeft = Math.max(140, Math.min(docWidth * scale - 140, avgX));

        return (
          <Paper
            elevation={6}
            sx={{
              position: "absolute",
              top: `${toolbarTop}px`,
              left: `${toolbarLeft}px`,
              transform: "translateX(-50%)",
              zIndex: 1250,
              borderRadius: RADIUS.full,
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(8px)",
              border: `1.5px solid ${COLOR.gold.main}`,
              boxShadow: SHADOW.md,
              display: "flex",
              alignItems: "center",
              p: SPACING.px4,
              px: SPACING.px12,
              gap: SPACING.px8,
              whiteSpace: "nowrap",
            }}
          >
            <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ fontSize: "0.72rem" }}>
              Đã chọn {effectiveSelectedIds.length} phần tử
            </TextElement>

            {onGroupLayers && (
              <Tooltip title="Nhóm lại để di chuyển cùng nhau (Ctrl+G)">
                <ButtonElement
                  variant="gradient"
                  size="small"
                  rounded="full"
                  onClick={() => onGroupLayers(effectiveSelectedIds)}
                  leftIcon={<IconElement name="Group" size="xs" />}
                  sx={{ height: 28, fontSize: "0.68rem", px: SPACING.px8 }}
                >
                  Nhóm (Group)
                </ButtonElement>
              </Tooltip>
            )}

            {isGroupedSelection && onUngroupLayers && (
              <Tooltip title="Rã nhóm (Ctrl+Shift+G)">
                <ButtonElement
                  variant="outline"
                  size="small"
                  rounded="full"
                  onClick={() => onUngroupLayers(effectiveSelectedIds)}
                  leftIcon={<IconElement name="LayersClear" size="xs" />}
                  sx={{ height: 28, fontSize: "0.68rem", px: SPACING.px8, borderColor: COLOR.borderGoldLight }}
                >
                  Rã Nhóm
                </ButtonElement>
              </Tooltip>
            )}

            {onDeleteLayer && (
              <Tooltip title="Xóa tất cả các phần tử đã chọn">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => effectiveSelectedIds.forEach((id) => onDeleteLayer(id))}
                  sx={{ p: 0.5 }}
                >
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
            isSelected={effectiveSelectedIds.includes(layer.id)}
            isEditing={editingTextId === layer.id}
            isEditorMode={true}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLayer(layer.id, e.shiftKey || e.ctrlKey || e.metaKey);
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
            resizable={effectiveSelectedIds.length === 1}
            rotatable={effectiveSelectedIds.length === 1}
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
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onResizeStart={handleResizeStart}
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
