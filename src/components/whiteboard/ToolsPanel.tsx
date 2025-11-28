import { Pencil, Eraser, Trash2 } from 'lucide-react';
import { ToolType } from '@/types/whiteboard';
import { ToolButton } from './ToolButton';
import { ColorPicker } from './ColorPicker';
import { BrushSizeSlider } from './BrushSizeSlider';
import { cn } from '@/lib/utils';

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
    <aside 
      className={cn(
        'flex flex-col items-center gap-2 p-3',
        'bg-toolbar border-l border-toolbar-border',
        'shadow-toolbar h-full'
      )}
    >
      <div className="flex flex-col items-center gap-1 pb-3 border-b border-toolbar-border">
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

      <div className="flex flex-col items-center gap-1 py-3 border-b border-toolbar-border">
        <ColorPicker color={color} onChange={onColorChange} />
        <BrushSizeSlider size={brushSize} onChange={onBrushSizeChange} />
      </div>

      <div className="flex flex-col items-center gap-1 pt-3 mt-auto">
        <ToolButton
          icon={Trash2}
          label="Clear"
          onClick={onClear}
          variant="destructive"
        />
      </div>
    </aside>
  );
};
