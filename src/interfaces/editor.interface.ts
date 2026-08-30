export type LayerType = "text" | "image" | "sticker" | "shape";

export interface ILayerBase {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  zIndex: number;
  isLocked: boolean;
  isHidden: boolean;
  opacity?: number;
}

export interface ITextLayer extends ILayerBase {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  textAlign: "left" | "center" | "right";
  fontWeight?: string | number;
  fontStyle?: "normal" | "italic";
  lineHeight?: number;
  letterSpacing?: number;
}

export interface IImageLayer extends ILayerBase {
  type: "image";
  src: string;
  width: number;
  height: number;
  borderRadius?: number;
}

export interface IStickerLayer extends ILayerBase {
  type: "sticker";
  src: string;
  width: number;
  height: number;
}

export interface IShapeLayer extends ILayerBase {
  type: "shape";
  shapeType: "rect" | "circle" | "line" | "star";
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export type ICardLayer = ITextLayer | IImageLayer | IStickerLayer | IShapeLayer;

export interface ICanvasCard {
  id: string;
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  layers: ICardLayer[];
}
