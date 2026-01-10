import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Search, X, ExternalLink, ArrowRight, Box, Type, MoveUpRight, Zap } from 'lucide-react';
import { useLenis } from './ScrollWrapper';

// --- 1. Urban Design Dummy Data ---

type Vibe = 'All' | 'Cyberpunk' | 'Brutalist' | 'Minimalist' | 'Glassmorphism';
type Category = 'UI Kit' | 'Icons' | '3D' | 'Fonts';

interface Resource {
  id: string;
  title: string;
  category: Category;
  vibe: Vibe;
  color: string;
  hex: string;
  image: string;
  description: string;
  size: 'normal' | 'large' | 'tall';
}

const RESOURCES: Resource[] = [
  { id: 'res-1', title: 'Neon Glyph Icons', category: 'Icons', vibe: 'Cyberpunk', color: 'yellow-500', hex: '#eab308', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', description: '200+ SVG icons with neon glow.', size: 'large' },
  { id: 'res-2', title: 'Concrete UI Kit', category: 'UI Kit', vibe: 'Brutalist', color: 'blue-500', hex: '#3b82f6', image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800', description: 'Raw aesthetics and thick borders.', size: 'normal' },
  { id: 'res-3', title: 'Retro-Futurism Fonts', category: 'Fonts', vibe: 'Cyberpunk', color: 'purple-500', hex: '#a855f7', image: 'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?auto=format&fit=crop&q=80&w=800', description: 'Variable typefaces for sci-fi.', size: 'tall' },
  { id: 'res-4', title: 'Frost Glass 3D', category: '3D', vibe: 'Glassmorphism', color: 'green-500', hex: '#22c55e', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', description: 'Frosted glass textures.', size: 'normal' },
  { id: 'res-5', title: 'Mono-Grid System', category: 'UI Kit', vibe: 'Minimalist', color: 'orange-500', hex: '#f97316', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800', description: 'Strict 12-column grid.', size: 'normal' },
  { id: 'res-6', title: 'Acid Graphics Pack', category: 'Icons', vibe: 'Brutalist', color: 'yellow-500', hex: '#eab308', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800', description: 'Distorted textures.', size: 'large' },
  { id: 'res-7', title: 'Holographic Meshes', category: '3D', vibe: 'Cyberpunk', color: 'blue-500', hex: '#3b82f6', image: 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?auto=format&fit=crop&q=80&w=800', description: 'Iridescent gradient meshes.', size: 'tall' },
  { id: 'res-8', title: 'Clean Dash', category: 'UI Kit', vibe: 'Minimalist', color: 'green-500', hex: '#22c55e', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', description: 'SaaS dashboard kit.', size: 'normal' },
];

const VIBES: Vibe[] = ['All', 'Cyberpunk', 'Brutalist', 'Glassmorphism', 'Minimalist'];

// --- 2. Shared Components ---

const CustomCursor = ({ colorHex }: { colorHex: string | null }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 700 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 700 });

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
      style={{ x: cursorX, y: cursorY, backgroundColor: colorHex || '#ffffff', scale: colorHex ? 2.5 : 1 }}
    >
      {colorHex && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex items-center justify-center">
          <MoveUpRight className="text-black w-2 h-2" />
        </motion.div>
      )}
    </motion.div>
  );
};

const FilterBar = ({ activeVibe, setActiveVibe }: { activeVibe: Vibe, setActiveVibe: (v: Vibe) => void }) => {
  // Task 3: Sticky Header Transition (Blur after y > 100)
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100 && !isScrolled) setIsScrolled(true);
    else if (latest <= 100 && isScrolled) setIsScrolled(false);
  });

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#060606]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mr-2 shrink-0">Filter by Vibe:</span>
          {VIBES.map((vibe) => (
            <button
              key={vibe}
              onClick={() => setActiveVibe(vibe)}
              className={`relative px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${activeVibe === vibe ? 'text-black' : 'text-slate-400 hover:text-white'}`}
            >
              {activeVibe === vibe && (
                <motion.div layoutId="activeVibe" className="absolute inset-0 bg-white rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
              <span className="relative z-10">{vibe}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 bg-white/5 w-full md:w-auto">
           <Search className="w-4 h-4 text-slate-500" />
           <input type="text" placeholder="Search resources..." className="bg-transparent border-none focus:outline-none text-white text-sm placeholder-slate-600 w-full" />
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
  index: number;
}

const BentoCard: React.FC<BentoCardProps> = ({ resource, onClick, onHoverStart, onHoverEnd, index }) => {
  const spanClass = 
    resource.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
    resource.size === 'tall' ? 'md:row-span-2' : 
    'col-span-1';

  // Task 2: Z-Depth Parallax Logic
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Determine speed factor: 
  // 0.8x (slower, looks further away) | 1x (normal) | 1.2x (faster, looks closer)
  let speedFactor = 1;
  if (index % 3 === 0) speedFactor = 0.8; // Grid background feel
  else if (index % 3 === 1) speedFactor = 1.2; // Featured feel
  else speedFactor = 1.0; 

  // Calculate distinct offset based on speed
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speedFactor]);
  
  // Use a slight scale transform for "breathing" grid effect
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      layoutId={`card-${resource.id}`}
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={{ y, scale }} 
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className={`group relative ${spanClass} rounded-3xl overflow-hidden cursor-none bg-[#111111] border border-white/10 h-full min-h-[300px]`}
    >
      <div className={`absolute inset-0 border-2 border-${resource.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 rounded-3xl`} />
      <motion.div layoutId={`image-${resource.id}`} className="w-full h-full absolute inset-0">
        <img src={resource.image} alt={resource.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full p-6 z-10">
        <motion.div layoutId={`badge-${resource.id}`} className={`inline-block px-2 py-1 mb-3 rounded-md bg-${resource.color}/20 border border-${resource.color}/30 backdrop-blur-md`}>
          <span className={`text-${resource.color} text-[10px] font-bold uppercase tracking-widest`}>{resource.vibe}</span>
        </motion.div>
        <motion.h3 layoutId={`title-${resource.id}`} className="text-white text-2xl font-bold leading-tight mb-1 group-hover:translate-x-2 transition-transform duration-300">{resource.title}</motion.h3>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-400 text-xs uppercase tracking-wider">{resource.category}</motion.p>
      </div>
    </motion.div>
  );
};

// ... DetailPortal and UrbanFooter remain the same but included for context if needed (omitted for brevity as per instructions to only return changed files in XML) ...

const DetailPortal = ({ id, onClose }: { id: string, onClose: () => void }) => {
    // Keep existing portal logic
    const resource = RESOURCES.find(r => r.id === id);
    const { stopScroll, startScroll } = useLenis();
    useEffect(() => { stopScroll(); return () => startScroll(); }, [stopScroll, startScroll]);
    if (!resource) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div layoutId={`card-${resource.id}`} className="relative w-full max-w-5xl h-[85vh] bg-[#0c0c0c] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row">
                <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-lg border border-white/10"><X className="w-6 h-6" /></button>
                <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden">
                    <motion.div layoutId={`image-${resource.id}`} className="w-full h-full">
                        <img src={resource.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] md:bg-gradient-to-r md:from-transparent md:to-[#0c0c0c]" />
                    </motion.div>
                </div>
                <div className="w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <motion.div layoutId={`badge-${resource.id}`} className={`inline-block px-3 py-1 rounded-full bg-${resource.color}/10 border border-${resource.color}/20 mb-4`}><span className={`text-${resource.color} font-bold tracking-widest uppercase text-xs`}>{resource.vibe}</span></motion.div>
                            <motion.h2 layoutId={`title-${resource.id}`} className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-2">{resource.title}</motion.h2>
                        </div>
                    </div>
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
                        <p className="text-slate-300 text-lg leading-relaxed border-l-2 border-white/10 pl-6">{resource.description}</p>
                        <div className="flex gap-4 pt-4">
                            <button className={`flex-1 py-4 bg-${resource.color} text-black font-bold text-lg rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 group`}><Zap className="w-5 h-5 fill-black" /> Download Access</button>
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
        <h2 className="text-[10vw] font-black text-transparent stroke-text leading-none opacity-30">DESIGN HUB.</h2>
        <div className="border-t border-white/10 pt-8 flex justify-between items-center text-xs text-slate-600 uppercase tracking-widest"><span>© 2024</span><span>Tokyo</span></div>
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 2px #333; }`}</style>
    </footer>
);

const MainContent: React.FC = () => {
  const [activeVibe, setActiveVibe] = useState<Vibe>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cursorColor, setCursorColor] = useState<string | null>(null);

  const filteredResources = activeVibe === 'All' ? RESOURCES : RESOURCES.filter(r => r.vibe === activeVibe);

  return (
    <div className="relative w-full min-h-screen bg-[#060606] cursor-none">
      <CustomCursor colorHex={cursorColor} />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <FilterBar activeVibe={activeVibe} setActiveVibe={setActiveVibe} />
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 min-h-[80vh] mt-24">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]">
          <AnimatePresence mode='popLayout'>
            {filteredResources.map((resource, index) => (
              <BentoCard 
                key={resource.id} 
                index={index}
                resource={resource} 
                onClick={() => setSelectedId(resource.id)}
                onHoverStart={() => setCursorColor(resource.hex)}
                onHoverEnd={() => setCursorColor(null)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
      <AnimatePresence>{selectedId && (<DetailPortal id={selectedId} onClose={() => { setSelectedId(null); setCursorColor(null); }} />)}</AnimatePresence>
      <UrbanFooter />
    </div>
  );
};

export default MainContent;