export type ToolType = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'text';

export interface Point {
  x: number;
  y: number;
}

export interface DrawData {
  from: Point;
  to: Point;
  color: string;
  brushSize: number;
  tool: ToolType;
  text?: string;
  width?: number;
  height?: number;
}

export interface CanvasState {
  isDrawing: boolean;
  lastPosition: Point | null;
  startPosition: Point | null;
  previewCanvas?: HTMLCanvasElement;
  textInput?: {
    position: Point;
    text: string;
  };
}

export interface HistoryState {
  canvasData: ImageData;
}

export interface ToolsState {
  activeTool: ToolType;
  color: string;
  brushSize: number;
}

// Socket events
export type SocketEvents = {
  draw: DrawData;
  clear: void;
};
