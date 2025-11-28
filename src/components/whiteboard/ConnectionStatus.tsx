import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-xl border transition-all duration-300',
        isConnected
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-700'
      )}
    >
      <div className="relative">
        {isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <div
          className={cn(
            'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full',
            isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          )}
        />
      </div>
      <span className="text-xs font-semibold">
        {isConnected ? 'Connected' : 'Offline'}
      </span>
    </div>
  );
};
