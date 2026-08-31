"use client";

import React, { useState, useRef } from "react";
import { Box, IconButton, Tooltip, keyframes } from "@mui/material";
import { IBgmMusicConfig } from "@/interfaces/home-cms.interface";
import { COLOR, SHADOW, RADIUS } from "@/constants/style.constant";
import { TextElement, IconElement } from "@/components/shared";

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(183, 134, 40, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(183, 134, 40, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(183, 134, 40, 0); }
`;

const musicWave = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 16px; }
`;

interface IBgmAudioPlayerProps {
  config?: IBgmMusicConfig;
}

export const BgmAudioPlayer: React.FC<IBgmAudioPlayerProps> = ({ config }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!config?.enabled || !config.url) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("[BGM] Audio playback error:", err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        border: `1.5px solid ${COLOR.borderGold}`,
        borderRadius: RADIUS.full,
        px: 1.5,
        py: 0.8,
        boxShadow: SHADOW.lg,
      }}
    >
      <audio
        ref={audioRef}
        src={config.url}
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <Tooltip title={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc nền"}>
        <IconButton
          onClick={togglePlay}
          size="small"
          sx={{
            background: COLOR.btnGradient,
            color: COLOR.textInverse,
            animation: isPlaying ? `${pulseAnimation} 2s infinite` : "none",
            "&:hover": {
              background: COLOR.btnHoverGradient,
            },
          }}
        >
          <IconElement
            name={isPlaying ? "Pause" : "MusicNote"}
            size="sm"
          />
        </IconButton>
      </Tooltip>

      <Box
        onClick={togglePlay}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: "2px", height: 16 }}>
          {[0.2, 0.4, 0.1, 0.5].map((delay, idx) => (
            <Box
              key={idx}
              sx={{
                width: 2,
                backgroundColor: isPlaying ? COLOR.gold.main : COLOR.textTertiary,
                borderRadius: 1,
                height: isPlaying ? 14 : 4,
                animation: isPlaying ? `${musicWave} 1s ease-in-out infinite` : "none",
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </Box>
        <TextElement
          size="xs"
          weight="medium"
          colorVariant="secondary"
          sx={{ ml: 0.5 }}
        >
          {config.title || "Nhạc nền"}
        </TextElement>
      </Box>

      {isPlaying && (
        <Tooltip title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}>
          <IconButton size="small" onClick={toggleMute} sx={{ color: COLOR.textSecondary, p: 0.5 }}>
            <IconElement name={isMuted ? "VolumeOff" : "VolumeUp"} size="xs" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
