import { useState, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

const BUTTON_WIDTH = 160; // w-40 = 10rem = 160px
const BUTTON_HEIGHT = 64; // h-16 = 4rem = 64px
const SAFE_MARGIN = 100; // Minimum distance from edges

export default function useEvasivePosition() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  // Initialize position on mount
  useEffect(() => {
    const initialPosition = getRandomSafePosition();
    setPosition(initialPosition);
  }, []);

  const getRandomSafePosition = useCallback((): Position => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate safe bounds
    const minX = SAFE_MARGIN;
    const maxX = viewportWidth - BUTTON_WIDTH - SAFE_MARGIN;
    const minY = SAFE_MARGIN + 200; // Extra margin from top for the question
    const maxY = viewportHeight - BUTTON_HEIGHT - SAFE_MARGIN - 100; // Extra margin from bottom for footer

    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    return { x, y };
  }, []);

  const handlePointerEnter = useCallback(() => {
    const newPosition = getRandomSafePosition();
    setPosition(newPosition);
  }, [getRandomSafePosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const newPosition = getRandomSafePosition();
    setPosition(newPosition);
  }, [getRandomSafePosition]);

  return {
    position,
    handlePointerEnter,
    handleTouchStart,
  };
}
