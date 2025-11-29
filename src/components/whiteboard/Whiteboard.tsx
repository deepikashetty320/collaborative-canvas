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
    undo,
    redo,
    tool,
    color,
    brushSize,
    cursorPosition,
  } = useCanvas({
    onDraw: (data) => {
      emitDraw(data);
    },
  });

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

      {/* Floating "Deep Boards" Title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <h1 className="text-[12rem] font-black tracking-tight opacity-[0.03] select-none whitespace-nowrap">
          Deep Boards
        </h1>
      </div>

      {/* Glassmorphism Title Bar - Top Center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
        <div className="relative px-8 py-4 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/40 shadow-2xl">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 blur-xl -z-10" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6 text-white relative z-10"
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
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-primary to-purple-700 bg-clip-text text-transparent tracking-tight">
                Deep Boards
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Real-time collaborative whiteboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <ConnectionStatus isConnected={isConnected} />
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg border-2 border-white/60">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-semibold border border-gray-300">Ctrl</kbd>
            <span className="text-muted-foreground">+</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-semibold border border-gray-300">Z</kbd>
            <span className="text-muted-foreground font-medium ml-1">Undo</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-semibold border border-gray-300">Ctrl</kbd>
            <span className="text-muted-foreground">+</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-semibold border border-gray-300">Y</kbd>
            <span className="text-muted-foreground font-medium ml-1">Redo</span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <Canvas
        canvasRef={canvasRef}
        tool={tool}
        brushSize={brushSize}
        color={color}
        cursorPosition={cursorPosition}
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
        onUndo={undo}
        onRedo={redo}
        canvasRef={canvasRef}
      />
    </div>
  );
};
