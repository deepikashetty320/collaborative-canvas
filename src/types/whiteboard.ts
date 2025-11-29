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

// Chat types
export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

// Room types
export interface Room {
  id: string;
  name: string;
  userCount: number;
}

// Socket events
export type SocketEvents = {
  draw: DrawData;
  clear: void;
  chat: ChatMessage;
  'join-room': { roomId: string; username: string };
  'leave-room': { roomId: string };
  'room-users': { roomId: string; users: string[] };
};
