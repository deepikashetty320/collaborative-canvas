import { Pencil, Eraser, Trash2, Square, Circle, Minus, Type, Undo2, Redo2, Download, FileText, GripHorizontal } from 'lucide-react';
import { ToolType } from '@/types/whiteboard';
import { ToolButton } from './ToolButton';
import { ColorPicker } from './ColorPicker';
import { BrushSizeSlider } from './BrushSizeSlider';
import { jsPDF } from 'jspdf';
import { useDraggable } from '@/hooks/useDraggable';

interface ToolsPanelProps {
  activeTool: ToolType;
  color: string;
  brushSize: number;
  onToolChange: (tool: ToolType) => void;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const ToolsPanel = ({
  activeTool,
  color,
  brushSize,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onClear,
  onUndo,
  onRedo,
  canvasRef,
}: ToolsPanelProps) => {
  const { position, isDragging, elementRef, handleMouseDown } = useDraggable({
    initialPosition: { x: window.innerWidth - 200, y: window.innerHeight / 2 - 200 },
    storageKey: 'deep-boards-tools-position',
    boundToViewport: true,
  });
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `deep-boards-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`deep-boards-${Date.now()}.pdf`);
  };

  return (
    <div 
      ref={elementRef}
      className="fixed z-10"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'auto',
      }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-4 flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
        {/* Drag Handle */}
        <div 
          className="flex justify-center items-center py-1 -mt-1 mb-1 cursor-grab active:cursor-grabbing select-none group"
          onMouseDown={handleMouseDown}
        >
          <div className="flex gap-1 items-center px-4 py-1 rounded-full bg-muted/50 group-hover:bg-muted transition-colors">
            <GripHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium">Drag</span>
          </div>
        </div>

        {/* Undo/Redo Bar */}
        <div className="flex justify-center gap-2 pb-2 border-b border-border/30">
          <ToolButton
            icon={Undo2}
            label="Undo"
            onClick={onUndo}
          />
          <ToolButton
            icon={Redo2}
            label="Redo"
            onClick={onRedo}
          />
        </div>

        {/* Tools Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-2">
          <ToolButton
            icon={Pencil}
            label="Pen"
            isActive={activeTool === 'pen'}
            onClick={() => onToolChange('pen')}
          />
          <ToolButton
            icon={Eraser}
            label="Eraser"
            isActive={activeTool === 'eraser'}
            onClick={() => onToolChange('eraser')}
          />
          <ToolButton
            icon={Square}
            label="Rectangle"
            isActive={activeTool === 'rectangle'}
            onClick={() => onToolChange('rectangle')}
          />
          <ToolButton
            icon={Circle}
            label="Circle"
            isActive={activeTool === 'circle'}
            onClick={() => onToolChange('circle')}
          />
          <ToolButton
            icon={Minus}
            label="Line"
            isActive={activeTool === 'line'}
            onClick={() => onToolChange('line')}
          />
          <ToolButton
            icon={Type}
            label="Text"
            isActive={activeTool === 'text'}
            onClick={() => onToolChange('text')}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        {/* Color & Brush Section */}
        <div className="flex flex-col items-center gap-3">
          <ColorPicker color={color} onChange={onColorChange} />
          <BrushSizeSlider size={brushSize} onChange={onBrushSizeChange} />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <ToolButton
            icon={Trash2}
            label="Clear"
            onClick={onClear}
            variant="destructive"
          />
          <ToolButton
            icon={Download}
            label="PNG"
            onClick={handleDownloadPNG}
          />
          <ToolButton
            icon={FileText}
            label="PDF"
            onClick={handleDownloadPDF}
          />
        </div>
      </div>
    </div>
  );
};
