export type CanvasLayerType =
  | "text"
  | "image"
  | "sticker"
  | "shape"
  | "calendar"
  | "timeline"
  | "countdown"
  | "event-info";

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
  groupId?: string;
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
  borderRadius?: number | string;
  border?: string;
  boxShadow?: string;
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

export interface ICanvasCalendarLayer extends ICanvasBaseLayer {
  type: "calendar";
  monthTitle: string; // "Tháng 11 / 2026"
  year: number; // 2026
  month: number; // 11
  startDayOfWeek?: number; // 0 for Sun, 1 for Mon (default 1)
  daysCount?: number; // 30
  selectedDay: number; // 20
  primaryColor?: string; // "#851C24"
  accentColor?: string; // "#D4AF37"
  textColor?: string; // "#4A3E31"
  backgroundColor?: string; // "#FFFFFF"
}

export interface ICanvasTimelineItem {
  time: string;
  title: string;
  subTitle?: string;
}

export interface ICanvasTimelineLayer extends ICanvasBaseLayer {
  type: "timeline";
  title?: string;
  items: ICanvasTimelineItem[];
  primaryColor?: string; // "#851C24"
  accentColor?: string; // "#D4AF37"
  textColor?: string; // "#3B2F23"
}

export interface ICanvasCountdownLayer extends ICanvasBaseLayer {
  type: "countdown";
  title?: string; // "Đếm ngược đến giờ sự kiện"
  targetDate?: string; // "2026-11-20T18:00:00"
  days?: number;
  hours?: number;
  minutes?: number;
  primaryColor?: string; // "#851C24"
  backgroundColor?: string; // "#FFFFFF"
}

export interface ICanvasEventInfoLayer extends ICanvasBaseLayer {
  type: "event-info";
  dateLabel?: string;
  dateValue: string; // "Chủ Nhật\n20.11.2026"
  timeLabel?: string;
  timeValue: string; // "Đón khách\n18:00"
  primaryColor?: string;
  accentColor?: string;
}

export type ICanvasLayer =
  | ICanvasTextLayer
  | ICanvasImageLayer
  | ICanvasStickerLayer
  | ICanvasShapeLayer
  | ICanvasCalendarLayer
  | ICanvasTimelineLayer
  | ICanvasCountdownLayer
  | ICanvasEventInfoLayer;

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
