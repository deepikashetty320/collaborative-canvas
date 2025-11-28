import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface BrushSizeSliderProps {
  size: number;
  onChange: (size: number) => void;
}

const MIN_SIZE = 1;
const MAX_SIZE = 30;

export const BrushSizeSlider = ({ size, onChange }: BrushSizeSliderProps) => {
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
        title={`Size: ${size}px`}
      >
        <div className="relative flex items-center justify-center w-5 h-5">
          <Circle 
            className="text-muted-foreground group-hover:text-foreground transition-colors"
            style={{ 
              width: Math.max(8, Math.min(20, size * 0.7)),
              height: Math.max(8, Math.min(20, size * 0.7)),
            }}
            fill="currentColor"
          />
        </div>
        <span className="text-[10px] mt-1 font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Size
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-full ml-3 top-0 z-50 animate-slide-in">
            <div className="bg-toolbar border border-toolbar-border rounded-xl p-4 shadow-toolbar min-w-[180px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Brush Size</span>
                <span className="text-sm text-muted-foreground">{size}px</span>
              </div>
              
              <input
                type="range"
                min={MIN_SIZE}
                max={MAX_SIZE}
                value={size}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{MIN_SIZE}px</span>
                <span>{MAX_SIZE}px</span>
              </div>

              {/* Preview */}
              <div className="mt-4 pt-4 border-t border-toolbar-border">
                <div className="flex items-center justify-center h-10">
                  <div 
                    className="rounded-full bg-foreground"
                    style={{ 
                      width: size,
                      height: size,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
