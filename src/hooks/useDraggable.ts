import { useState, useCallback, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  initialPosition?: Position;
  storageKey?: string;
  boundToViewport?: boolean;
}

export const useDraggable = (options: UseDraggableOptions = {}) => {
  const { 
    initialPosition = { x: 0, y: 0 }, 
    storageKey,
    boundToViewport = true 
  } = options;

  const [position, setPosition] = useState<Position>(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialPosition;
        }
      }
    }
    return initialPosition;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const element = elementRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !elementRef.current) return;

    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;

    if (boundToViewport) {
      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    }

    setPosition({ x: newX, y: newY });
  }, [isDragging, boundToViewport]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(position));
      }
    }
  }, [isDragging, position, storageKey]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Save position on change (debounced via mouseup)
  useEffect(() => {
    if (storageKey && !isDragging) {
      localStorage.setItem(storageKey, JSON.stringify(position));
    }
  }, [position, storageKey, isDragging]);

  return {
    position,
    isDragging,
    elementRef,
    handleMouseDown,
  };
};
