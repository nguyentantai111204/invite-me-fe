import React from "react";
import { Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import { StackCenter, StackColAlignJustCenter } from "@/components/shared/stack-custom/stack-custom";

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <StackColAlignJustCenter spacing={3}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main" }}>
          InviteMe Card Editor
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", maxWidth: 600 }}>
          Nền tảng thiết kế và chỉnh sửa thiệp mời điện tử trực quan, hiện đại và chuẩn hóa.
        </Typography>
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
