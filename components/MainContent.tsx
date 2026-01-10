import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Search, X, ExternalLink, ArrowRight, Box, Type, MoveUpRight, Zap } from 'lucide-react';

// --- 1. Urban Design Dummy Data ---

type Vibe = 'All' | 'Cyberpunk' | 'Brutalist' | 'Minimalist' | 'Glassmorphism';
type Category = 'UI Kit' | 'Icons' | '3D' | 'Fonts';

interface Resource {
  id: string;
  title: string;
  category: Category;
  vibe: Vibe;
  color: string; // Tailwind class component (e.g. 'yellow-500')
  hex: string;   // Hex for shadows/glows
  image: string;
  description: string;
  size: 'normal' | 'large' | 'tall';
}

const RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Neon Glyph Icons',
    category: 'Icons',
    vibe: 'Cyberpunk',
    color: 'yellow-500',
    hex: '#eab308',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    description: 'A collection of 200+ SVG icons with pre-built neon glow effects. Perfect for dark mode dashboards and HUD interfaces.',
    size: 'large',
  },
  {
    id: 'res-2',
    title: 'Concrete UI Kit',
    category: 'UI Kit',
    vibe: 'Brutalist',
    color: 'blue-500',
    hex: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
    description: 'Raw, unpolished aesthetics. Thick borders, mono fonts, and high contrast components for bold web statements.',
    size: 'normal',
  },
  {
    id: 'res-3',
    title: 'Retro-Futurism Fonts',
    category: 'Fonts',
    vibe: 'Cyberpunk',
    color: 'purple-500',
    hex: '#a855f7',
    image: 'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?auto=format&fit=crop&q=80&w=800',
    description: 'Variable typefaces inspired by 80s sci-fi movies. Includes aggressive ink traps and stretched glyphs.',
    size: 'tall',
  },
  {
    id: 'res-4',
    title: 'Frost Glass 3D',
    category: '3D',
    vibe: 'Glassmorphism',
    color: 'green-500',
    hex: '#22c55e',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    description: 'Premium 3D shapes with frosted glass textures. Cycles render ready. Ideal for hero sections.',
    size: 'normal',
  },
  {
    id: 'res-5',
    title: 'Mono-Grid System',
    category: 'UI Kit',
    vibe: 'Minimalist',
    color: 'orange-500',
    hex: '#f97316',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    description: 'A strict 12-column grid system for Figma. Focus on typography and negative space.',
    size: 'normal',
  },
  {
    id: 'res-6',
    title: 'Acid Graphics Pack',
    category: 'Icons',
    vibe: 'Brutalist',
    color: 'yellow-500',
    hex: '#eab308',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800',
    description: 'Distorted textures, scanlines, and liquid metal assets for the ultimate anti-design look.',
    size: 'large',
  },
  {
    id: 'res-7',
    title: 'Holographic Meshes',
    category: '3D',
    vibe: 'Cyberpunk',
    color: 'blue-500',
    hex: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?auto=format&fit=crop&q=80&w=800',
    description: 'Iridescent gradient meshes that look different from every angle.',
    size: 'tall',
  },
  {
    id: 'res-8',
    title: 'Clean Dash',
    category: 'UI Kit',
    vibe: 'Minimalist',
    color: 'green-500',
    hex: '#22c55e',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'SaaS dashboard kit focused on data visualization and accessibility.',
    size: 'normal',
  },
];

const VIBES: Vibe[] = ['All', 'Cyberpunk', 'Brutalist', 'Glassmorphism', 'Minimalist'];

// --- 2. Shared Components (Defined BEFORE usage) ---

const CustomCursor = ({ colorHex }: { colorHex: string | null }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        backgroundColor: colorHex || '#ffffff',
        scale: colorHex ? 2.5 : 1,
      }}
    >
      {colorHex && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="w-full h-full flex items-center justify-center"
        >
          <MoveUpRight className="text-black w-2 h-2" />
        </motion.div>
      )}
    </motion.div>
  );
};

