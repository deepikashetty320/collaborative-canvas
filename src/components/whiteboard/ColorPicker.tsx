import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#1a1a2e', // Dark blue-black
  '#16213e', // Dark navy
  '#0f3460', // Navy
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#64748b', // Slate
  '#ffffff', // White (for erasing visual feedback)
];

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'group flex flex-col items-center justify-center',
          'w-14 h-14 rounded-xl transition-all duration-200',
          'hover:bg-tool-hover border-2 border-transparent'
        )}
        title="Color"
      >
        <div className="relative">
          <Palette className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <div 
            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-toolbar"
            style={{ backgroundColor: color }}
          />
        </div>
        <span className="text-[10px] mt-1 font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Color
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-full ml-3 top-0 z-50 animate-slide-in">
            <div className="bg-toolbar border border-toolbar-border rounded-xl p-3 shadow-toolbar">
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => {
                      onChange(presetColor);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-8 h-8 rounded-lg transition-all duration-150',
                      'hover:scale-110 hover:shadow-md',
                      color === presetColor && 'ring-2 ring-primary ring-offset-2 ring-offset-toolbar'
                    )}
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-toolbar-border">
                <label className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Custom:</span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
