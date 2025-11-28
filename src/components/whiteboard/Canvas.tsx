import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ToolType } from '@/types/whiteboard';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tool: ToolType;
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
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Store current drawing
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Resize canvas
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Restore drawing (scaled)
      ctx.putImageData(imageData, 0, 0);
    };

    // Initial setup
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

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden m-4 mr-24 rounded-3xl shadow-2xl"
    >
      {/* Canvas background with subtle pattern */}
      <div className="absolute inset-0 bg-white">
        <div 
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, hsl(220 13% 80%) 1px, transparent 0)
            `,
            backgroundSize: '24px 24px',
          }}
        />
      </div>
      
      <canvas
        ref={canvasRef}
        className={cn(
          'absolute inset-0 touch-none z-10',
          tool === 'pen' && 'cursor-crosshair',
          tool === 'eraser' && 'cursor-cell'
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    </div>
  );
};
