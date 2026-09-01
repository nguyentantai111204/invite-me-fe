"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ICanvasDocument,
  ICanvasLayer,
  ICanvasTextLayer,
  ICanvasImageLayer,
  ICanvasStickerLayer,
  ICanvasShapeLayer,
  CanvasOpeningEffectType,
  CanvasAmbientParticleType,
} from "@/interfaces/canvas-editor.interface";
import { INITIAL_WEDDING_CANVAS } from "./preset-canvas-data";

export const useCanvasEditor = (initialDoc?: ICanvasDocument, cardId?: string) => {
  const fallback = initialDoc || INITIAL_WEDDING_CANVAS;
  const [document, setDocument] = useState<ICanvasDocument>(fallback);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);

  // History state for undo/redo
  const [history, setHistory] = useState<ICanvasDocument[]>([fallback]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Hydrate from localStorage on client mount (prevents SSR hydration mismatch)
  useEffect(() => {
    if (typeof window !== "undefined" && cardId) {
      const saved = localStorage.getItem(`inviteme_canvas_${cardId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.layers) && parsed.layers.length > 0) {
            const sanitizedLayers = parsed.layers.map((l: any) => {
              if (
                (l.id === "layer-border-outer" || l.id === "layer-border-inner") &&
                l.fill &&
                l.fill !== "transparent"
              ) {
                return { ...l, fill: "transparent" };
              }
              return l;
            });
            const loadedDoc: ICanvasDocument = {
              ...fallback,
              ...parsed,
              layers: sanitizedLayers,
            };
            setDocument(loadedDoc);
            setHistory([loadedDoc]);
            setHistoryIndex(0);
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [cardId, fallback]);

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Auto-save to localStorage whenever document changes
  useEffect(() => {
    if (typeof window !== "undefined" && document && (cardId || document.id)) {
      setSaveStatus("saving");
      const storageKey = `inviteme_canvas_${cardId || document.id}`;
      localStorage.setItem(storageKey, JSON.stringify(document));
      const timer = setTimeout(() => {
        setSaveStatus("saved");
        setLastSavedTime(new Date());
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [document, cardId]);

  const pushHistory = useCallback(
    (newDoc: ICanvasDocument) => {
      setHistory((prev) => {
        const updated = prev.slice(0, historyIndex + 1);
        return [...updated, newDoc];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const selectLayer = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const updateLayer = useCallback(
    (id: string, updates: Partial<ICanvasLayer>) => {
      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const updatedLayers = prevLayers.map((layer) => {
          if (layer.id === id) {
            return { ...layer, ...updates } as ICanvasLayer;
          }
          return layer;
        });
        const newDoc = { ...prev, layers: updatedLayers };
        pushHistory(newDoc);
        return newDoc;
      });
    },
    [pushHistory]
  );

  // Helper: Auto-Placement calculates smart Y position to avoid overlapping existing layers
  const calculateSmartY = useCallback(
    (preferredY?: number, height = 40): number => {
      if (preferredY !== undefined) return preferredY;

      const layers = document?.layers || [];
      // Find bottom-most layer that is not the background borders
      const contentLayers = layers.filter(
        (l) => l.id !== "layer-border-outer" && l.id !== "layer-border-inner" && !l.isHidden
      );

      if (contentLayers.length === 0) return 100;

      // Find highest Y among visible content layers or place under currently selected
      const selected = layers.find((l) => l.id === selectedId);
      if (selected) {
        return Math.min(
          (document?.height || 1800) - 80,
          selected.y + (selected.height || 40) + 20
        );
      }

      // Default smart place: center or below the last added item
      const maxY = Math.max(...contentLayers.map((l) => l.y + (l.height || 35)));
      return Math.min((document?.height || 1800) - 80, maxY + 24);
    },
    [document?.layers, document?.height, selectedId]
  );

  const addTextLayer = useCallback(
    (preset?: Partial<ICanvasTextLayer>) => {
      const id = `layer-text-${Date.now()}`;
      const smartY = calculateSmartY(preset?.y, preset?.fontSize || 24);
      const layersCount = document?.layers?.length || 0;

      const newText: ICanvasTextLayer = {
        id,
        type: "text",
        name: preset?.text ? preset.text.slice(0, 18) : "Văn Bản Mới",
        text: preset?.text || "Chạm để sửa chữ",
        fontSize: preset?.fontSize || 22,
        fontFamily: preset?.fontFamily || "'Playfair Display', serif",
        fill: preset?.fill || "#221A12",
        textAlign: preset?.textAlign || "center",
        fontWeight: preset?.fontWeight || "bold",
        fontStyle: preset?.fontStyle || "normal",
        x: preset?.x !== undefined ? preset.x : 0,
        y: smartY,
        width: preset?.width || 390,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layersCount + 1,
        isLocked: false,
        isHidden: false,
      };

      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const newDoc = { ...prev, layers: [...prevLayers, newText] };
        pushHistory(newDoc);
        return newDoc;
      });
      setSelectedId(id);
    },
    [calculateSmartY, document?.layers?.length, pushHistory]
  );

  const addStickerLayer = useCallback(
    (content: string, fontSize = 36) => {
      const id = `layer-sticker-${Date.now()}`;
      const smartY = calculateSmartY(undefined, fontSize);
      const layersCount = document?.layers?.length || 0;

      const newSticker: ICanvasStickerLayer = {
        id,
        type: "sticker",
        name: `Họa Tiết ${content}`,
        stickerType: "emoji",
        content,
        fontSize,
        x: 0,
        y: smartY,
        width: 390,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layersCount + 1,
        isLocked: false,
        isHidden: false,
      };

      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const newDoc = { ...prev, layers: [...prevLayers, newSticker] };
        pushHistory(newDoc);
        return newDoc;
      });
      setSelectedId(id);
    },
    [calculateSmartY, document?.layers?.length, pushHistory]
  );

  const addImageLayer = useCallback(
    (src: string) => {
      const id = `layer-img-${Date.now()}`;
      const smartY = calculateSmartY(undefined, 220);
      const layersCount = document?.layers?.length || 0;

      const newImg: ICanvasImageLayer = {
        id,
        type: "image",
        name: "Ảnh Chèn",
        src,
        x: 65,
        y: smartY,
        width: 260,
        height: 220,
        borderRadius: 16,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layersCount + 1,
        isLocked: false,
        isHidden: false,
        opacity: 1,
      };

      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const newDoc = { ...prev, layers: [...prevLayers, newImg] };
        pushHistory(newDoc);
        return newDoc;
      });
      setSelectedId(id);
    },
    [calculateSmartY, document?.layers?.length, pushHistory]
  );

  const addShapeLayer = useCallback(
    (shapeType: "rect" | "circle" | "divider") => {
      const id = `layer-shape-${Date.now()}`;
      const smartY = calculateSmartY(undefined, shapeType === "divider" ? 20 : 120);
      const layersCount = document?.layers?.length || 0;

      const newShape: ICanvasShapeLayer = {
        id,
        type: "shape",
        name: shapeType === "divider" ? "Dải Phân Cách" : "Hình Khối",
        shapeType,
        x: shapeType === "divider" ? 95 : 120,
        y: smartY,
        width: shapeType === "divider" ? 200 : 150,
        height: shapeType === "divider" ? 1.5 : 150,
        fill: shapeType === "divider" ? "#C59B4B" : "transparent",
        stroke: "#C59B4B",
        strokeWidth: 1.5,
        borderRadius: shapeType === "rect" ? 8 : 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layersCount + 1,
        isLocked: false,
        isHidden: false,
      };

      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const newDoc = { ...prev, layers: [...prevLayers, newShape] };
        pushHistory(newDoc);
        return newDoc;
      });
      setSelectedId(id);
    },
    [calculateSmartY, document?.layers?.length, pushHistory]
  );

  const duplicateLayer = useCallback(
    (id: string) => {
      const layers = document?.layers || [];
      const target = layers.find((l) => l.id === id);
      if (!target) return;

      const newId = `layer-dup-${Date.now()}`;
      const duplicated: ICanvasLayer = {
        ...target,
        id: newId,
        name: `${target.name} (Bản sao)`,
        x: target.x + 15,
        y: target.y + 15,
        zIndex: layers.length + 1,
      };

      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const newDoc = { ...prev, layers: [...prevLayers, duplicated] };
        pushHistory(newDoc);
        return newDoc;
      });
      setSelectedId(newId);
    },
    [document?.layers, pushHistory]
  );

  const deleteLayer = useCallback(
    (id: string) => {
      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const updated = prevLayers.filter((l) => l.id !== id);
        const newDoc = { ...prev, layers: updated };
        pushHistory(newDoc);
        return newDoc;
      });
      setSelectedId(null);
    },
    [pushHistory]
  );

  const bringForward = useCallback(
    (id: string) => {
      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const index = prevLayers.findIndex((l) => l.id === id);
        if (index < 0 || index >= prevLayers.length - 1) return prev;
        const newLayers = [...prevLayers];
        const temp = newLayers[index];
        newLayers[index] = newLayers[index + 1];
        newLayers[index + 1] = temp;
        const reindexedLayers = newLayers.map((l, i) => ({ ...l, zIndex: i + 1 }));
        const newDoc = { ...prev, layers: reindexedLayers };
        pushHistory(newDoc);
        return newDoc;
      });
    },
    [pushHistory]
  );

  const sendBackward = useCallback(
    (id: string) => {
      setDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const index = prevLayers.findIndex((l) => l.id === id);
        if (index <= 0) return prev;
        const newLayers = [...prevLayers];
        const temp = newLayers[index];
        newLayers[index] = newLayers[index - 1];
        newLayers[index - 1] = temp;
        const reindexedLayers = newLayers.map((l, i) => ({ ...l, zIndex: i + 1 }));
        const newDoc = { ...prev, layers: reindexedLayers };
        pushHistory(newDoc);
        return newDoc;
      });
    },
    [pushHistory]
  );

  const setBackgroundColor = useCallback(
    (color: string) => {
      setDocument((prev) => {
        const newDoc = { ...prev, backgroundColor: color };
        pushHistory(newDoc);
        return newDoc;
      });
    },
    [pushHistory]
  );

  const setOpeningEffect = useCallback(
    (effect: CanvasOpeningEffectType) => {
      setDocument((prev) => {
        const newDoc = { ...prev, openingEffect: effect };
        pushHistory(newDoc);
        return newDoc;
      });
    },
    [pushHistory]
  );

  const setAmbientParticle = useCallback(
    (particle: CanvasAmbientParticleType) => {
      setDocument((prev) => {
        const newDoc = { ...prev, ambientParticle: particle };
        pushHistory(newDoc);
        return newDoc;
      });
    },
    [pushHistory]
  );

  const expandCanvasHeight = useCallback(
    (delta = 300) => {
      setDocument((prev) => {
        const currentHeight = prev?.height || 1800;
        const newHeight = Math.max(780, currentHeight + delta);
        const prevLayers = prev?.layers || [];
        const updatedLayers = prevLayers.map((l) => {
          if (l.id === "layer-border-outer") {
            return { ...l, height: newHeight - 32 };
          }
          if (l.id === "layer-border-inner") {
            return { ...l, height: newHeight - 44 };
          }
          return l;
        });
        const newDoc = { ...prev, height: newHeight, layers: updatedLayers };
        pushHistory(newDoc);
        return newDoc;
      });
    },
    [pushHistory]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setDocument(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setDocument(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const selectedLayer = document?.layers?.find((l) => l.id === selectedId) || null;

  return {
    document,
    setDocument,
    selectedId,
    selectedLayer,
    scale,
    setScale,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    selectLayer,
    updateLayer,
    addTextLayer,
    addImageLayer,
    addStickerLayer,
    addShapeLayer,
    duplicateLayer,
    deleteLayer,
    bringForward,
    sendBackward,
    setBackgroundColor,
    setOpeningEffect,
    setAmbientParticle,
    expandCanvasHeight,
    undo,
    redo,
    saveStatus,
    lastSavedTime,
  };
};
