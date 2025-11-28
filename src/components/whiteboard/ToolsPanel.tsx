import { Pen, Eraser, Trash2 } from 'lucide-react';
import { ToolType } from '@/types/whiteboard';
import { ToolButton } from './ToolButton';
import { ColorPicker } from './ColorPicker';
import { BrushSizeSlider } from './BrushSizeSlider';

interface ToolsPanelProps {
  activeTool: ToolType;
  color: string;
  brushSize: number;
  onToolChange: (tool: ToolType) => void;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
}

export const ToolsPanel = ({
  activeTool,
  color,
  brushSize,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onClear,
}: ToolsPanelProps) => {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-3 flex flex-col items-center gap-1">
        {/* Drawing Tools Section */}
        <div className="space-y-1">
          <ToolButton
            icon={Pen}
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
        </div>
        
        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />
        
        {/* Color Picker */}
        <ColorPicker color={color} onChange={onColorChange} />
        
        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />
        
        {/* Brush Size */}
        <BrushSizeSlider size={brushSize} onChange={onBrushSizeChange} />
        
        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />
        
        {/* Clear Button */}
        <ToolButton
          icon={Trash2}
          label="Clear"
          onClick={onClear}
          variant="destructive"
        />
      </div>
    </div>
  );
};
