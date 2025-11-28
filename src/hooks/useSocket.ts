import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DrawData } from '@/types/whiteboard';

const SOCKET_URL = 'http://localhost:3000';

interface UseSocketReturn {
  isConnected: boolean;
  emitDraw: (data: DrawData) => void;
  emitClear: () => void;
  onDraw: (callback: (data: DrawData) => void) => void;
  onClear: (callback: () => void) => void;
}

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const drawCallbackRef = useRef<((data: DrawData) => void) | null>(null);
  const clearCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Initialize socket connection
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

    // Listen for draw events from other users
    socket.on('draw', (data: DrawData) => {
      if (drawCallbackRef.current) {
        drawCallbackRef.current(data);
      }
    });

    // Listen for clear events from other users
    socket.on('clear', () => {
      if (clearCallbackRef.current) {
        clearCallbackRef.current();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emitDraw = useCallback((data: DrawData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('draw', data);
    }
  }, []);

  const emitClear = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('clear');
    }
  }, []);

  const onDraw = useCallback((callback: (data: DrawData) => void) => {
    drawCallbackRef.current = callback;
  }, []);

  const onClear = useCallback((callback: () => void) => {
    clearCallbackRef.current = callback;
  }, []);

  return {
    isConnected,
    emitDraw,
    emitClear,
    onDraw,
    onClear,
  };
};
