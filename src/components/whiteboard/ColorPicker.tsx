import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  '#ffffff', // White
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
        <div 
          className="w-7 h-7 rounded-full shadow-md transition-transform group-hover:scale-110 border-2 border-white/50"
          style={{ backgroundColor: color }}
        />
        <span className="text-[10px] mt-1.5 font-medium text-muted-foreground group-hover:text-foreground transition-colors">
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
            <div className="bg-toolbar/95 backdrop-blur-md border border-toolbar-border rounded-2xl p-4 shadow-xl">
              <p className="text-xs font-medium text-muted-foreground mb-3">Choose a color</p>
              <div className="grid grid-cols-4 gap-2.5">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => {
                      onChange(presetColor);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-9 h-9 rounded-full transition-all duration-200',
                      'hover:scale-125 hover:shadow-lg',
                      'border-2',
                      color === presetColor 
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-toolbar border-white/60 scale-110' 
                        : 'border-white/30 hover:border-white/60'
                    )}
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-toolbar-border">
                <label className="flex items-center gap-3 cursor-pointer group/custom">
                  <div 
                    className="w-9 h-9 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center overflow-hidden transition-all group-hover/custom:border-primary"
                    style={{ backgroundColor: color }}
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-14 h-14 cursor-pointer border-0 bg-transparent opacity-0"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground group-hover/custom:text-foreground transition-colors">Custom color</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
