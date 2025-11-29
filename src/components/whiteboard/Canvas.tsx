import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ToolType, Point } from '@/types/whiteboard';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tool: ToolType;
  brushSize: number;
  color: string;
  cursorPosition: Point | null;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export const Canvas = ({
  canvasRef,
  tool,
  brushSize,
  color,
  cursorPosition,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const rect = container.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.putImageData(imageData, 0, 0);
    };

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef]);

  const getCursorStyle = () => {
    if (tool === 'text') return 'cursor-text';
    if (['rectangle', 'circle', 'line'].includes(tool)) return 'cursor-crosshair';
    return 'cursor-none';
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden m-4 mr-24 rounded-3xl shadow-2xl"
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => setShowCursor(false)}
    >
      {/* Canvas background with subtle pattern */}
      <div className="absolute inset-0 bg-canvas dark:bg-canvas">
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.3) 1px, transparent 0)
            `,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        className={cn(
          'absolute inset-0 touch-none z-10',
          getCursorStyle()
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Custom Brush Cursor */}
      {showCursor && cursorPosition && (tool === 'pen' || tool === 'eraser') && (
        <div
          className="absolute pointer-events-none z-20 transition-opacity duration-200"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className={cn(
              'rounded-full border-2 transition-all duration-150',
              tool === 'eraser'
                ? 'bg-white/80 border-gray-400 shadow-lg'
                : 'bg-transparent border-current shadow-lg'
            )}
            style={{
              width: tool === 'eraser' ? brushSize * 3 : brushSize * 2,
              height: tool === 'eraser' ? brushSize * 3 : brushSize * 2,
              borderColor: tool === 'eraser' ? '#9ca3af' : color,
            }}
          >
            {tool === 'pen' && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: Math.max(2, brushSize / 2),
                  height: Math.max(2, brushSize / 2),
                  backgroundColor: color,
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
