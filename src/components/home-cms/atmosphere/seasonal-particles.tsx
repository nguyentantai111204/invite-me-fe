"use client";

import React, { useEffect, useRef } from "react";
import { SeasonalEffectType } from "@/interfaces/home-cms.interface";

interface ISeasonalParticlesProps {
  effect: SeasonalEffectType;
}

interface IParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  character?: string;
  color?: string;
}

const EFFECT_CONFIGS: Record<
  SeasonalEffectType,
  { count: number; chars: string[]; colors: string[] }
> = {
  none: { count: 0, chars: [], colors: [] },
  tet: {
    count: 14,
    chars: ["🌸", "🌼", "✨"],
    colors: ["#D4AF37", "#FFD700", "#FAAD14"],
  },
  noel: {
    count: 18,
    chars: ["❄️", "✨", "⭐"],
    colors: ["#FFFFFF", "#E6F7FF"],
  },
  wedding: {
    count: 12,
    chars: ["🌸", "✨", "💖"],
    colors: ["#DE7C66", "#D4AF37"],
  },
  sakura: {
    count: 15,
    chars: ["🌸", "💮"],
    colors: ["#FFB7C5", "#FFF0F3"],
  },
  fireworks: {
    count: 16,
    chars: ["✨", "🌟", "💫"],
    colors: ["#FFD700", "#FF4D4F", "#73D13D"],
  },
};

export const SeasonalParticles: React.FC<ISeasonalParticlesProps> = ({ effect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effect === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const config = EFFECT_CONFIGS[effect] || EFFECT_CONFIGS.none;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: IParticle[] = Array.from({ length: config.count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 6 + 12,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.3 + 0.2,
      character: config.chars[Math.floor(Math.random() * config.chars.length)],
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.character) {
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.character, 0, 0);
        }

        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effect]);

  if (effect === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
};
