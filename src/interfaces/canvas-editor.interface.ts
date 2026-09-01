export type CanvasLayerType = "text" | "image" | "sticker" | "shape";

export type CanvasElementAnimationType =
  | "none"
  | "fade-in"
  | "slide-up"
  | "zoom-in"
  | "bounce"
  | "shimmer";

export type CanvasOpeningEffectType =
  | "envelope-3d"
  | "gate-fold"
  | "scroll"
  | "fade";

export type CanvasAmbientParticleType =
  | "none"
  | "sakura"
  | "gold-dust"
  | "hearts"
  | "snow";

export interface ICanvasBaseLayer {
  id: string;
  type: CanvasLayerType;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  zIndex: number;
  isLocked?: boolean;
  isHidden?: boolean;
  opacity?: number;
  // Element animation
  animation?: CanvasElementAnimationType;
  animationDelay?: number;
}

export interface ICanvasTextLayer extends ICanvasBaseLayer {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  fontStyle?: "normal" | "italic";
  fill?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ICanvasImageLayer extends ICanvasBaseLayer {
  type: "image";
  src: string;
  borderRadius?: number;
}

export interface ICanvasStickerLayer extends ICanvasBaseLayer {
  type: "sticker";
  stickerType: "emoji" | "vector";
  content: string;
  fontSize?: number;
}

export interface ICanvasShapeLayer extends ICanvasBaseLayer {
  type: "shape";
  shapeType: "rect" | "circle" | "divider";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export type ICanvasLayer =
  | ICanvasTextLayer
  | ICanvasImageLayer
  | ICanvasStickerLayer
  | ICanvasShapeLayer;

export interface ICanvasDocument {
  id: string;
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  layers: ICanvasLayer[];
  // Invitation level effects
  openingEffect?: CanvasOpeningEffectType;
  ambientParticle?: CanvasAmbientParticleType;
  bgMusicUrl?: string;
}
