"use client";

import React from "react";
import { Container, Button } from "@mui/material";
import Link from "next/link";
import { StackColAlignJustCenter, HeadingElement, TextElement } from "@/components/shared";

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <StackColAlignJustCenter spacing={3}>
        <HeadingElement variant="h3" weight="bold" gradient="gold">
          InviteMe Card Editor
        </HeadingElement>
        <TextElement colorVariant="secondary" align="center" sx={{ maxWidth: 600 }}>
          Nền tảng thiết kế và chỉnh sửa thiệp mời điện tử trực quan, hiện đại và chuẩn hóa.
        </TextElement>
        <Button
          component={Link}
          href="/editor/demo-card"
          variant="contained"
          size="large"
        >
          Mở Editor Thiết Kế
        </Button>
      </StackColAlignJustCenter>
    </Container>
  );
}
