import React from "react";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AppThemeProvider } from "@/components/shared/theme-provider";
import { ReduxProvider } from "@/store/provider";

export const metadata: Metadata = {
  title: "InviteMe Editor - Thiết kế thiệp trực tuyến",
  description: "Công cụ thiết kế và chỉnh sửa thiệp mời điện tử thông minh, sang trọng.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppRouterCacheProvider>
          <AppThemeProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
