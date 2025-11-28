import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export const ToolButton = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  variant = 'default',
}: ToolButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center justify-center',
        'w-14 h-14 rounded-2xl transition-all duration-300',
        'hover:bg-gradient-to-br hover:scale-105 active:scale-95',
        'transform-gpu',
        isActive && 'bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-lg shadow-primary/20 scale-105',
        !isActive && 'hover:from-slate-100 hover:to-slate-50 hover:shadow-md',
        variant === 'destructive' && 'hover:from-red-100 hover:to-red-50'
      )}
      title={label}
    >
      {isActive && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 animate-pulse-soft" />
      )}
      <Icon
        className={cn(
          'w-5 h-5 transition-all duration-300 relative z-10',
          isActive ? 'text-primary scale-110 drop-shadow-sm' : 'text-muted-foreground group-hover:text-foreground group-hover:scale-110',
          variant === 'destructive' && 'group-hover:text-destructive'
        )}
      />
      <span
        className={cn(
          'text-[10px] mt-1 font-semibold transition-all duration-300 relative z-10',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
          variant === 'destructive' && 'group-hover:text-destructive'
        )}
      >
        {label}
      </span>
    </button>
  );
};
