export type CanvasLayerType = "text" | "image" | "sticker" | "shape";

export interface ICanvasLayerBase {
  id: string;
  type: CanvasLayerType;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  zIndex: number;
  isLocked: boolean;
  isHidden: boolean;
  opacity?: number;
}

export interface ICanvasTextLayer extends ICanvasLayerBase {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  textAlign: "left" | "center" | "right";
  fontWeight?: "normal" | "bold" | "300" | "400" | "500" | "600" | "700" | "800";
  fontStyle?: "normal" | "italic";
  letterSpacing?: number;
  lineHeight?: number;
}

export interface ICanvasImageLayer extends ICanvasLayerBase {
  type: "image";
  src: string;
  borderRadius?: number;
}

export interface ICanvasStickerLayer extends ICanvasLayerBase {
  type: "sticker";
  stickerType: "emoji" | "svg" | "ornament";
  content: string; // Emoji character or SVG path/url
  fontSize?: number;
  fill?: string;
}

export interface ICanvasShapeLayer extends ICanvasLayerBase {
  type: "shape";
  shapeType: "rect" | "circle" | "line" | "divider";
  fill: string;
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
  width: number; // Default 390
  height: number; // Default 780
  backgroundColor: string;
  backgroundImage?: string;
  layers: ICanvasLayer[];
}
