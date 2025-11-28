export type ToolType = 'pen' | 'eraser';

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
}

export interface CanvasState {
  isDrawing: boolean;
  lastPosition: Point | null;
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
