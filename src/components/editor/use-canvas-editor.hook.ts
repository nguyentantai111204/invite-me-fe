"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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

  // History state for undo/redo with synchronous refs to avoid stale closures
  const [history, setHistory] = useState<ICanvasDocument[]>([fallback]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const documentRef = useRef<ICanvasDocument>(fallback);
  const historyRef = useRef<ICanvasDocument[]>([fallback]);
  const historyIndexRef = useRef<number>(0);

  useEffect(() => {
    documentRef.current = document;
  }, [document]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

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
              if (l.id === "layer-txt-thanks" && (l.y === undefined || l.y < 300)) {
                return { ...l, y: 1630 };
              }
              return l;
            });
            const loadedDoc: ICanvasDocument = {
              ...fallback,
              ...parsed,
              layers: sanitizedLayers,
            };
            documentRef.current = loadedDoc;
            setDocument(loadedDoc);
            setHistory([loadedDoc]);
            setHistoryIndex(0);
            historyRef.current = [loadedDoc];
            historyIndexRef.current = 0;
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

  // Synchronous document commit + history push (Eliminates React State Tearing)
  const commitDocument = useCallback((updater: (prev: ICanvasDocument) => ICanvasDocument) => {
    const currentDoc = documentRef.current;
    const newDoc = updater(currentDoc);
    documentRef.current = newDoc;
    setDocument(newDoc);

    const currentIndex = historyIndexRef.current;
    const currentHist = historyRef.current;
    const nextHistory = currentHist.slice(0, currentIndex + 1);

    if (nextHistory.length >= 50) {
      nextHistory.shift();
    }
    const updated = [...nextHistory, newDoc];
    const newIdx = updated.length - 1;
    historyRef.current = updated;
    historyIndexRef.current = newIdx;
    setHistory(updated);
    setHistoryIndex(newIdx);
  }, []);

  const undo = useCallback(() => {
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevDoc = currentHistory[prevIndex];
      if (prevDoc) {
        historyIndexRef.current = prevIndex;
        documentRef.current = prevDoc;
        setHistoryIndex(prevIndex);
        setDocument(prevDoc);
        setSelectedId((currentId) => {
          if (currentId && !prevDoc.layers.some((l) => l.id === currentId)) {
            return null;
          }
          return currentId;
        });
      }
    }
  }, []);

  const redo = useCallback(() => {
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    if (currentIndex < currentHistory.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextDoc = currentHistory[nextIndex];
      if (nextDoc) {
        historyIndexRef.current = nextIndex;
        documentRef.current = nextDoc;
        setHistoryIndex(nextIndex);
        setDocument(nextDoc);
        setSelectedId((currentId) => {
          if (currentId && !nextDoc.layers.some((l) => l.id === currentId)) {
            return null;
          }
          return currentId;
        });
      }
    }
  }, []);

  // Global Keyboard Shortcuts for Undo (Ctrl+Z / Cmd+Z) & Redo (Ctrl+Y / Ctrl+Shift+Z / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = typeof window !== "undefined" ? (window.document.activeElement as HTMLElement | null) : null;
      const target = e.target as HTMLElement | null;

      const isInputFocused =
        (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) ||
        (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable));

      if (isInputFocused) return;

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      const key = e.key ? e.key.toLowerCase() : "";
      const code = e.code;

      // Redo: Ctrl+Y OR Ctrl+Shift+Z OR Cmd+Shift+Z
      if (
        key === "y" ||
        code === "KeyY" ||
        ((key === "z" || code === "KeyZ") && e.shiftKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
        redo();
        return;
      }

      // Undo: Ctrl+Z OR Cmd+Z (without shift)
      if ((key === "z" || code === "KeyZ") && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        undo();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [undo, redo]);

  const selectLayer = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const updateLayer = useCallback(
    (id: string, updates: Partial<ICanvasLayer>) => {
      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const updatedLayers = prevLayers.map((layer) => {
          if (layer.id === id) {
            return { ...layer, ...updates } as ICanvasLayer;
          }
          return layer;
        });
        return { ...prev, layers: updatedLayers };
      });
    },
    [commitDocument]
  );

  // Helper: Auto-Placement calculates smart Y position to avoid overlapping existing layers
  const calculateSmartY = useCallback(
    (preferredY?: number, height = 40): number => {
      if (preferredY !== undefined) return preferredY;

      const currentDoc = documentRef.current;
      const layers = currentDoc?.layers || [];
      const contentLayers = layers.filter(
        (l) => l.id !== "layer-border-outer" && l.id !== "layer-border-inner" && !l.isHidden
      );

      if (contentLayers.length === 0) return 100;

      const selected = layers.find((l) => l.id === selectedId);
      if (selected) {
        return Math.min(
          (currentDoc?.height || 1800) - 80,
          selected.y + (selected.height || 40) + 20
        );
      }

      const maxY = Math.max(...contentLayers.map((l) => l.y + (l.height || 35)));
      return Math.min((currentDoc?.height || 1800) - 80, maxY + 24);
    },
    [selectedId]
  );

  const addTextLayer = useCallback(
    (preset?: Partial<ICanvasTextLayer>) => {
      const id = `layer-text-${Date.now()}`;
      const smartY = calculateSmartY(preset?.y, preset?.fontSize || 24);
      const layersCount = documentRef.current?.layers?.length || 0;

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

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, newText] };
      });
      setSelectedId(id);
    },
    [calculateSmartY, commitDocument]
  );

  const addStickerLayer = useCallback(
    (content: string, fontSize = 36) => {
      const id = `layer-sticker-${Date.now()}`;
      const smartY = calculateSmartY(undefined, fontSize);
      const layersCount = documentRef.current?.layers?.length || 0;

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

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, newSticker] };
      });
      setSelectedId(id);
    },
    [calculateSmartY, commitDocument]
  );

  const addImageLayer = useCallback(
    (src: string) => {
      const id = `layer-img-${Date.now()}`;
      const smartY = calculateSmartY(undefined, 220);
      const layersCount = documentRef.current?.layers?.length || 0;

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

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, newImg] };
      });
      setSelectedId(id);
    },
    [calculateSmartY, commitDocument]
  );

  const addShapeLayer = useCallback(
    (shapeType: "rect" | "circle" | "divider") => {
      const id = `layer-shape-${Date.now()}`;
      const smartY = calculateSmartY(undefined, shapeType === "divider" ? 20 : 120);
      const layersCount = documentRef.current?.layers?.length || 0;

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

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, newShape] };
      });
      setSelectedId(id);
    },
    [calculateSmartY, commitDocument]
  );

  const duplicateLayer = useCallback(
    (id: string) => {
      const layers = documentRef.current?.layers || [];
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

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, duplicated] };
      });
      setSelectedId(newId);
    },
    [commitDocument]
  );

  const deleteLayer = useCallback(
    (id: string) => {
      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const updated = prevLayers.filter((l) => l.id !== id);
        return { ...prev, layers: updated };
      });
      setSelectedId(null);
    },
    [commitDocument]
  );

  const bringForward = useCallback(
    (id: string) => {
      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const index = prevLayers.findIndex((l) => l.id === id);
        if (index < 0 || index >= prevLayers.length - 1) return prev;
        const newLayers = [...prevLayers];
        const temp = newLayers[index];
        newLayers[index] = newLayers[index + 1];
        newLayers[index + 1] = temp;
        const reindexedLayers = newLayers.map((l, i) => ({ ...l, zIndex: i + 1 }));
        return { ...prev, layers: reindexedLayers };
      });
    },
    [commitDocument]
  );

  const sendBackward = useCallback(
    (id: string) => {
      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        const index = prevLayers.findIndex((l) => l.id === id);
        if (index <= 0) return prev;
        const newLayers = [...prevLayers];
        const temp = newLayers[index];
        newLayers[index] = newLayers[index - 1];
        newLayers[index - 1] = temp;
        const reindexedLayers = newLayers.map((l, i) => ({ ...l, zIndex: i + 1 }));
        return { ...prev, layers: reindexedLayers };
      });
    },
    [commitDocument]
  );

  const setBackgroundColor = useCallback(
    (color: string) => {
      commitDocument((prev) => {
        return { ...prev, backgroundColor: color };
      });
    },
    [commitDocument]
  );

  const setOpeningEffect = useCallback(
    (effect: CanvasOpeningEffectType) => {
      commitDocument((prev) => {
        return { ...prev, openingEffect: effect };
      });
    },
    [commitDocument]
  );

  const setAmbientParticle = useCallback(
    (particle: CanvasAmbientParticleType) => {
      commitDocument((prev) => {
        return { ...prev, ambientParticle: particle };
      });
    },
    [commitDocument]
  );

  const expandCanvasHeight = useCallback(
    (delta = 300) => {
      commitDocument((prev) => {
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
        return { ...prev, height: newHeight, layers: updatedLayers };
      });
    },
    [commitDocument]
  );

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
