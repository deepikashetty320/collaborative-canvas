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
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-lg border border-white/50">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-5 h-5 text-white"
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
            <h1 className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Whiteboard
            </h1>
            <p className="text-[11px] text-muted-foreground font-medium">Real-time collaboration</p>
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
