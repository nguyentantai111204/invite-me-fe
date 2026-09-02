"use client";

import React, { useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, IconButton } from "@mui/material";
import dynamic from "next/dynamic";
import { useCanvasEditor } from "@/components/editor/use-canvas-editor.hook";
import { CanvasTopBar } from "@/components/editor/top-toolbar/canvas-top-bar";
import { CanvasAssetsDrawer } from "@/components/editor/left-panel/canvas-assets-drawer";
import { CanvasPropertiesInspector } from "@/components/editor/right-panel/canvas-properties-inspector";
import { EditorOnboardingTour } from "@/components/editor/editor-onboarding-tour";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackCenter,
} from "@/components/shared";

const CanvasStage = dynamic(
  () => import("@/components/editor/canvas-area/canvas-stage").then((mod) => mod.CanvasStage),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          width: 390,
          height: 780,
          backgroundColor: "#FAF8F5",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
          border: "2px solid #E5D5BC",
        }}
      />
    ),
  }
);

export interface EditorPageProps {
  params: {
    "card-id": string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  const cardId = params["card-id"] || "minh-quan-thanh-truc";

  const {
    document,
    selectedId,
    selectedIds,
    selectedLayer,
    scale,
    setScale,
    canUndo,
    canRedo,
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
    saveStatus,
    lastSavedTime,
  } = useCanvasEditor(undefined, cardId);

  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [runTour, setRunTour] = useState(false);

  // Auto trigger tour on first visit
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const tourSeen = localStorage.getItem("inviteme_editor_tour_seen");
      if (!tourSeen) {
        const timer = setTimeout(() => setRunTour(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/i/${cardId}`;
    navigator.clipboard.writeText(url);
    setSnackbarMessage("Đã sao chép liên kết thiệp công khai!");
  };

  const viewportRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll viewport smoothly to selected layer position
  React.useEffect(() => {
    if (selectedId && viewportRef.current) {
      const selected = document.layers.find((l) => l.id === selectedId);
      if (selected && typeof selected.y === "number") {
        const targetScrollTop = Math.max(0, selected.y * scale - 140);
        viewportRef.current.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [selectedId, scale, document.layers]);

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#F7F8FA" }}>
      {/* Interactive Joyride Onboarding Tour */}
      <EditorOnboardingTour run={runTour} onFinish={() => setRunTour(false)} />

      {/* 1. Canvas Top Bar */}
      <CanvasTopBar
        title={document.title}
        slug={cardId}
        canUndo={canUndo}
        canRedo={canRedo}
        scale={scale}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        onScaleChange={setScale}
        onUndo={undo}
        onRedo={redo}
        onPublish={() => setPublishDialogOpen(true)}
        onAddLength={() => expandCanvasHeight(300)}
        onStartTour={() => setRunTour(true)}
      />

      {/* 2. Main Workspace: Left Assets Drawer + Center Stage + Right Properties Inspector */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Left: Assets Drawer (Danh Sách Lớp, Mẫu Chữ, Họa Tiết, Hiệu Ứng, Khung Hình, Tải Ảnh, Màu Nền) */}
        <CanvasAssetsDrawer
          layers={document.layers}
          selectedId={selectedId}
          selectedIds={selectedIds}
          openingEffect={document.openingEffect}
          ambientParticle={document.ambientParticle}
          onSelectLayer={selectLayer}
          onUpdateLayer={updateLayer}
          onGroupLayers={groupLayers}
          onUngroupLayers={ungroupLayers}
          onDeleteLayer={deleteLayer}
          onDuplicateLayer={duplicateLayer}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onSetOpeningEffect={setOpeningEffect}
          onSetAmbientParticle={setAmbientParticle}
          onAddText={addTextLayer}
          onAddSticker={addStickerLayer}
          onAddShape={addShapeLayer}
          onAddImage={addImageLayer}
          onAddCalendar={addCalendarLayer}
          onAddTimeline={addTimelineLayer}
          onAddCountdown={addCountdownLayer}
          onAddEventInfo={addEventInfoLayer}
          onSetBackground={setBackgroundColor}
        />

        {/* Center: Scrollable Stage Viewport */}
        <Box
          ref={viewportRef}
          sx={{
            flex: 1,
            height: "100%",
            backgroundColor: "#F0F2F5",
            overflowY: "auto",
            p: { xs: 2, sm: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundImage: `radial-gradient(#D5D9E2 1.5px, transparent 1.5px)`,
            backgroundSize: "24px 24px",
            position: "relative",
          }}
        >
          <CanvasStage
            document={document}
            selectedId={selectedId}
            selectedIds={selectedIds}
            scale={scale}
            onSelectLayer={selectLayer}
            onUpdateLayer={updateLayer}
            onMoveMultipleLayers={moveMultipleLayers}
            onGroupLayers={groupLayers}
            onUngroupLayers={ungroupLayers}
            onDuplicateLayer={duplicateLayer}
            onDeleteLayer={deleteLayer}
          />
        </Box>

        {/* Right: Properties Inspector (Thuộc Tính Layer Đang Chọn) */}
        <CanvasPropertiesInspector
          selectedLayer={selectedLayer}
          canvasBg={document.backgroundColor}
          canvasHeight={document.height}
          ambientParticle={document.ambientParticle}
          openingEffect={document.openingEffect}
          onUpdateLayer={updateLayer}
          onDeleteLayer={deleteLayer}
          onDuplicateLayer={duplicateLayer}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onDeselect={() => selectLayer(null)}
          onSetBackground={setBackgroundColor}
          onSetOpeningEffect={setOpeningEffect}
          onSetAmbientParticle={setAmbientParticle}
          onExpandHeight={expandCanvasHeight}
        />
      </Box>

      {/* 4. Publish Dialog */}
      <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", pt: 4 }}>
          <StackCenter
            sx={{
              width: 56,
              height: 56,
              borderRadius: "9999px",
              backgroundColor: "#E6F4EA",
              color: "#137333",
              mx: "auto",
              mb: 1.5,
            }}
          >
            <IconElement name="Check" size="md" />
          </StackCenter>
          <HeadingElement variant="h4" weight="bold">
            Xuất Bản Thiệp Thành Công!
          </HeadingElement>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 4 }}>
          <TextElement size="md" colorVariant="secondary" sx={{ mb: 3 }}>
            Thiệp cưới Canvas của bạn đã sẵn sàng chia sẻ đến bạn bè và người thân:
          </TextElement>

          <Box
            sx={{
              p: 2,
              backgroundColor: "#FAF6F0",
              borderRadius: "12px",
              border: "1px solid #EADCC9",
              wordBreak: "break-all",
              fontWeight: 600,
              color: "#B78628",
              mb: 2,
            }}
          >
            {typeof window !== "undefined" ? `${window.location.origin}/i/${cardId}` : `/i/${cardId}`}
          </Box>
        </DialogContent>

        <DialogActions sx={{ pb: 4, px: 4, justifyContent: "center", gap: 2 }}>
          <ButtonElement variant="outline" size="medium" rounded="md" onClick={handleCopyPublicLink} leftIcon={<IconElement name="ContentCopy" size="xs" />}>
            Sao Chép Link
          </ButtonElement>
          <ButtonElement
            component="a"
            href={`/i/${cardId}`}
            target="_blank"
            variant="gradient"
            size="medium"
            rounded="md"
            leftIcon={<IconElement name="Visibility" size="xs" />}
          >
            Xem Thiệp Trên Mobile
          </ButtonElement>
        </DialogActions>
      </Dialog>

      {/* Toast Snackbar */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3500}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarMessage(null)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
