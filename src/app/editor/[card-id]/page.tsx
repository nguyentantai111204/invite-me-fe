"use client";

import React, { useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, IconButton } from "@mui/material";
import dynamic from "next/dynamic";
import { useCanvasEditor } from "@/components/canvas-editor/use-canvas-editor.hook";
import { CanvasTopBar } from "@/components/canvas-editor/canvas-top-bar";
import { CanvasAssetsDrawer } from "@/components/canvas-editor/canvas-assets-drawer";
import { CanvasPropertiesInspector } from "@/components/canvas-editor/canvas-properties-inspector";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackCenter,
} from "@/components/shared";

const CanvasStage = dynamic(
  () => import("@/components/canvas-editor/canvas-stage").then((mod) => mod.CanvasStage),
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
    selectedLayer,
    scale,
    setScale,
    canUndo,
    canRedo,
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
    expandCanvasHeight,
    undo,
    redo,
  } = useCanvasEditor();

  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleCopyPublicLink = () => {
    if (typeof navigator !== "undefined") {
      const publicUrl = `${window.location.origin}/i/${cardId}`;
      navigator.clipboard.writeText(publicUrl);
      setSnackbarMessage(`Đã sao chép link thiệp: ${publicUrl}`);
    }
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#F7F8FA" }}>
      {/* 1. Canvas Top Bar */}
      <CanvasTopBar
        title={document.title}
        slug={cardId}
        canUndo={canUndo}
        canRedo={canRedo}
        scale={scale}
        onScaleChange={setScale}
        onUndo={undo}
        onRedo={redo}
        onPublish={() => setPublishDialogOpen(true)}
        onAddLength={() => expandCanvasHeight(300)}
      />

      {/* 2. Main Workspace: Left Assets Drawer + Center Stage + Right Properties Inspector */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Left: Assets Drawer (Mẫu Chữ, Họa Tiết, Khung Hình, Tải Ảnh, Màu Nền) */}
        <CanvasAssetsDrawer
          onAddText={addTextLayer}
          onAddSticker={addStickerLayer}
          onAddShape={addShapeLayer}
          onAddImage={addImageLayer}
          onSetBackground={setBackgroundColor}
        />

        {/* Center: Scrollable Stage Viewport */}
        <Box
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
            scale={scale}
            onSelectLayer={selectLayer}
            onUpdateLayer={updateLayer}
            onDuplicateLayer={duplicateLayer}
            onDeleteLayer={deleteLayer}
          />

          {/* Floating Bottom Undo/Redo Pill */}
          <Box
            sx={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              backgroundColor: "#FFFFFF",
              borderRadius: "9999px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid #ECE7DD",
              p: 0.5,
              px: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton size="small" onClick={undo} disabled={!canUndo}>
              <IconElement name="Undo" size="xs" />
            </IconButton>
            <IconButton size="small" onClick={redo} disabled={!canRedo}>
              <IconElement name="Redo" size="xs" />
            </IconButton>
          </Box>
        </Box>

        {/* Right: Properties Inspector (Thuộc Tính Layer Đang Chọn) */}
        <CanvasPropertiesInspector
          selectedLayer={selectedLayer}
          canvasBg={document.backgroundColor}
          canvasHeight={document.height}
          onUpdateLayer={updateLayer}
          onDeleteLayer={deleteLayer}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onDeselect={() => selectLayer(null)}
          onSetBackground={setBackgroundColor}
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