const FilterBar = ({ activeVibe, setActiveVibe }: { activeVibe: Vibe, setActiveVibe: (v: Vibe) => void }) => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060606]/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mr-2 shrink-0">Filter by Vibe:</span>
          {VIBES.map((vibe) => (
            <button
              key={vibe}
              onClick={() => setActiveVibe(vibe)}
              className={`
                relative px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all
                ${activeVibe === vibe ? 'text-black' : 'text-slate-400 hover:text-white'}
              `}
            >
              {activeVibe === vibe && (
                <motion.div
                  layoutId="activeVibe"
                  className="absolute inset-0 bg-white rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{vibe}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 bg-white/5 w-full md:w-auto">
           <Search className="w-4 h-4 text-slate-500" />
           <input 
             type="text" 
             placeholder="Search resources..." 
             className="bg-transparent border-none focus:outline-none text-white text-sm placeholder-slate-600 w-full"
           />
        </div>
      </div>
    </motion.div>
  );
};

interface BentoCardProps {
  resource: Resource;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
  resource, 
  onClick, 
  onHoverStart, 
  onHoverEnd 
}) => {
  const spanClass = 
    resource.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
    resource.size === 'tall' ? 'md:row-span-2' : 
    'col-span-1';

  return (
    <motion.div
      layoutId={`card-${resource.id}`}
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className={`
        group relative ${spanClass} rounded-3xl overflow-hidden cursor-none
        bg-[#111111] border border-white/10 h-full min-h-[300px]
      `}
    >
      {/* Dynamic Hover Border */}
      <div className={`absolute inset-0 border-2 border-${resource.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 rounded-3xl`} />
      
      {/* Image */}
      <motion.div 
        layoutId={`image-${resource.id}`}
        className="w-full h-full absolute inset-0"
      >
        <img 
          src={resource.image} 
          alt={resource.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-10">
        <motion.div 
          layoutId={`badge-${resource.id}`}
          className={`inline-block px-2 py-1 mb-3 rounded-md bg-${resource.color}/20 border border-${resource.color}/30 backdrop-blur-md`}
        >
          <span className={`text-${resource.color} text-[10px] font-bold uppercase tracking-widest`}>
            {resource.vibe}
          </span>
        </motion.div>
        
        <motion.h3 
          layoutId={`title-${resource.id}`}
          className="text-white text-2xl font-bold leading-tight mb-1 group-hover:translate-x-2 transition-transform duration-300"
        >
          {resource.title}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 text-xs uppercase tracking-wider"
        >
          {resource.category}
        </motion.p>
      </div>
    </motion.div>
  );
};

const DetailPortal = ({ id, onClose }: { id: string, onClose: () => void }) => {
  const resource = RESOURCES.find(r => r.id === id);
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Blurred Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      {/* Expanded Card */}
      <motion.div 
        layoutId={`card-${resource.id}`}
        className="relative w-full max-w-5xl h-[85vh] bg-[#0c0c0c] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-lg border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left: Image Side */}
        <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden">
          <motion.div 
             layoutId={`image-${resource.id}`}
             className="w-full h-full"
          >
            <img src={resource.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] md:bg-gradient-to-r md:from-transparent md:to-[#0c0c0c]" />
          </motion.div>
        </div>

        {/* Right: Content Side */}
        <div className="w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center relative">
          
          {/* Animated Elements coming in */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <motion.div layoutId={`badge-${resource.id}`} className={`inline-block px-3 py-1 rounded-full bg-${resource.color}/10 border border-${resource.color}/20 mb-4`}>
                <span className={`text-${resource.color} font-bold tracking-widest uppercase text-xs`}>{resource.vibe}</span>
              </motion.div>
              <motion.h2 layoutId={`title-${resource.id}`} className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-2">
                {resource.title}
              </motion.h2>
              <span className="text-slate-500 font-mono text-sm">V.2.4 • 245MB</span>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <p className="text-slate-300 text-lg leading-relaxed border-l-2 border-white/10 pl-6">
              {resource.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                 <Box className="text-slate-400" />
                 <div>
                   <p className="text-xs text-slate-500 uppercase">Format</p>
                   <p className="text-white font-bold">FIG, BLEND</p>
                 </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                 <Type className="text-slate-400" />
                 <div>
                   <p className="text-xs text-slate-500 uppercase">License</p>
                   <p className="text-white font-bold">Commercial</p>
                 </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className={`flex-1 py-4 bg-${resource.color} text-black font-bold text-lg rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 group`}>
                <Zap className="w-5 h-5 fill-black" />
                Download Access
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-4 border border-white/20 rounded-xl hover:bg-white/5 transition-colors text-white">
                <ExternalLink className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const UrbanFooter = () => (
  <footer className="relative bg-black pt-32 pb-12 border-t border-white/10 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
        <div>
          <h2 className="text-[12vw] md:text-[150px] font-black text-transparent stroke-text leading-none tracking-tighter opacity-30 select-none">
            DESIGN
          </h2>
          <h2 className="text-[12vw] md:text-[150px] font-black text-white leading-none tracking-tighter -mt-4 md:-mt-12 select-none relative">
            HUB.
            <span className="absolute -top-10 right-0 text-lg md:text-2xl font-normal tracking-widest text-yellow-500 bg-black px-2 border border-yellow-500 rotate-12">EST. 2024</span>
          </h2>
        </div>
        
        <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-6">
          <p className="text-slate-400 max-w-xs text-right hidden md:block">
            Curated resources for the chaotic creative. <br />
            Built for the future.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'Dribbble'].map((link) => (
              <a key={link} href="#" className="text-white font-bold uppercase tracking-wider hover:text-yellow-500 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex justify-between items-center text-xs text-slate-600 uppercase tracking-widest">
        <span>© 2024 DesignHub Inc.</span>
        <span>Tokyo / New York / Berlin</span>
      </div>
    </div>
    
    <style>{`
      .stroke-text {
        -webkit-text-stroke: 2px #333;
      }
    `}</style>
  </footer>
);

// --- 3. Main Component ---

const MainContent: React.FC = () => {
  const [activeVibe, setActiveVibe] = useState<Vibe>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cursorColor, setCursorColor] = useState<string | null>(null);

  // Filter Data
  const filteredResources = activeVibe === 'All' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.vibe === activeVibe);

  // Prevent scroll when portal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedId]);

  return (
    <div className="relative w-full min-h-screen bg-[#060606] cursor-none">
      <CustomCursor colorHex={cursorColor} />

      {/* Background Texture */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <FilterBar activeVibe={activeVibe} setActiveVibe={setActiveVibe} />

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 min-h-[80vh]">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]"
        >
          <AnimatePresence mode='popLayout'>
            {filteredResources.map((resource) => (
              <BentoCard 
                key={resource.id} 
                resource={resource} 
                onClick={() => setSelectedId(resource.id)}
                onHoverStart={() => setCursorColor(resource.hex)}
                onHoverEnd={() => setCursorColor(null)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Portal Overlay */}
      <AnimatePresence>
        {selectedId && (
          <DetailPortal 
            id={selectedId} 
            onClose={() => {
              setSelectedId(null);
              setCursorColor(null);
            }} 
          />
        )}
      </AnimatePresence>

      <UrbanFooter />
    </div>
  );
};

export default MainContent;