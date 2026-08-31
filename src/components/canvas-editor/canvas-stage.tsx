"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Paper, IconButton, Tooltip } from "@mui/material";
import {
  ICanvasDocument,
  ICanvasLayer,
  ICanvasTextLayer,
  ICanvasImageLayer,
  ICanvasStickerLayer,
  ICanvasShapeLayer,
} from "@/interfaces/canvas-editor.interface";
import { COLOR, RADIUS, SHADOW } from "@/constants/style.constant";
import { IconElement } from "@/components/shared";

import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Image as KonvaImage,
  Transformer,
  Line,
} from "react-konva";

interface ICanvasStageProps {
  document: ICanvasDocument;
  selectedId: string | null;
  scale?: number;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<ICanvasLayer>) => void;
  onDuplicateLayer?: (id: string) => void;
  onDeleteLayer?: (id: string) => void;
}

// Helper component to render HTML Image on Konva Canvas
const URLImage: React.FC<{
  layer: ICanvasImageLayer;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<ICanvasImageLayer>) => void;
  onDragMove?: (e: any) => void;
  shapeRef: (node: any) => void;
}> = ({ layer, isSelected, onSelect, onChange, onDragMove, shapeRef }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!layer.src) return;
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = layer.src;
    img.onload = () => {
      setImage(img);
    };
  }, [layer.src]);

  return (
    <KonvaImage
      ref={shapeRef}
      image={image || undefined}
      x={layer.x}
      y={layer.y}
      width={layer.width || 200}
      height={layer.height || 200}
      rotation={layer.rotation || 0}
      scaleX={layer.scaleX || 1}
      scaleY={layer.scaleY || 1}
      opacity={layer.opacity ?? 1}
      cornerRadius={layer.borderRadius || 0}
      draggable={!layer.isLocked}
      onClick={onSelect}
      onTap={onSelect}
      onDragMove={onDragMove}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        onChange({
          x: node.x(),
          y: node.y(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
          rotation: node.rotation(),
        });
      }}
    />
  );
};

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
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextVal, setEditingTextVal] = useState<string>("");

  // Snapping guideline state
  const [showCenterGuide, setShowCenterGuide] = useState(false);

  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const shapeNodesRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update Transformer attachment when selectedId changes
  useEffect(() => {
    if (!transformerRef.current) return;
    if (selectedId && shapeNodesRef.current.has(selectedId)) {
      const node = shapeNodesRef.current.get(selectedId);
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, document.layers]);

  // Keyboard shortcut listener (Delete key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTextId) return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && onDeleteLayer) {
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

  // Smart Alignment Snapping calculation
  const handleDragMove = (e: any, width = 390) => {
    const node = e.target;
    const canvasCenterX = document.width / 2; // 195px
    const nodeCenterX = node.x() + (width * (node.scaleX() || 1)) / 2;

    // Check center snap
    if (Math.abs(nodeCenterX - canvasCenterX) < 6) {
      node.x(canvasCenterX - (width * (node.scaleX() || 1)) / 2);
      setShowCenterGuide(true);
    } else if (Math.abs(node.x()) < 6) {
      node.x(0);
      setShowCenterGuide(true);
    } else {
      setShowCenterGuide(false);
    }
  };

  const selectedLayer = document.layers.find((l) => l.id === selectedId);
  const editingLayer = document.layers.find((l) => l.id === editingTextId) as ICanvasTextLayer | undefined;

  if (!isClient) {
    return (
      <Box
        sx={{
          width: document.width,
          height: document.height,
          backgroundColor: document.backgroundColor,
          borderRadius: RADIUS.lg,
          boxShadow: SHADOW.xl,
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: document.width * scale,
        height: document.height * scale,
        boxShadow: "0 20px 48px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        borderRadius: "20px",
        overflow: "visible", // To allow floating toolbar above canvas
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Floating Context Toolbar (Rendered above the selected element) */}
      {selectedLayer && !editingTextId && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: `${Math.max(10, (selectedLayer.y - 48) * scale)}px`,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            borderRadius: "9999px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #ECE7DD",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            p: 0.5,
            px: 1,
            gap: 0.5,
          }}
        >
          {selectedLayer.type === "text" && (
            <>
              <Tooltip title="In Đậm (Bold)">
                <IconButton
                  size="small"
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, {
                      fontWeight: (selectedLayer as ICanvasTextLayer).fontWeight === "bold" ? "normal" : "bold",
                    })
                  }
                  sx={{
                    color: (selectedLayer as ICanvasTextLayer).fontWeight === "bold" ? COLOR.gold.main : "inherit",
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
                      fontStyle: (selectedLayer as ICanvasTextLayer).fontStyle === "italic" ? "normal" : "italic",
                    })
                  }
                  sx={{
                    color: (selectedLayer as ICanvasTextLayer).fontStyle === "italic" ? COLOR.gold.main : "inherit",
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
                    const nextAlign = currentAlign === "center" ? "left" : currentAlign === "left" ? "right" : "center";
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
            </>
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
      )}

      {/* Main Canvas Stage */}
      <Stage
        ref={stageRef}
        width={document.width}
        height={document.height}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            onSelectLayer(null);
            handleFinishTextEdit();
          }
        }}
      >
        <Layer>
          {/* Canvas Background */}
          <Rect
            x={0}
            y={0}
            width={document.width}
            height={document.height}
            fill={document.backgroundColor || "#FAF8F5"}
          />

          {/* Smart Alignment Center Guide Line */}
          {showCenterGuide && (
            <Line
              points={[document.width / 2, 0, document.width / 2, document.height]}
              stroke="#D4AF37"
              strokeWidth={1.5}
              dash={[4, 4]}
            />
          )}

          {/* Render All Layers */}
          {document.layers.map((layer) => {
            if (layer.isHidden) return null;

            // 1. Text Layer
            if (layer.type === "text") {
              const txtLayer = layer as ICanvasTextLayer;
              return (
                <Text
                  key={txtLayer.id}
                  ref={(node) => {
                    if (node) shapeNodesRef.current.set(txtLayer.id, node);
                    else shapeNodesRef.current.delete(txtLayer.id);
                  }}
                  text={editingTextId === txtLayer.id ? "" : txtLayer.text}
                  x={txtLayer.x}
                  y={txtLayer.y}
                  width={txtLayer.width}
                  fontSize={txtLayer.fontSize}
                  fontFamily={txtLayer.fontFamily || "'Playfair Display', serif"}
                  fontStyle={txtLayer.fontStyle === "italic" ? "italic" : txtLayer.fontWeight === "bold" ? "bold" : "normal"}
                  fill={txtLayer.fill || "#2A231C"}
                  align={txtLayer.textAlign || "center"}
                  letterSpacing={txtLayer.letterSpacing || 0}
                  rotation={txtLayer.rotation || 0}
                  scaleX={txtLayer.scaleX || 1}
                  scaleY={txtLayer.scaleY || 1}
                  draggable={!txtLayer.isLocked}
                  onClick={() => onSelectLayer(txtLayer.id)}
                  onTap={() => onSelectLayer(txtLayer.id)}
                  onDblClick={() => handleTextDblClick(txtLayer)}
                  onDblTap={() => handleTextDblClick(txtLayer)}
                  onDragMove={(e) => handleDragMove(e, txtLayer.width || 390)}
                  onDragEnd={(e) => {
                    setShowCenterGuide(false);
                    onUpdateLayer(txtLayer.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    onUpdateLayer(txtLayer.id, {
                      x: node.x(),
                      y: node.y(),
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                      rotation: node.rotation(),
                    });
                  }}
                />
              );
            }

            // 2. Image Layer
            if (layer.type === "image") {
              const imgLayer = layer as ICanvasImageLayer;
              return (
                <URLImage
                  key={imgLayer.id}
                  layer={imgLayer}
                  isSelected={selectedId === imgLayer.id}
                  onSelect={() => onSelectLayer(imgLayer.id)}
                  onChange={(updates) => onUpdateLayer(imgLayer.id, updates)}
                  onDragMove={(e) => handleDragMove(e, imgLayer.width || 260)}
                  shapeRef={(node) => {
                    if (node) shapeNodesRef.current.set(imgLayer.id, node);
                    else shapeNodesRef.current.delete(imgLayer.id);
                  }}
                />
              );
            }

            // 3. Sticker Layer
            if (layer.type === "sticker") {
              const stkLayer = layer as ICanvasStickerLayer;
              return (
                <Text
                  key={stkLayer.id}
                  ref={(node) => {
                    if (node) shapeNodesRef.current.set(stkLayer.id, node);
                    else shapeNodesRef.current.delete(stkLayer.id);
                  }}
                  text={stkLayer.content}
                  x={stkLayer.x}
                  y={stkLayer.y}
                  width={stkLayer.width}
                  align="center"
                  fontSize={stkLayer.fontSize || 36}
                  rotation={stkLayer.rotation || 0}
                  scaleX={stkLayer.scaleX || 1}
                  scaleY={stkLayer.scaleY || 1}
                  draggable={!stkLayer.isLocked}
                  onClick={() => onSelectLayer(stkLayer.id)}
                  onTap={() => onSelectLayer(stkLayer.id)}
                  onDragMove={(e) => handleDragMove(e, stkLayer.width || 390)}
                  onDragEnd={(e) => {
                    setShowCenterGuide(false);
                    onUpdateLayer(stkLayer.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    onUpdateLayer(stkLayer.id, {
                      x: node.x(),
                      y: node.y(),
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                      rotation: node.rotation(),
                    });
                  }}
                />
              );
            }

            // 4. Shape Layer
            if (layer.type === "shape") {
              const shpLayer = layer as ICanvasShapeLayer;
              if (shpLayer.shapeType === "circle") {
                return (
                  <Circle
                    key={shpLayer.id}
                    ref={(node) => {
                      if (node) shapeNodesRef.current.set(shpLayer.id, node);
                      else shapeNodesRef.current.delete(shpLayer.id);
                    }}
                    x={shpLayer.x}
                    y={shpLayer.y}
                    radius={(shpLayer.width || 100) / 2}
                    fill={shpLayer.fill}
                    stroke={shpLayer.stroke}
                    strokeWidth={shpLayer.strokeWidth || 1}
                    rotation={shpLayer.rotation || 0}
                    scaleX={shpLayer.scaleX || 1}
                    scaleY={shpLayer.scaleY || 1}
                    draggable={!shpLayer.isLocked}
                    onClick={() => onSelectLayer(shpLayer.id)}
                    onTap={() => onSelectLayer(shpLayer.id)}
                    onDragEnd={(e) => {
                      onUpdateLayer(shpLayer.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      onUpdateLayer(shpLayer.id, {
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                      });
                    }}
                  />
                );
              }

              return (
                <Rect
                  key={shpLayer.id}
                  ref={(node) => {
                    if (node) shapeNodesRef.current.set(shpLayer.id, node);
                    else shapeNodesRef.current.delete(shpLayer.id);
                  }}
                  x={shpLayer.x}
                  y={shpLayer.y}
                  width={shpLayer.width || 150}
                  height={shpLayer.height || 150}
                  fill={shpLayer.fill}
                  stroke={shpLayer.stroke}
                  strokeWidth={shpLayer.strokeWidth || 1}
                  cornerRadius={shpLayer.borderRadius || 0}
                  rotation={shpLayer.rotation || 0}
                  scaleX={shpLayer.scaleX || 1}
                  scaleY={shpLayer.scaleY || 1}
                  draggable={!shpLayer.isLocked}
                  onClick={() => onSelectLayer(shpLayer.id)}
                  onTap={() => onSelectLayer(shpLayer.id)}
                  onDragEnd={(e) => {
                    onUpdateLayer(shpLayer.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    onUpdateLayer(shpLayer.id, {
                      x: node.x(),
                      y: node.y(),
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                      rotation: node.rotation(),
                    });
                  }}
                />
              );
            }

            return null;
          })}

          {/* Konva Transformer Controls */}
          <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 10 || newBox.height < 10) {
                return oldBox;
              }
              return newBox;
            }}
            anchorCornerRadius={3}
            anchorSize={9}
            anchorStroke="#B78628"
            anchorFill="#FFFFFF"
            borderStroke="#B78628"
            borderDash={[4, 4]}
          />
        </Layer>
      </Stage>

      {/* In-place Inline Text Editing Textarea Overlay */}
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
            background: "rgba(255, 255, 255, 0.95)",
            border: "1.5px dashed #B78628",
            borderRadius: "4px",
            outline: "none",
            resize: "none",
            zIndex: 1000,
            padding: "2px 4px",
            lineHeight: 1.2,
          }}
        />
      )}
    </Box>
  );
};
