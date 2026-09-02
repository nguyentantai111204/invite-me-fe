"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ICanvasDocument,
  ICanvasLayer,
  ICanvasTextLayer,
  ICanvasImageLayer,
  ICanvasStickerLayer,
  ICanvasShapeLayer,
  ICanvasCalendarLayer,
  ICanvasTimelineLayer,
  ICanvasCountdownLayer,
  ICanvasEventInfoLayer,
  CanvasOpeningEffectType,
  CanvasAmbientParticleType,
} from "@/interfaces/canvas-editor.interface";
import { INITIAL_WEDDING_CANVAS } from "./preset-canvas-data";

export const useCanvasEditor = (initialDoc?: ICanvasDocument, cardId?: string) => {
  const fallback = initialDoc || INITIAL_WEDDING_CANVAS;
  const [document, setDocument] = useState<ICanvasDocument>(fallback);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scale, setScale] = useState<number>(1);

  const selectedId = selectedIds.length > 0 ? selectedIds[selectedIds.length - 1] : null;
  const setSelectedId = useCallback((id: string | null) => setSelectedIds(id ? [id] : []), []);

  // History state for undo/redo with synchronous refs to avoid stale closures
  const [history, setHistory] = useState<ICanvasDocument[]>([fallback]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const documentRef = useRef<ICanvasDocument>(fallback);
  const historyRef = useRef<ICanvasDocument[]>([fallback]);
  const historyIndexRef = useRef<number>(0);
  const selectedIdsRef = useRef<string[]>([]);

  useEffect(() => {
    documentRef.current = document;
  }, [document]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  // Hydrate from localStorage on client mount (prevents SSR hydration mismatch)
  useEffect(() => {
    if (typeof window !== "undefined" && cardId) {
      const saved = localStorage.getItem(`inviteme_canvas_${cardId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // If stored canvas is outdated (old version had < 24 layers), auto-upgrade to rich preset
          if (parsed && Array.isArray(parsed.layers) && parsed.layers.length >= 24) {
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
            documentRef.current = loadedDoc;
            setDocument(loadedDoc);
            setHistory([loadedDoc]);
            setHistoryIndex(0);
            historyRef.current = [loadedDoc];
            historyIndexRef.current = 0;
            return;
          }
        } catch {
          // Fallback to preset
        }
      }

      // Default load new rich INITIAL_WEDDING_CANVAS
      documentRef.current = fallback;
      setDocument(fallback);
      setHistory([fallback]);
      setHistoryIndex(0);
      historyRef.current = [fallback];
      historyIndexRef.current = 0;
    }
  }, [cardId, fallback]);

  const resetToPreset = useCallback(() => {
    documentRef.current = fallback;
    setDocument(fallback);
    setHistory([fallback]);
    setHistoryIndex(0);
    historyRef.current = [fallback];
    historyIndexRef.current = 0;
    setSelectedIds([]);
  }, [fallback]);

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Synchronous document commit wrapper to avoid asynchronous state race conditions
  const commitDocument = useCallback((updater: (prev: ICanvasDocument) => ICanvasDocument) => {
    const currentDoc = documentRef.current;
    const newDoc = updater(currentDoc);
    if (newDoc === currentDoc) return;

    documentRef.current = newDoc;
    setDocument(newDoc);

    // Push into undo/redo history
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    const newHistory = [...currentHistory.slice(0, currentIndex + 1), newDoc];

    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
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
        setSelectedIds((currentIds) => {
          return currentIds.filter((id) => prevDoc.layers.some((l) => l.id === id));
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
        setSelectedIds((currentIds) => {
          return currentIds.filter((id) => nextDoc.layers.some((l) => l.id === id));
        });
      }
    }
  }, []);

  const groupLayers = useCallback((ids?: string[]) => {
    const targetIds = ids || selectedIdsRef.current;
    if (targetIds.length < 2) return;

    const newGroupId = `group-${Date.now()}`;
    commitDocument((prev) => {
      const prevLayers = prev?.layers || [];
      const updatedLayers = prevLayers.map((l) => {
        if (targetIds.includes(l.id)) {
          return { ...l, groupId: newGroupId };
        }
        return l;
      });
      return { ...prev, layers: updatedLayers };
    });
    setSelectedIds(targetIds);
  }, [commitDocument]);

  const ungroupLayers = useCallback((ids?: string[]) => {
    const targetIds = ids || selectedIdsRef.current;
    if (targetIds.length === 0) return;

    commitDocument((prev) => {
      const prevLayers = prev?.layers || [];
      const updatedLayers = prevLayers.map((l) => {
        if (targetIds.includes(l.id) || (l.groupId && targetIds.includes(l.groupId))) {
          const { groupId: _, ...rest } = l;
          return rest as ICanvasLayer;
        }
        return l;
      });
      return { ...prev, layers: updatedLayers };
    });
  }, [commitDocument]);

  // Global Keyboard Shortcuts for Undo (Ctrl+Z), Redo (Ctrl+Y / Ctrl+Shift+Z), Group (Ctrl+G), Ungroup (Ctrl+Shift+G)
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

      // Group: Ctrl+G / Ungroup: Ctrl+Shift+G
      if (key === "g" || code === "KeyG") {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) {
          ungroupLayers();
        } else {
          groupLayers();
        }
        return;
      }

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

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [undo, redo, groupLayers, ungroupLayers]);

  // Auto-save debounced to localStorage
  useEffect(() => {
    if (!cardId || typeof window === "undefined") return;

    setSaveStatus("saving");
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`inviteme_canvas_${cardId}`, JSON.stringify(document));
        setSaveStatus("saved");
        setLastSavedTime(new Date());
      } catch (err) {
        console.error("Failed to auto-save canvas to localStorage", err);
        setSaveStatus("saved");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [document, cardId]);

  const selectLayer = useCallback((id: string | null, isMulti = false) => {
    if (id === null) {
      setSelectedIds([]);
      return;
    }

    const currentDoc = documentRef.current;
    const clickedLayer = currentDoc?.layers?.find((l) => l.id === id);

    if (isMulti) {
      setSelectedIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((i) => i !== id);
        } else {
          return [...prev, id];
        }
      });
      return;
    }

    // Single click: if layer belongs to a group, select all layers in the group!
    if (clickedLayer?.groupId) {
      const groupMembers = (currentDoc?.layers || [])
        .filter((l) => l.groupId === clickedLayer.groupId)
        .map((l) => l.id);
      setSelectedIds(groupMembers.length > 0 ? groupMembers : [id]);
    } else {
      setSelectedIds([id]);
    }
  }, []);

  const moveMultipleLayers = useCallback((positions: { id: string; x: number; y: number }[]) => {
    commitDocument((prev) => {
      const prevLayers = prev?.layers || [];
      const posMap = new Map(positions.map((p) => [p.id, p]));
      const updatedLayers = prevLayers.map((l) => {
        const p = posMap.get(l.id);
        if (p) {
          return { ...l, x: p.x, y: p.y };
        }
        return l;
      });
      return { ...prev, layers: updatedLayers };
    });
  }, [commitDocument]);

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
    [calculateSmartY, commitDocument, setSelectedId]
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
    [calculateSmartY, commitDocument, setSelectedId]
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
    [calculateSmartY, commitDocument, setSelectedId]
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
    [calculateSmartY, commitDocument, setSelectedId]
  );

  const addCalendarLayer = useCallback(
    (preset?: Partial<ICanvasCalendarLayer>) => {
      const id = `layer-cal-${Date.now()}`;
      const smartY = calculateSmartY(undefined, 250);
      const layersCount = documentRef.current?.layers?.length || 0;

      const newCal: ICanvasCalendarLayer = {
        id,
        type: "calendar",
        name: "Lịch Save The Date",
        monthTitle: "Tháng 11 / 2026",
        year: 2026,
        month: 11,
        startDayOfWeek: 6,
        daysCount: 30,
        selectedDay: 20,
        primaryColor: "#851C24",
        accentColor: "#EBDBC8",
        backgroundColor: "#FFFFFF",
        x: 45,
        y: smartY,
        width: 300,
        height: 245,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layersCount + 1,
        isLocked: false,
        isHidden: false,
        ...preset,
      };

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, newCal] };
      });
      setSelectedId(id);
    },
    [calculateSmartY, commitDocument, setSelectedId]
  );

  const addTimelineLayer = useCallback(
    (preset?: Partial<ICanvasTimelineLayer>) => {
      const id = `layer-timeline-${Date.now()}`;
      const smartY = calculateSmartY(undefined, 230);
      const layersCount = documentRef.current?.layers?.length || 0;

      const newTimeline: ICanvasTimelineLayer = {
        id,
        type: "timeline",
        name: "Lịch Trình Sự Kiện",
        title: "LỊCH TRÌNH SỰ KIỆN",
        primaryColor: "#851C24",
        accentColor: "#D4AF37",
        textColor: "#3B2F23",
        items: [
          { time: "17:30", title: "Đón Tiếp Khách Mời & Check-in", subTitle: "Chụp ảnh lưu niệm tại sảnh hoa" },
          { time: "18:30", title: "Lễ Thành Hôn Chính Thức", subTitle: "Nghi thức trao nhẫn & cắt bánh mừng" },
          { time: "19:00", title: "Khai Tiệc Mừng Hạnh Phúc", subTitle: "Thưởng thức ẩm thực & chúc mừng" },
          { time: "20:30", title: "Giao Lưu & Chụp Hình Lưu Niệm", subTitle: "Mini game & chia sẻ cảm xúc" },
        ],
        x: 25,
        y: smartY,
        width: 340,
        height: 220,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layersCount + 1,
        isLocked: false,
        isHidden: false,
        ...preset,
      };

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, newTimeline] };
      });
      setSelectedId(id);
    },
    [calculateSmartY, commitDocument, setSelectedId]
  );

  const addCountdownLayer = useCallback(
    (preset?: Partial<ICanvasCountdownLayer>) => {
      const id = `layer-countdown-${Date.now()}`;
      const smartY = calculateSmartY(undefined, 110);
      const layersCount = documentRef.current?.layers?.length || 0;

      const newCountdown: ICanvasCountdownLayer = {
        id,
        type: "countdown",
        name: "Khung Đếm Ngược",
        title: "Đếm ngược đến giờ sự kiện",
        days: 13,
        hours: 15,
        minutes: 48,
        primaryColor: "#851C24",
        backgroundColor: "#FFFFFF",
        x: 45,
        y: smartY,
        width: 300,
        height: 105,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layersCount + 1,
        isLocked: false,
        isHidden: false,
        ...preset,
      };

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, newCountdown] };
      });
      setSelectedId(id);
    },
    [calculateSmartY, commitDocument, setSelectedId]
  );

  const addEventInfoLayer = useCallback(
    (preset?: Partial<ICanvasEventInfoLayer>) => {
      const id = `layer-event-info-${Date.now()}`;
      const smartY = calculateSmartY(undefined, 70);
      const layersCount = documentRef.current?.layers?.length || 0;

      const newEventInfo: ICanvasEventInfoLayer = {
        id,
        type: "event-info",
        name: "Khung Ngày & Giờ",
        dateLabel: "NGÀY",
        dateValue: "Chủ Nhật\n20.11.2026",
        timeLabel: "GIỜ",
        timeValue: "Đón khách\n18:00",
        primaryColor: "#851C24",
        accentColor: "#E2D3BE",
        x: 45,
        y: smartY,
        width: 300,
        height: 60,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        zIndex: layersCount + 1,
        isLocked: false,
        isHidden: false,
        ...preset,
      };

      commitDocument((prev) => {
        const prevLayers = prev?.layers || [];
        return { ...prev, layers: [...prevLayers, newEventInfo] };
      });
      setSelectedId(id);
    },
    [calculateSmartY, commitDocument, setSelectedId]
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
    [commitDocument, setSelectedId]
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
    [commitDocument, setSelectedId]
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

  const selectedLayers = (document?.layers || []).filter((l) => selectedIds.includes(l.id));
  const selectedLayer = selectedLayers.length > 0 ? selectedLayers[selectedLayers.length - 1] : null;

  return {
    document,
    setDocument,
    selectedId,
    selectedIds,
    selectedLayer,
    selectedLayers,
    scale,
    setScale,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    selectLayer,
    updateLayer,
    moveMultipleLayers,
    groupLayers,
    ungroupLayers,
    addTextLayer,
    addImageLayer,
    addStickerLayer,
    addShapeLayer,
    addCalendarLayer,
    addTimelineLayer,
    addCountdownLayer,
    addEventInfoLayer,
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
    resetToPreset,
    saveStatus,
    lastSavedTime,
  };
};
