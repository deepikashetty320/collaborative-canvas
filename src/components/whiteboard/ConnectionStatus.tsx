import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  return (
    <div 
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
        'transition-all duration-300',
        isConnected 
          ? 'bg-green-100 text-green-700' 
          : 'bg-amber-100 text-amber-700'
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 animate-pulse-soft" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};
