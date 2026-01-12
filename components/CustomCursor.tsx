import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from './CursorContext';
import { globalScheduler } from '../lib/animationScheduler';

const CustomCursor = () => {
  const { cursorState } = useCursor();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement
  const springConfig = { stiffness: 500, damping: 28 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Store pending mouse position to batch updates per frame
  const pendingPosition = useRef({ x: 0, y: 0 });

  // Throttle mouse updates to once per frame
  const manageMouseMove = useCallback((e: MouseEvent) => {
    pendingPosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    // Subscribe to unified scheduler for batched updates
    const unsubscribe = globalScheduler.subscribe('custom-cursor', () => {
      // Update motion values once per frame instead of every mouse pixel
      mouseX.set(pendingPosition.current.x);
      mouseY.set(pendingPosition.current.y);
    });

    window.addEventListener('mousemove', manageMouseMove);

    return () => {
      unsubscribe();
      window.removeEventListener('mousemove', manageMouseMove);
    };
  }, [mouseX, mouseY, manageMouseMove]);

  const variants = {
    default: {
      height: 16,
      width: 16,
      x: -8,
      y: -8,
      backgroundColor: "white",
      mixBlendMode: "difference" as any,
    },
    text: {
      height: 80,
      width: 80,
      x: -40,
      y: -40,
      backgroundColor: "white",
      mixBlendMode: "difference" as any,
    },
  };

  return (
    // Hidden on mobile (block on medium screens and up)
    <motion.div
      style={{
        left: smoothX,
        top: smoothY,
        position: 'fixed',
        zIndex: 9999,
        pointerEvents: 'none',
        borderRadius: '50%',
      }}
      variants={variants}
      animate={cursorState.type}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="hidden md:flex items-center justify-center overflow-hidden"
    >
      {cursorState.label && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-black text-[10px] font-bold tracking-widest uppercase"
        >
          {cursorState.label}
        </motion.span>
      )}
    </motion.div>
  );
};

export default CustomCursor;