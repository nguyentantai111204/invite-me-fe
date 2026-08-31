"use client";

import React from "react";
import { Box } from "@mui/material";
import { IHomeCmsConfig } from "@/interfaces/home-cms.interface";
import { Header, Footer } from "@/components/layout";
import { BLOCK_REGISTRY } from "./registry/block-registry";
import { SeasonalParticles } from "./atmosphere/seasonal-particles";
import { BgmAudioPlayer } from "./atmosphere/bgm-audio-player";
import { FestivalBanner } from "./atmosphere/festival-banner";

interface IHomeBlockRendererProps {
  config: IHomeCmsConfig;
}

export const HomeBlockRenderer: React.FC<IHomeBlockRendererProps> = ({ config }) => {
  const { atmosphere, blocks } = config;

  const activeBlocks = [...blocks]
    .filter((block) => block.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 1. Header Festival Notification Banner */}
      <FestivalBanner config={atmosphere?.festivalBanner} />

      {/* 2. Sticky Glassmorphism Header */}
      <Header />

      {/* 3. Seasonal Particle Atmospheric Canvas */}
      <SeasonalParticles effect={atmosphere?.effect || "none"} />

      {/* 4. Floating Background Music Player */}
      <BgmAudioPlayer config={atmosphere?.bgMusic} />

      {/* 5. Dynamic Section Blocks Rendered in Order */}
      <Box component="main" sx={{ flex: 1 }}>
        {activeBlocks.map((block) => {
          const Component = BLOCK_REGISTRY[block.type];

          if (!Component) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(`[HomeCMS] Unknown block type: "${block.type}"`);
            }
            return null;
          }

          return (
            <Box key={block.id} id={block.id} component="section">
              <Component data={block.data} styles={block.styles} />
            </Box>
          );
        })}
      </Box>

      {/* 6. Dark Luxury Footer */}
      <Footer />
    </Box>
  );
};
