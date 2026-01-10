import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { motion } from 'framer-motion';
import { ArrowDown, Search, Menu, Zap, Users } from 'lucide-react';

// --- Types & Constants ---

type TagData = {
  id: string;
  label: string;
  bgClass: string;
  textClass: string;
  width: number; // Approximate width for physics body
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

// Physics constants
const TAG_HEIGHT = 48; // h-12 in Tailwind
const CHAMFER_RADIUS = 24; // Half of height for pill shape

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  // We use a ref to store the DOM elements for synchronization to avoid re-rendering React on every frame
  const tagsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Refs for drag vs click detection
  const clickStartRef = useRef<{x: number, y: number} | null>(null);

  // State to handle initial render
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Physics Setup ---

  useEffect(() => {
    if (!sceneRef.current || !containerRef.current) return;

    // 1. Setup Matter.js Engine
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // 2. Setup Render (Optional, for debugging, but we rely on React for visuals)
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
    render.canvas.style.position = 'absolute';
    render.canvas.style.top = '0';
    render.canvas.style.left = '0';
    render.canvas.style.pointerEvents = 'none';
    render.canvas.style.opacity = '0';
    renderRef.current = render;

    // 3. Create Boundaries
    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 50, // Slightly below viewport
      window.innerWidth,
      100,
      { isStatic: true, render: { visible: false } }
    );

    const wallLeft = Matter.Bodies.rectangle(
      -50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true, render: { visible: false } }
    );

    const wallRight = Matter.Bodies.rectangle(
      window.innerWidth + 50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true, render: { visible: false } }
    );

    Matter.Composite.add(world, [ground, wallLeft, wallRight]);

    // 4. Create Tag Bodies
    const tagBodies = TAGS.map((tag) => {
      const x = Math.random() * (window.innerWidth - 200) + 100;
      const y = -Math.random() * 500 - 100; 
      
      const body = Matter.Bodies.rectangle(x, y, tag.width, TAG_HEIGHT, {
        chamfer: { radius: CHAMFER_RADIUS },
        restitution: 0.8, // Bouncy
        friction: 0.005,
        density: 0.04,
        label: tag.id, 
      });
      return body;
    });

    Matter.Composite.add(world, tagBodies);

    // 5. Mouse Interaction
    // We attach the mouse to the containerRef (main wrapper) so it captures events bubbling from the buttons
    const mouse = Matter.Mouse.create(containerRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    // Remove scrolling interference
    // @ts-ignore
    mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    // @ts-ignore
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

    // Add "Throw" Effect
    Matter.Events.on(mouseConstraint, "enddrag", (e) => {
      if (e.body) {
        // Amplify velocity on release to simulate a strong throw
        Matter.Body.setVelocity(e.body, {
          x: e.body.velocity.x * 3, 
          y: e.body.velocity.y * 3
        });
      }
    });

    Matter.Composite.add(world, mouseConstraint);

    // 6. Run the engine
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
          
          const w = body.bounds.max.x - body.bounds.min.x;
          const h = body.bounds.max.y - body.bounds.min.y;
          
          domNode.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${rotation}rad)`;
        }
      });
      
      requestAnimationFrame(updateLoop);
    };
    
    const animationId = requestAnimationFrame(updateLoop);
    setIsLoaded(true);

    // 8. Handle Window Resize
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

  // --- Interaction Logic ---

  const handlePointerDown = (e: React.PointerEvent) => {
    // Record start position to distinguish click from drag
    clickStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTagClick = (tagLabel: string, e: React.MouseEvent) => {
    if (!clickStartRef.current) return;
    
    const dist = Math.hypot(
      e.clientX - clickStartRef.current.x, 
      e.clientY - clickStartRef.current.y
    );
    
    // Only trigger click if moved less than 10 pixels
    if (dist < 10) {
      console.log(`Navigate to: ${tagLabel}`);
      // Visual feedback or navigation could go here
    }
    
    clickStartRef.current = null;
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-[#060606] font-sans selection:bg-white selection:text-black"
    >
      
      {/* --- Navbar (Overlay) --- */}
      <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto cursor-pointer">
          {/* Monochrome Logo */}
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
             <Zap className="w-5 h-5 text-black fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DesignHub</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 pointer-events-auto">
          <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Resources</a>
          <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Community</a>
          <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Learn</a>
          <button className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm border border-white/5">
             <Search className="w-5 h-5" />
          </button>
        </div>

        <button className="md:hidden pointer-events-auto text-white">
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* --- Layer 1: Background & Physics Container --- */}
      <div 
        ref={sceneRef} 
        className="absolute inset-0 z-0"
      >
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Decorative Gradients (Darker/More subtle) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none opacity-30" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none opacity-20" />
      </div>

      {/* --- Layer 2: Static Hero Text (Behind Tags) --- */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center px-4 max-w-4xl mt-12 md:mt-0">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
          >
             <h2 className="text-white/60 font-semibold tracking-wide uppercase text-xs md:text-sm mb-6 border border-white/10 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm">
               The Ultimate Collection
             </h2>
          </motion.div>
          
          <motion.h1 
            className="text-7xl md:text-9xl font-extrabold text-white tracking-tighter leading-[0.85] mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            DESIGN <br />
            RESOURCES
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed font-normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            A curated library of high-quality design assets, UI kits, and tools.
            Drag the tags, explore the chaos.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
             <button className="pointer-events-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 min-w-[180px] justify-center">
                <Users className="w-5 h-5" />
                Join Community
             </button>

             <button className="pointer-events-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2 min-w-[180px] justify-center group">
                Start Browsing
                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
             </button>
          </motion.div>
        </div>
      </div>

      {/* --- Layer 3: The Falling Tags (DOM Elements) --- */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {TAGS.map((tag) => (
          <div
            key={tag.id}
            ref={(el) => {
              if (el) tagsRef.current.set(tag.id, el);
              else tagsRef.current.delete(tag.id);
            }}
            onPointerDown={handlePointerDown}
            onClick={(e) => handleTagClick(tag.label, e)}
            className="absolute top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing touch-none select-none"
            style={{
              width: `${tag.width}px`,
              height: `${TAG_HEIGHT}px`,
              willChange: 'transform',
              // Initial position off-screen before physics kicks in
              transform: 'translate(-1000px, -1000px)' 
            }}
          >
            <motion.div
              className={`
                w-full h-full
                flex items-center justify-center
                rounded-full
                border border-white/10 backdrop-blur-sm
                font-bold text-sm tracking-wide uppercase
                shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                ${tag.bgClass} ${tag.textClass}
              `}
              whileHover={{ 
                scale: 1.15, 
                boxShadow: "0px 0px 25px rgba(255, 255, 255, 0.4)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              {tag.label}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#060606] z-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;