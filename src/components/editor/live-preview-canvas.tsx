"use client";

import React from "react";
import { Box } from "@mui/material";
import { IInvitation } from "@/interfaces/invitation.interface";
import { RADIUS, SHADOW } from "@/constants/style.constant";
import { InvitationCardRenderer } from "@/components/invitation-view/invitation-card-renderer";
import { StackCenter } from "@/components/shared";

interface ILivePreviewCanvasProps {
  invitation: IInvitation;
  viewMode: "mobile" | "desktop";
}

export const LivePreviewCanvas: React.FC<ILivePreviewCanvasProps> = ({ invitation, viewMode }) => {
  if (viewMode === "desktop") {
    return (
      <Box sx={{ flex: 1, height: "100%", overflowY: "auto", backgroundColor: "#F4EFE6" }}>
        <InvitationCardRenderer invitation={invitation} />
      </Box>
    );
  }

  return (
    <StackCenter
      sx={{
        flex: 1,
        height: "100%",
        backgroundColor: "#221D18",
        p: { xs: 1, sm: 3 },
        overflow: "hidden",
      }}
    >
      {/* Photorealistic iPhone 15 Pro Mockup Frame */}
      <Box
        sx={{
          width: { xs: "100%", sm: 395 },
          height: { xs: "100%", sm: 810 },
          maxHeight: "92vh",
          backgroundColor: "#161311",
          borderRadius: { xs: RADIUS.md, sm: "48px" },
          border: { xs: "none", sm: "10px solid #363028" },
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 0 4px 2px rgba(212, 175, 55, 0.3)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Dynamic Island Notch */}
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 105,
            height: 28,
            backgroundColor: "#000000",
            borderRadius: RADIUS.full,
            zIndex: 100,
          }}
        />

        {/* Phone Content Screen */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            height: "100%",
            overflowY: "auto",
            backgroundColor: invitation.themeConfig?.backgroundColor || "#FAF8F5",
            pt: { sm: 4 },
          }}
        >
          <InvitationCardRenderer invitation={invitation} />
        </Box>
      </Box>
    </StackCenter>
  );
};
