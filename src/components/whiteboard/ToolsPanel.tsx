import { Pencil, Eraser, Trash2, Square, Circle, Minus, Type, Undo2, Redo2 } from 'lucide-react';
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
  onUndo: () => void;
  onRedo: () => void;
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
}: ToolsPanelProps) => {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/60 p-3 flex flex-col items-center gap-1">
        {/* Undo/Redo Section */}
        <div className="space-y-1">
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

        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-2" />

        {/* Drawing Tools Section */}
        <div className="space-y-1">
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
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-2" />

        {/* Shape Tools Section */}
        <div className="space-y-1">
          <ToolButton
            icon={Square}
            label="Rect"
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
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-2" />

        {/* Color Picker */}
        <ColorPicker color={color} onChange={onColorChange} />

        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-2" />

        {/* Brush Size */}
        <BrushSizeSlider size={brushSize} onChange={onBrushSizeChange} />

        {/* Divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-2" />

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
