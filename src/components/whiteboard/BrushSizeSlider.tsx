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
          'w-14 h-14 rounded-2xl transition-all duration-300',
          'hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-50 hover:scale-105 hover:shadow-md',
          'active:scale-95 transform-gpu'
        )}
        title="Brush Size"
      >
        <div className="relative flex items-center justify-center w-7 h-7">
          <div
            className="rounded-full bg-foreground transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-110"
            style={{
              width: `${Math.max(6, Math.min(size * 1.5, 20))}px`,
              height: `${Math.max(6, Math.min(size * 1.5, 20))}px`
            }}
          />
        </div>
        <span className="text-[10px] mt-1 font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
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
            <div className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-2xl p-4 shadow-2xl min-w-[200px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-muted-foreground">Brush Size</span>
                <span className="text-xs font-bold text-primary bg-gradient-to-br from-primary/20 to-purple-500/20 px-3 py-1 rounded-full shadow-sm">
                  {size}px
                </span>
              </div>
              <Slider
                value={[size]}
                onValueChange={(value) => onChange(value[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-border/50">
                {[2, 8, 16, 32].map((presetSize) => (
                  <button
                    key={presetSize}
                    onClick={() => onChange(presetSize)}
                    className={cn(
                      'flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300',
                      'hover:bg-slate-100 hover:scale-110 active:scale-95 transform-gpu',
                      size === presetSize && 'bg-gradient-to-br from-primary/20 to-purple-500/20 ring-2 ring-primary/30 scale-105 shadow-md'
                    )}
                    title={`${presetSize}px`}
                  >
                    <div
                      className="rounded-full bg-foreground shadow-sm"
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
