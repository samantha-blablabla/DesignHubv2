import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'framer-motion';

// --- Context for Scroll Management ---
interface ScrollContextType {
  lenis: Lenis | null;
  stopScroll: () => void;
  startScroll: () => void;
}

const ScrollContext = createContext<ScrollContextType>({
  lenis: null,
  stopScroll: () => {},
  startScroll: () => {},
});

export const useLenis = () => useContext(ScrollContext);

// --- Wrapper Component ---
export const ScrollWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  
  // Scroll Progress Indicator Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Initialize Lenis
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease Out Quart-ish
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    // RAF Loop
    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  const stopScroll = () => {
    if (lenis) {
      lenis.stop();
      // Also lock body to be safe, though Lenis stop usually handles the logic
      document.body.style.overflow = 'hidden';
    }
  };

  const startScroll = () => {
    if (lenis) {
      lenis.start();
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <ScrollContext.Provider value={{ lenis, stopScroll, startScroll }}>
      {/* Top Neon Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-yellow-500 origin-left z-[9999] shadow-[0_0_10px_#eab308]"
        style={{ scaleX }}
      />
      {children}
    </ScrollContext.Provider>
  );
};