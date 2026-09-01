"use client";

import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { usePublicInvitation } from "@/hooks/use-public-invitation.hook";
import { MOCK_PUBLIC_INVITATION } from "@/components/invitation-view/mock-invitation.data";
import { Envelope3dExperience } from "@/components/invitation-view/envelope-3d-experience";
import { InvitationCardRenderer } from "@/components/invitation-view/invitation-card-renderer";
import { CanvasDocumentRenderer } from "@/components/invitation-view/canvas-document-renderer";
import { SeasonalParticles } from "@/components/home-cms/atmosphere/seasonal-particles";
import { ICanvasDocument } from "@/interfaces/canvas-editor.interface";
import { INITIAL_WEDDING_CANVAS } from "@/components/editor/preset-canvas-data";
import { StackCenter } from "@/components/shared";

export interface IPublicInvitationPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    guest?: string;
  };
}

export default function PublicInvitationPage({ params, searchParams }: IPublicInvitationPageProps) {
  const slug = params.slug;
  const guestName = searchParams?.guest;

  const { invitation, isLoading } = usePublicInvitation(slug);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [canvasDoc, setCanvasDoc] = useState<ICanvasDocument | null>(null);

  // Load live Studio Canvas Document from localStorage or Backend
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDoc = localStorage.getItem(`inviteme_canvas_${slug}`);
      if (savedDoc) {
        try {
          const parsed = JSON.parse(savedDoc) as ICanvasDocument;
          setCanvasDoc(parsed);
          return;
        } catch {
          // Fallback to preset
        }
      }
      // If demo-card or minh-quan-thanh-truc, load initial canvas
      if (slug === "minh-quan-thanh-truc" || slug === "demo-card") {
        setCanvasDoc(INITIAL_WEDDING_CANVAS);
      }
    }
  }, [slug]);

  // Sử dụng dữ liệu backend hoặc fallback dữ liệu demo mẫu phong phú
  const displayInvitation = invitation || MOCK_PUBLIC_INVITATION;

  const openingEffect = canvasDoc?.openingEffect || "envelope-3d";
  const ambientParticle = (canvasDoc?.ambientParticle || "wedding") as any;

  if (isLoading && !displayInvitation) {
    return (
      <StackCenter sx={{ minHeight: "100vh", backgroundColor: "#FAF8F5" }}>
        <CircularProgress sx={{ color: "#B78628" }} />
      </StackCenter>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      {/* 1. Ambient Falling Particles (Hoa Đào, Bụi Vàng, Trái Tim Bay) */}
      {ambientParticle !== "none" && (
        <SeasonalParticles effect={ambientParticle === "gold-dust" ? "fireworks" : ambientParticle} />
      )}

      {/* 2. Màn Trình Diễn Mở Bìa Thiệp 3D (Phong Bì, Cánh Cổng, Cuộn Thư, Fade) */}
      {!isEnvelopeOpened && (
        <Envelope3dExperience
          invitation={displayInvitation}
          openingEffect={openingEffect}
          guestName={guestName}
          onOpened={() => setIsEnvelopeOpened(true)}
        />
      )}

      {/* 3. Toàn Bộ Nội Dung Thiệp Cưới Chi Tiết (Canvas Hoặc Template) */}
      {canvasDoc ? (
        <CanvasDocumentRenderer document={canvasDoc} />
      ) : (
        <InvitationCardRenderer invitation={displayInvitation} />
      )}
    </Box>
  );
}
