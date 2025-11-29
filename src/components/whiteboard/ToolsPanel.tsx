import { Pencil, Eraser, Trash2, Square, Circle, Minus, Type, Undo2, Redo2, Download, FileText, Palette, PenTool } from 'lucide-react';
import { ToolType } from '@/types/whiteboard';
import { ToolButton } from './ToolButton';
import { ColorPicker } from './ColorPicker';
import { BrushSizeSlider } from './BrushSizeSlider';
import { jsPDF } from 'jspdf';

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
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-4 flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
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
