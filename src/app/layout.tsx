import React from "react";
import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AppThemeProvider } from "@/components/shared/theme-provider";
import { ReduxProvider } from "@/store/provider";
import { siteConfig } from "@/config/site.config";
import { OrganizationJsonLd, WebApplicationJsonLd } from "@/components/shared/seo/json-ld";
import {
  fontSans,
  fontPlayfair,
  fontCormorant,
  fontGreatVibes,
  fontBeVietnamPro,
} from "@/config/fonts.config";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${fontSans.variable} ${fontPlayfair.variable} ${fontCormorant.variable} ${fontGreatVibes.variable} ${fontBeVietnamPro.variable}`}
    >
      <head>
        <OrganizationJsonLd />
        <WebApplicationJsonLd />
      </head>
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
