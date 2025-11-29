import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DrawData, ChatMessage } from '@/types/whiteboard';

const SOCKET_URL = 'http://localhost:3000';

interface UseSocketReturn {
  isConnected: boolean;
  currentRoom: string | null;
  roomUsers: string[];
  emitDraw: (data: DrawData) => void;
  emitClear: () => void;
  emitChat: (message: string, username: string) => void;
  joinRoom: (roomId: string, username: string) => void;
  leaveRoom: () => void;
  onDraw: (callback: (data: DrawData) => void) => void;
  onClear: (callback: () => void) => void;
  onChat: (callback: (message: ChatMessage) => void) => void;
}

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  
  const drawCallbackRef = useRef<((data: DrawData) => void) | null>(null);
  const clearCallbackRef = useRef<(() => void) | null>(null);
  const chatCallbackRef = useRef<((message: ChatMessage) => void) | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to whiteboard server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from whiteboard server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.log('Connection error:', error.message);
      setIsConnected(false);
    });

    socket.on('draw', (data: DrawData) => {
      if (drawCallbackRef.current) {
        drawCallbackRef.current(data);
      }
    });

    socket.on('clear', () => {
      if (clearCallbackRef.current) {
        clearCallbackRef.current();
      }
    });

    socket.on('chat', (message: ChatMessage) => {
      if (chatCallbackRef.current) {
        chatCallbackRef.current(message);
      }
    });

    socket.on('room-users', ({ users }: { users: string[] }) => {
      setRoomUsers(users);
    });

    socket.on('user-joined', ({ username }: { username: string }) => {
      setRoomUsers(prev => [...prev.filter(u => u !== username), username]);
    });

    socket.on('user-left', ({ username }: { username: string }) => {
      setRoomUsers(prev => prev.filter(u => u !== username));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emitDraw = useCallback((data: DrawData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('draw', { ...data, roomId: currentRoom });
    }
  }, [currentRoom]);

  const emitClear = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('clear', { roomId: currentRoom });
    }
  }, [currentRoom]);

  const emitChat = useCallback((text: string, username: string) => {
    if (socketRef.current?.connected) {
      const message: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: socketRef.current.id || 'unknown',
        username,
        text,
        timestamp: Date.now(),
      };
      socketRef.current.emit('chat', { ...message, roomId: currentRoom });
    }
  }, [currentRoom]);

  const joinRoom = useCallback((roomId: string, username: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-room', { roomId, username });
      setCurrentRoom(roomId);
    }
  }, []);

  const leaveRoom = useCallback(() => {
    if (socketRef.current?.connected && currentRoom) {
      socketRef.current.emit('leave-room', { roomId: currentRoom });
      setCurrentRoom(null);
      setRoomUsers([]);
    }
  }, [currentRoom]);

  const onDraw = useCallback((callback: (data: DrawData) => void) => {
    drawCallbackRef.current = callback;
  }, []);

  const onClear = useCallback((callback: () => void) => {
    clearCallbackRef.current = callback;
  }, []);

  const onChat = useCallback((callback: (message: ChatMessage) => void) => {
    chatCallbackRef.current = callback;
  }, []);

  return {
    isConnected,
    currentRoom,
    roomUsers,
    emitDraw,
    emitClear,
    emitChat,
    joinRoom,
    leaveRoom,
    onDraw,
    onClear,
    onChat,
  };
};
