"use client";

import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { usePublicInvitation } from "@/hooks/use-public-invitation.hook";
import { MOCK_PUBLIC_INVITATION } from "@/components/invitation-view/mock-invitation.data";
import { Envelope3dExperience } from "@/components/invitation-view/envelope-3d-experience";
import { InvitationCardRenderer } from "@/components/invitation-view/invitation-card-renderer";
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

  // Sử dụng dữ liệu backend hoặc fallback dữ liệu demo mẫu phong phú
  const displayInvitation = invitation || MOCK_PUBLIC_INVITATION;

  if (isLoading && !displayInvitation) {
    return (
      <StackCenter sx={{ minHeight: "100vh", backgroundColor: "#FAF8F5" }}>
        <CircularProgress sx={{ color: "#B78628" }} />
      </StackCenter>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      {/* 1. Màn Trình Diễn Mở Phong Bì 3D Đầu Tiên */}
      {!isEnvelopeOpened && (
        <Envelope3dExperience
          invitation={displayInvitation}
          guestName={guestName}
          onOpened={() => setIsEnvelopeOpened(true)}
        />
      )}

      {/* 2. Toàn Bộ Nội Dung Thiệp Cưới Chi Tiết */}
      <InvitationCardRenderer invitation={displayInvitation} />
    </Box>
  );
}
