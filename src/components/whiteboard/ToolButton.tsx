import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              'group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200',
              'hover:scale-105 active:scale-95',
              'shadow-sm hover:shadow-md',
              isActive && variant === 'default' && 'bg-primary text-primary-foreground shadow-lg shadow-primary/30',
              !isActive && variant === 'default' && 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
              variant === 'destructive' && 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground',
            )}
          >
            <Icon className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-foreground text-background text-xs font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
