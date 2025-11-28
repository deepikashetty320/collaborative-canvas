import { useRef, useCallback, useEffect, useState } from 'react';
import { Point, DrawData, ToolType, CanvasState } from '@/types/whiteboard';

interface UseCanvasProps {
  onDraw?: (data: DrawData) => void;
}

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  startDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  draw: (e: React.MouseEvent | React.TouchEvent) => void;
  stopDrawing: () => void;
  clearCanvas: () => void;
  drawFromRemote: (data: DrawData) => void;
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  tool: ToolType;
  color: string;
  brushSize: number;
}

export const useCanvas = ({ onDraw }: UseCanvasProps = {}): UseCanvasReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState('#1a1a2e');
  const [brushSize, setBrushSize] = useState(4);
  
  const canvasStateRef = useRef<CanvasState>({
    isDrawing: false,
    lastPosition: null,
  });

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const drawLine = useCallback((from: Point, to: Point, strokeColor: string, strokeWidth: number, isEraser: boolean) => {
    const ctx = getContext();
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = isEraser ? '#ffffff' : strokeColor;
    ctx.lineWidth = isEraser ? strokeWidth * 3 : strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }, [getContext]);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const position = getPosition(e);
    canvasStateRef.current = {
      isDrawing: true,
      lastPosition: position,
    };
  }, [getPosition]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasStateRef.current.isDrawing || !canvasStateRef.current.lastPosition) return;

    const currentPosition = getPosition(e);
    const lastPosition = canvasStateRef.current.lastPosition;

    const drawData: DrawData = {
      from: lastPosition,
      to: currentPosition,
      color,
      brushSize,
      tool,
    };

    drawLine(lastPosition, currentPosition, color, brushSize, tool === 'eraser');
    canvasStateRef.current.lastPosition = currentPosition;

    if (onDraw) {
      onDraw(drawData);
    }
  }, [color, brushSize, tool, drawLine, getPosition, onDraw]);

  const stopDrawing = useCallback(() => {
    canvasStateRef.current = {
      isDrawing: false,
      lastPosition: null,
    };
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [getContext]);

  const drawFromRemote = useCallback((data: DrawData) => {
    drawLine(data.from, data.to, data.color, data.brushSize, data.tool === 'eraser');
  }, [drawLine]);

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    drawFromRemote,
    setTool,
    setColor,
    setBrushSize,
    tool,
    color,
    brushSize,
  };
};
