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
        'w-14 h-14 rounded-xl transition-all duration-200',
        'hover:bg-tool-hover',
        isActive && 'bg-tool-active border-2 border-tool-active-border',
        !isActive && 'border-2 border-transparent',
        variant === 'destructive' && 'hover:bg-destructive/10 hover:text-destructive'
      )}
      title={label}
    >
      <Icon 
        className={cn(
          'w-5 h-5 transition-colors duration-200',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
          variant === 'destructive' && 'group-hover:text-destructive'
        )} 
      />
      <span 
        className={cn(
          'text-[10px] mt-1 font-medium transition-colors duration-200',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
          variant === 'destructive' && 'group-hover:text-destructive'
        )}
      >
        {label}
      </span>
    </button>
  );
};
