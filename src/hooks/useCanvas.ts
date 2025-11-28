import { useRef, useCallback, useEffect, useState } from 'react';
import { Point, DrawData, ToolType, CanvasState, HistoryState } from '@/types/whiteboard';

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
  undo: () => void;
  redo: () => void;
  tool: ToolType;
  color: string;
  brushSize: number;
  cursorPosition: Point | null;
}

export const useCanvas = ({ onDraw }: UseCanvasProps = {}): UseCanvasReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState('#1a1a2e');
  const [brushSize, setBrushSize] = useState(4);
  const [cursorPosition, setCursorPosition] = useState<Point | null>(null);

  const historyRef = useRef<HistoryState[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const canvasStateRef = useRef<CanvasState>({
    isDrawing: false,
    lastPosition: null,
    startPosition: null,
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

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push({ canvasData: imageData });

    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current++;
    }
  }, [getContext]);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;

    historyIndexRef.current--;
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const historyState = historyRef.current[historyIndexRef.current];
    ctx.putImageData(historyState.canvasData, 0, 0);
  }, [getContext]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    historyIndexRef.current++;
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const historyState = historyRef.current[historyIndexRef.current];
    ctx.putImageData(historyState.canvasData, 0, 0);
  }, [getContext]);

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

  const drawShape = useCallback((start: Point, end: Point, shapeType: ToolType, strokeColor: string, strokeWidth: number) => {
    const ctx = getContext();
    if (!ctx) return;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (shapeType === 'rectangle') {
      const width = end.x - start.x;
      const height = end.y - start.y;
      ctx.strokeRect(start.x, start.y, width, height);
    } else if (shapeType === 'circle') {
      const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shapeType === 'line') {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }, [getContext]);

  const drawText = useCallback((position: Point, text: string, textColor: string, fontSize: number) => {
    const ctx = getContext();
    if (!ctx || !text) return;

    ctx.font = `${fontSize * 3}px Inter, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    ctx.fillText(text, position.x, position.y);
  }, [getContext]);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const position = getPosition(e);

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        drawText(position, text, color, brushSize);
        saveToHistory();

        if (onDraw) {
          onDraw({
            from: position,
            to: position,
            color,
            brushSize,
            tool,
            text,
          });
        }
      }
      return;
    }

    if (['rectangle', 'circle', 'line'].includes(tool)) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = canvas.width;
      previewCanvas.height = canvas.height;
      const previewCtx = previewCanvas.getContext('2d');
      if (previewCtx) {
        const ctx = getContext();
        if (ctx) {
          previewCtx.drawImage(canvas, 0, 0);
        }
      }

      canvasStateRef.current = {
        isDrawing: true,
        lastPosition: position,
        startPosition: position,
        previewCanvas,
      };
    } else {
      canvasStateRef.current = {
        isDrawing: true,
        lastPosition: position,
        startPosition: position,
      };
    }
  }, [getPosition, tool, color, brushSize, drawText, saveToHistory, onDraw, getContext]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const currentPosition = getPosition(e);
    setCursorPosition(currentPosition);

    if (!canvasStateRef.current.isDrawing || !canvasStateRef.current.lastPosition) return;

    if (['rectangle', 'circle', 'line'].includes(tool) && canvasStateRef.current.startPosition) {
      const canvas = canvasRef.current;
      const ctx = getContext();
      if (!canvas || !ctx || !canvasStateRef.current.previewCanvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvasStateRef.current.previewCanvas, 0, 0);

      drawShape(canvasStateRef.current.startPosition, currentPosition, tool, color, brushSize);
    } else if (tool === 'pen' || tool === 'eraser') {
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
    }
  }, [color, brushSize, tool, drawLine, drawShape, getPosition, onDraw, getContext]);

  const stopDrawing = useCallback(() => {
    if (canvasStateRef.current.isDrawing) {
      if (['rectangle', 'circle', 'line'].includes(tool) && canvasStateRef.current.startPosition && canvasStateRef.current.lastPosition) {
        const drawData: DrawData = {
          from: canvasStateRef.current.startPosition,
          to: canvasStateRef.current.lastPosition,
          color,
          brushSize,
          tool,
          width: canvasStateRef.current.lastPosition.x - canvasStateRef.current.startPosition.x,
          height: canvasStateRef.current.lastPosition.y - canvasStateRef.current.startPosition.y,
        };

        if (onDraw) {
          onDraw(drawData);
        }
      }

      saveToHistory();
    }

    canvasStateRef.current = {
      isDrawing: false,
      lastPosition: null,
      startPosition: null,
      previewCanvas: undefined,
    };
  }, [tool, color, brushSize, saveToHistory, onDraw]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, [getContext, saveToHistory]);

  const drawFromRemote = useCallback((data: DrawData) => {
    if (data.tool === 'text' && data.text) {
      drawText(data.from, data.text, data.color, data.brushSize);
    } else if (['rectangle', 'circle', 'line'].includes(data.tool)) {
      drawShape(data.from, data.to, data.tool, data.color, data.brushSize);
    } else {
      drawLine(data.from, data.to, data.color, data.brushSize, data.tool === 'eraser');
    }
  }, [drawLine, drawShape, drawText]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, [saveToHistory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

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
    undo,
    redo,
    tool,
    color,
    brushSize,
    cursorPosition,
  };
};
