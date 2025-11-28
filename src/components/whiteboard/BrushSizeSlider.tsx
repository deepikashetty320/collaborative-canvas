import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface BrushSizeSliderProps {
  size: number;
  onChange: (size: number) => void;
}

export const BrushSizeSlider = ({ size, onChange }: BrushSizeSliderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'group flex flex-col items-center justify-center',
          'w-14 h-14 rounded-2xl transition-all duration-200',
          'hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-50'
        )}
        title="Brush Size"
      >
        <div className="relative flex items-center justify-center w-7 h-7">
          <div 
            className="rounded-full bg-foreground transition-all duration-200 shadow-sm"
            style={{ 
              width: `${Math.max(6, Math.min(size * 1.5, 20))}px`,
              height: `${Math.max(6, Math.min(size * 1.5, 20))}px`
            }}
          />
        </div>
        <span className="text-[10px] mt-1 font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
          {size}px
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-full ml-3 top-0 z-50 animate-slide-in">
            <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-2xl min-w-[180px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted-foreground">Brush Size</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{size}px</span>
              </div>
              <Slider
                value={[size]}
                onValueChange={(value) => onChange(value[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-border/50">
                {[2, 8, 16, 32].map((presetSize) => (
                  <button
                    key={presetSize}
                    onClick={() => onChange(presetSize)}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
                      'hover:bg-slate-100',
                      size === presetSize && 'bg-primary/10 ring-1 ring-primary/30'
                    )}
                    title={`${presetSize}px`}
                  >
                    <div 
                      className="rounded-full bg-foreground"
                      style={{ 
                        width: `${Math.max(4, presetSize * 0.5)}px`,
                        height: `${Math.max(4, presetSize * 0.5)}px`
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
