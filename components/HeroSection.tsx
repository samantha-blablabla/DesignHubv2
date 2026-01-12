import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import { ArrowDown, Search, Menu, Zap, Users } from 'lucide-react';
import { useCursor } from './CursorContext';
import { globalScheduler } from '../lib/animationScheduler';

// --- Types & Constants ---

type TagData = {
  id: string;
  label: string;
  bgClass: string;
  textClass: string;
  width: number;
};

const TAGS: TagData[] = [
  { id: 'ui-kits', label: 'UI Kits', bgClass: 'bg-yellow-500', textClass: 'text-black', width: 120 },
  { id: 'figma', label: 'Figma', bgClass: 'bg-blue-500', textClass: 'text-white', width: 110 },
  { id: 'icons', label: 'Icons', bgClass: 'bg-orange-500', textClass: 'text-white', width: 110 },
  { id: '3d', label: '3D Models', bgClass: 'bg-purple-500', textClass: 'text-white', width: 155 },
  { id: 'fonts', label: 'Fonts', bgClass: 'bg-green-500', textClass: 'text-black', width: 110 },
  { id: 'mockups', label: 'Mockups', bgClass: 'bg-yellow-500', textClass: 'text-black', width: 135 },
  { id: 'illustrations', label: 'Illustrations', bgClass: 'bg-blue-500', textClass: 'text-white', width: 165 },
  { id: 'colors', label: 'Palettes', bgClass: 'bg-orange-500', textClass: 'text-white', width: 135 },
  { id: 'textures', label: 'Textures', bgClass: 'bg-purple-500', textClass: 'text-white', width: 135 },
  { id: 'templates', label: 'Templates', bgClass: 'bg-green-500', textClass: 'text-black', width: 150 },
  { id: 'wireframes', label: 'Wireframes', bgClass: 'bg-yellow-500', textClass: 'text-black', width: 160 },
  { id: 'brushes', label: 'Brushes', bgClass: 'bg-blue-500', textClass: 'text-white', width: 125 },
  { id: 'photos', label: 'Photos', bgClass: 'bg-pink-500', textClass: 'text-white', width: 120 },
  { id: 'videos', label: 'Videos', bgClass: 'bg-cyan-500', textClass: 'text-black', width: 120 },
  { id: 'audio', label: 'Audio', bgClass: 'bg-teal-500', textClass: 'text-white', width: 110 },
  { id: 'plugins', label: 'Plugins', bgClass: 'bg-red-500', textClass: 'text-white', width: 125 },
];

const TAG_HEIGHT = 56; // Increased from 48 to 56 for more padding
const CHAMFER_RADIUS = 28; // Adjusted proportionally

