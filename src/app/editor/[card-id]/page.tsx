"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { ErrorBoundary } from "@/components/shared/error-boundary/error-boundary";
import { StackCenter, StackColAlignJustCenter } from "@/components/shared/stack-custom/stack-custom";

export interface EditorPageProps {
  params: {
    "card-id": string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  const cardId = params["card-id"];

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <ErrorBoundary>
        <StackCenter sx={{ flex: 1, backgroundColor: "background.default" }}>
          <StackColAlignJustCenter spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Canvas Editor Workspace
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đang làm việc với Card ID: {cardId}
            </Typography>
          </StackColAlignJustCenter>
        </StackCenter>
      </ErrorBoundary>
    </Box>
  );
}
