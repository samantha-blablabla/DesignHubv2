import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown, Search, Menu, Zap, Users } from 'lucide-react';

// --- Types & Constants ---

type TagData = {
  id: string;
  label: string;
  bgClass: string;
  textClass: string;
  width: number;
};

const TAGS: TagData[] = [
  { id: 'ui-kits', label: 'UI Kits', bgClass: 'bg-yellow-500', textClass: 'text-black', width: 100 },
  { id: 'figma', label: 'Figma', bgClass: 'bg-blue-500', textClass: 'text-white', width: 90 },
  { id: 'icons', label: 'Icons', bgClass: 'bg-orange-500', textClass: 'text-white', width: 90 },
  { id: '3d', label: '3D Models', bgClass: 'bg-purple-500', textClass: 'text-white', width: 130 },
  { id: 'fonts', label: 'Fonts', bgClass: 'bg-green-500', textClass: 'text-black', width: 90 },
  { id: 'mockups', label: 'Mockups', bgClass: 'bg-yellow-500', textClass: 'text-black', width: 110 },
  { id: 'illustrations', label: 'Illustrations', bgClass: 'bg-blue-500', textClass: 'text-white', width: 140 },
  { id: 'colors', label: 'Palettes', bgClass: 'bg-orange-500', textClass: 'text-white', width: 110 },
  { id: 'textures', label: 'Textures', bgClass: 'bg-purple-500', textClass: 'text-white', width: 110 },
  { id: 'templates', label: 'Templates', bgClass: 'bg-green-500', textClass: 'text-black', width: 125 },
  { id: 'wireframes', label: 'Wireframes', bgClass: 'bg-yellow-500', textClass: 'text-black', width: 135 },
  { id: 'brushes', label: 'Brushes', bgClass: 'bg-blue-500', textClass: 'text-white', width: 100 },
];

const TAG_HEIGHT = 48;
const CHAMFER_RADIUS = 24;

// --- Magnetic Button Component ---

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = "", onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Snappy but smooth physics
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Text/Icon moves slightly more for a layered 3D depth effect
  const textX = useTransform(springX, (latest) => latest * 0.1);
  const textY = useTransform(springY, (latest) => latest * 0.1);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Pull factor: 0.35 means button travels 35% of the distance to the mouse
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
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
};

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const tagsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const clickStartRef = useRef<{x: number, y: number} | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Parallax Hooks ---
  const { scrollY } = useScroll();
  // Text moves down slower (0 -> 200)
  const textY = useTransform(scrollY, [0, 500], [0, 200]);
  // Tags move up faster (0 -> -150)
  const tagsY = useTransform(scrollY, [0, 500], [0, -150]);
  // Fade text out
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (!sceneRef.current || !containerRef.current) return;

    // 1. Setup Engine
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // 2. Setup Render (Visual Debugging - Hidden but structurally kept)
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false, 
        showAngleIndicator: false,
      },
    });
    // Visual canvas pointer-events: none (Task 1)
    render.canvas.style.pointerEvents = 'none';
    render.canvas.style.position = 'absolute';
    render.canvas.style.top = '0';
    render.canvas.style.left = '0';
    render.canvas.style.opacity = '0'; 
    renderRef.current = render;

    // 3. Boundaries
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
    const wallLeft = Matter.Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
    const wallRight = Matter.Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
    Matter.Composite.add(world, [ground, wallLeft, wallRight]);

    // 4. Bodies
    const tagBodies = TAGS.map((tag) => {
      const x = Math.random() * (window.innerWidth - 200) + 100;
      const y = -Math.random() * 500 - 100; 
      return Matter.Bodies.rectangle(x, y, tag.width, TAG_HEIGHT, {
        chamfer: { radius: CHAMFER_RADIUS },
        restitution: 0.8,
        friction: 0.005,
        density: 0.04,
        label: tag.id, 
      });
    });
    Matter.Composite.add(world, tagBodies);

    // 5. Mouse Interaction - The Key Scroll Fix
    const mouse = Matter.Mouse.create(document.body); 
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    // FORCE WHEEL PASS-THROUGH
    // Explicitly remove all scroll-blocking listeners from Matter.js
    // @ts-ignore
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    // @ts-ignore
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    // @ts-ignore
    mouse.element.removeEventListener("wheel", mouse.mousewheel);

    Matter.Composite.add(world, mouseConstraint);

    // 6. Run
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    runnerRef.current = runner;

    // 7. Sync Loop
    const updateLoop = () => {
      if (!engineRef.current) return;
      tagBodies.forEach((body) => {
        const domNode = tagsRef.current.get(body.label);
        if (domNode) {
          const { x, y } = body.position;
          const rotation = body.angle;

          // Find the tag to get its width
          const tag = TAGS.find(t => t.id === body.label);
          if (tag) {
            const w = tag.width;
            const h = TAG_HEIGHT;
            // Simplified position mapping logic (Center based)
            domNode.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${rotation}rad)`;
          }
        }
      });
      requestAnimationFrame(updateLoop);
    };
    const animationId = requestAnimationFrame(updateLoop);
    setIsLoaded(true);

    // 8. Resize
    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
      Matter.Body.setPosition(wallRight, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

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
      style={{ 
        touchAction: 'pan-y',
        pointerEvents: 'none' // Container ignores events, allowing scroll through
      }} 
    >
      
      {/* Navbar - Needs pointer events back */}
      <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto cursor-pointer">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
             <Zap className="w-5 h-5 text-black fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DesignHub</span>
        </div>
        <div className="hidden md:flex items-center gap-8 pointer-events-auto">
          <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Resources</a>
          <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Community</a>
          <button className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm border border-white/5">
             <Search className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Background - purely visual */}
      <div ref={sceneRef} className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] opacity-30" />
      </div>

      {/* Hero Text - Wrapped in Parallax Motion Div */}
      <motion.div 
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="text-center px-4 max-w-4xl mt-12 md:mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <h2 className="text-white/60 font-semibold tracking-wide uppercase text-xs md:text-sm mb-6 border border-white/10 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm">
               The Ultimate Collection
             </h2>
          </motion.div>
          <motion.h1 
            className="text-7xl md:text-9xl font-extrabold text-white tracking-tighter leading-[0.85] mb-8"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
          >
            DESIGN <br /> RESOURCES
          </motion.h1>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto" // Buttons need events
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          >
             <MagneticButton className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                <Users className="w-5 h-5" /> Join Community
             </MagneticButton>
             
             <MagneticButton className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors group">
                Start Browsing <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
             </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* The Tags - Wrapped in Parallax Motion Div */}
      <motion.div 
        style={{ y: tagsY }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {TAGS.map((tag) => (
          <div
            key={tag.id}
            ref={(el) => {
              if (el) tagsRef.current.set(tag.id, el);
              else tagsRef.current.delete(tag.id);
            }}
            onPointerDown={handlePointerDown}
            onClick={(e) => handleTagClick(tag.label, e)}
            className="absolute top-0 left-0 touch-none select-none"
            style={{
              width: `${tag.width}px`,
              height: `${TAG_HEIGHT}px`,
              willChange: 'transform',
              transform: 'translate(-1000px, -1000px)',
              pointerEvents: 'auto', // CRITICAL: Tags catch mouse/touch
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