// --- Magnetic Button Component ---

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = React.memo(({ children, className = "", onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const textX = useTransform(springX, (latest) => latest * 0.1);
  const textY = useTransform(springY, (latest) => latest * 0.1);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Disable magnetic effect on mobile or small screens
    if (window.innerWidth < 768) return;

    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.35);
    y.set((e.clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div style={{ x: textX, y: textY }} className="flex items-center gap-2 justify-center w-full h-full">
        {children}
      </motion.div>
    </motion.button>
  );
});

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const tagsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const clickStartRef = useRef<{x: number, y: number} | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayedTags, setDisplayedTags] = useState<TagData[]>([]);
  const gravityInitialized = useRef(false);
  const { setCursor } = useCursor();

  // --- Intersection Observer for performance gating ---
  const isHeroVisible = useInView(containerRef, { amount: 0.1 });

  // --- Parallax Hooks ---
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 200]);
  const tagsY = useTransform(scrollY, [0, 500], [0, -150]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Determine number of tags based on screen size
    const isMobile = window.innerWidth < 768;
    setDisplayedTags(isMobile ? TAGS.slice(0, 6) : TAGS);
  }, []);

  // Gate physics engine based on visibility for performance
  // NOTE: Since we use unified scheduler, we don't need Runner.run/stop
  // The scheduler will continue to call our update function
  // We can disable gravity to "pause" physics simulation instead
  useEffect(() => {
    if (!engineRef.current || !gravityInitialized.current) return;

    if (isHeroVisible) {
      // Resume physics by enabling gravity
      engineRef.current.gravity.y = 1;
    } else {
      // Pause physics by disabling gravity (objects stay still)
      engineRef.current.gravity.y = 0;
    }
  }, [isHeroVisible]);

  useEffect(() => {
    if (!sceneRef.current || !containerRef.current || displayedTags.length === 0) return;

    // 1. Setup Engine
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;
    
    // Disable gravity initially for staggered reveal
    engine.gravity.y = 0;

    // 2. Setup Render (Hidden)
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false, 
      },
    });
    render.canvas.style.pointerEvents = 'none';
    render.canvas.style.opacity = '0';

    // 3. Boundaries (with reset zones)
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
    const wallLeft = Matter.Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
    const wallRight = Matter.Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
    const ceiling = Matter.Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth, 100, { isStatic: true });
    Matter.Composite.add(world, [ground, wallLeft, wallRight, ceiling]);

    // 4. Bodies (Positioned high initially)
    const tagBodies = displayedTags.map((tag) => {
      const x = Math.random() * (window.innerWidth - 200) + 100;
      const y = -Math.random() * 500 - 200; // Start higher
      return Matter.Bodies.rectangle(x, y, tag.width, TAG_HEIGHT, {
        chamfer: { radius: CHAMFER_RADIUS },
        restitution: 0.8,
        friction: 0.005,
        density: 0.04,
        label: tag.id, 
      });
    });
    Matter.Composite.add(world, tagBodies);

    // 5. Mouse Interaction
    const mouse = Matter.Mouse.create(document.body); 
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    // Clean mouse events
    // @ts-ignore
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    // @ts-ignore
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    // @ts-ignore
    mouse.element.removeEventListener("wheel", mouse.mousewheel);

    Matter.Composite.add(world, mouseConstraint);

    // 6. Run & Sync
    const runner = Matter.Runner.create();
    // NOTE: Don't use Matter.Runner.run() - we manually update via globalScheduler
    // Matter.Runner.run(runner, engine); // REMOVED - conflicts with unified scheduler
    Matter.Render.run(render);
    runnerRef.current = runner;

    // Staggered Gravity Enable
    setTimeout(() => {
        engine.gravity.y = 1;
        gravityInitialized.current = true; // Mark gravity as initialized
    }, 1200);

    // Use unified scheduler instead of separate RAF loop
    const unsubscribe = globalScheduler.subscribe('hero-physics', (time, delta) => {
      if (!engineRef.current) return;

      // Update physics with accurate delta time (Matter.js expects milliseconds)
      Matter.Engine.update(engine, delta);

      // Sync DOM with physics state - batched in single frame
      tagBodies.forEach((body) => {
        const domNode = tagsRef.current.get(body.label);
        if (domNode) {
          const { x, y } = body.position;
          const rotation = body.angle;
          const tag = displayedTags.find(t => t.id === body.label);
          if (tag) {
            // Reset position if tag goes off-screen (keeps tags in viewport)
            if (x < -100 || x > window.innerWidth + 100 || y > window.innerHeight + 100) {
              Matter.Body.setPosition(body, {
                x: Math.random() * (window.innerWidth - 200) + 100,
                y: -100
              });
              Matter.Body.setVelocity(body, { x: 0, y: 0 });
              Matter.Body.setAngularVelocity(body, 0);
            }
            domNode.style.transform = `translate(${x - tag.width / 2}px, ${y - TAG_HEIGHT / 2}px) rotate(${rotation}rad)`;
          }
        }
      });
    });

    setIsLoaded(true);

    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
      Matter.Body.setPosition(wallRight, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe(); // Cleanup scheduler subscription instead of RAF
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [displayedTags]);

  const handlePointerDown = (e: React.PointerEvent) => {
    clickStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTagClick = (tagLabel: string, e: React.MouseEvent) => {
    if (!clickStartRef.current) return;
    const dist = Math.hypot(e.clientX - clickStartRef.current.x, e.clientY - clickStartRef.current.y);
    if (dist < 10) console.log(`Navigate: ${tagLabel}`);
    clickStartRef.current = null;
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-[#060606] font-sans"
      style={{ touchAction: 'pan-y', pointerEvents: 'none' }} 
    >
      <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-8 py-6 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-2 pointer-events-auto cursor-pointer"
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
             <Zap className="w-5 h-5 text-black fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DesignHub</span>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0, y: -20 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
           className="hidden md:flex items-center gap-8 pointer-events-auto"
        >
          <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Resources</a>
          <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Community</a>
          <button className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm border border-white/5">
             <Search className="w-5 h-5" />
          </button>
        </motion.div>
        {/* Mobile Menu Icon */}
        <div className="md:hidden pointer-events-auto text-white">
           <Menu className="w-6 h-6" />
        </div>
      </nav>

      {/* Grid Pattern Reveal */}
      <motion.div 
        ref={sceneRef} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeIn" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] opacity-30" />
      </motion.div>

      {/* Hero Text Reveal */}
      <motion.div 
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="text-center px-4 max-w-4xl mt-12 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
             <h2 className="text-white/60 font-semibold tracking-wide uppercase text-[10px] md:text-sm mb-4 md:mb-6 border border-white/10 inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full backdrop-blur-sm">
               The Ultimate Collection
             </h2>
          </motion.div>
          {/* Responsive Typography */}
          <motion.h1 
            className="text-[13vw] md:text-9xl font-extrabold text-white tracking-tighter leading-[0.9] md:leading-[0.85] mb-6 md:mb-8"
            initial={{ opacity: 0, scale: 0.9, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            DESIGN <br /> RESOURCES
          </motion.h1>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pointer-events-auto"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
             <MagneticButton className="w-full sm:w-auto px-8 py-3 md:py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-sm md:text-base">
                <Users className="w-4 h-4 md:w-5 md:h-5 inline mr-2" /> Join Community
             </MagneticButton>
             
             <MagneticButton className="w-full sm:w-auto px-8 py-3 md:py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors group text-sm md:text-base">
                Start Browsing <ArrowDown className="w-4 h-4 md:w-5 md:h-5 inline ml-2 group-hover:translate-y-1 transition-transform" />
             </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Falling Tags */}
      <motion.div 
        style={{ y: tagsY }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {displayedTags.map((tag) => (
          <div
            key={tag.id}
            ref={(el) => {
              if (el) tagsRef.current.set(tag.id, el);
              else tagsRef.current.delete(tag.id);
            }}
            onPointerDown={handlePointerDown}
            onClick={(e) => handleTagClick(tag.label, e)}
            onMouseEnter={() => setCursor('text', 'DRAG')}
            onMouseLeave={() => setCursor('default')}
            className="absolute top-0 left-0 touch-none select-none"
            style={{
              width: `${tag.width}px`,
              height: `${TAG_HEIGHT}px`,
              willChange: 'transform',
              transform: 'translate(-1000px, -1000px)',
              pointerEvents: 'auto',
              cursor: 'grab'
            }}
          >
            <motion.div
              className={`w-full h-full flex items-center justify-center rounded-full border border-white/10 backdrop-blur-sm font-bold text-sm tracking-wide uppercase shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${tag.bgClass} ${tag.textClass}`}
              whileHover={{ scale: 1.15, boxShadow: "0px 0px 25px rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.95, cursor: 'grabbing' }}
            >
              {tag.label}
            </motion.div>
          </div>
        ))}
      </motion.div>

      {!isLoaded && (
        <div className="absolute inset-0 bg-[#060606] z-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;