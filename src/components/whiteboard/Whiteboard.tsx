import { useEffect } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { useSocket } from '@/hooks/useSocket';
import { Canvas } from './Canvas';
import { ToolsPanel } from './ToolsPanel';
import { ConnectionStatus } from './ConnectionStatus';
import { toast } from 'sonner';

export const Whiteboard = () => {
  const { isConnected, emitDraw, emitClear, onDraw, onClear } = useSocket();
  
  const {
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
  } = useCanvas({
    onDraw: (data) => {
      emitDraw(data);
    },
  });

  // Set up socket listeners
  useEffect(() => {
    onDraw((data) => {
      drawFromRemote(data);
    });

    onClear(() => {
      clearCanvas();
      toast.info('Board cleared by another user');
    });
  }, [onDraw, onClear, drawFromRemote, clearCanvas]);

  const handleClear = () => {
    clearCanvas();
    emitClear();
    toast.success('Board cleared');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <div className="flex items-center gap-3 bg-toolbar/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-toolbar border border-toolbar-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-5 h-5 text-primary-foreground"
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Whiteboard</h1>
            <p className="text-[10px] text-muted-foreground">Collaborate in real-time</p>
          </div>
        </div>
        <ConnectionStatus isConnected={isConnected} />
      </div>

      {/* Canvas Area */}
      <Canvas
        canvasRef={canvasRef}
        tool={tool}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Tools Panel */}
      <ToolsPanel
        activeTool={tool}
        color={color}
        brushSize={brushSize}
        onToolChange={setTool}
        onColorChange={setColor}
        onBrushSizeChange={setBrushSize}
        onClear={handleClear}
      />
    </div>
  );
};
