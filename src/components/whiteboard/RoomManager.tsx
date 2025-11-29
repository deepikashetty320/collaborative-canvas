import { useState, useEffect } from 'react';
import { Users, Link2, Copy, Check, LogIn, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface RoomManagerProps {
  currentRoom: string | null;
  roomUsers: string[];
  username: string;
  isConnected: boolean;
  onJoinRoom: (roomId: string, username: string) => void;
  onLeaveRoom: () => void;
  onUsernameChange: (username: string) => void;
}

const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const RoomManager = ({
  currentRoom,
  roomUsers,
  username,
  isConnected,
  onJoinRoom,
  onLeaveRoom,
  onUsernameChange,
}: RoomManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [usernameInput, setUsernameInput] = useState(username);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUsernameInput(username);
  }, [username]);

  const handleCreateRoom = () => {
    if (!usernameInput.trim()) {
      toast.error('Please enter a username');
      return;
    }
    const newRoomId = generateRoomId();
    onUsernameChange(usernameInput.trim());
    onJoinRoom(newRoomId, usernameInput.trim());
    setIsOpen(false);
    toast.success(`Room ${newRoomId} created!`);
  };

  const handleJoinRoom = () => {
    if (!usernameInput.trim()) {
      toast.error('Please enter a username');
      return;
    }
    if (!roomIdInput.trim()) {
      toast.error('Please enter a room ID');
      return;
    }
    onUsernameChange(usernameInput.trim());
    onJoinRoom(roomIdInput.trim().toUpperCase(), usernameInput.trim());
    setIsOpen(false);
    setRoomIdInput('');
    toast.success(`Joined room ${roomIdInput.toUpperCase()}`);
  };

  const handleLeaveRoom = () => {
    onLeaveRoom();
    toast.info('Left the room');
  };

  const copyInviteLink = () => {
    if (currentRoom) {
      const link = `${window.location.origin}?room=${currentRoom}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Invite link copied!');
    }
  };

  // Check URL for room parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && !currentRoom) {
      setRoomIdInput(roomParam.toUpperCase());
      setIsOpen(true);
    }
  }, [currentRoom]);

  return (
    <div className="flex items-center gap-2">
      {currentRoom ? (
        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-xl px-3 py-2 rounded-xl border border-border/40 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-mono font-semibold text-foreground">{currentRoom}</span>
          </div>
          
          <div className="w-px h-5 bg-border/50" />
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">{roomUsers.length}</span>
          </div>
          
          <button
            onClick={copyInviteLink}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            title="Copy invite link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Link2 className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          <button
            onClick={handleLeaveRoom}
            className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
            title="Leave room"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-card/80 backdrop-blur-xl border-border/40 shadow-lg hover:shadow-xl transition-all"
              disabled={!isConnected}
            >
              <Users className="w-4 h-4 mr-2" />
              Join Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/40">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">Join or Create Room</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Name</label>
                <Input
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-muted/50 border-border/40"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateRoom} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Room
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or join existing</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Room ID</label>
                <div className="flex gap-2">
                  <Input
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                    placeholder="Enter room ID"
                    className="bg-muted/50 border-border/40 font-mono"
                    maxLength={6}
                  />
                  <Button onClick={handleJoinRoom} variant="secondary">
                    <LogIn className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
