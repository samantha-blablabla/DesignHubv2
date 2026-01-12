import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionValueEvent, useScroll } from 'framer-motion';
import { Search, ArrowUpRight } from 'lucide-react';
import { useCursor } from './CursorContext';
import SmartVideoGallery from './SmartVideoGallery';
import BigFooter from './BigFooter';

// --- Types & Data ---

type Category = 'All' | 'Icons' | 'Colors' | 'Fonts' | 'Illustrations' | 'UI Kits' | 'Utilities';

interface Resource {
  id: string;
  title: string;
  category: Category;
  image: string;
  description: string;
  color: string;
}

const CATEGORIES: Category[] = ['All', 'UI Kits', 'Icons', 'Fonts', 'Illustrations', 'Colors', 'Utilities'];

const RESOURCES: Resource[] = [
  { id: '1', title: 'Neon Glitch Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', description: '200+ SVG icons with neon glow.', color: '#eab308' },
  { id: '2', title: 'Bento UI Framework', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1481487484168-9b930d5b20c8?auto=format&fit=crop&q=80&w=800', description: 'Modular component system.', color: '#3b82f6' },
  { id: '3', title: 'Cyber Grotesque', category: 'Fonts', image: 'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?auto=format&fit=crop&q=80&w=800', description: 'Variable typeface for headers.', color: '#a855f7' },
  { id: '4', title: 'Abstract Grainy Textures', category: 'Utilities', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', description: 'High-res noise textures.', color: '#22c55e' },
  { id: '5', title: 'Glassmorphism 3D', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800', description: 'Frosted glass render pack.', color: '#f97316' },
  { id: '6', title: 'Vaporwave Palette', category: 'Colors', image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&q=80&w=800', description: 'Retro-future color swatches.', color: '#eab308' },
  { id: '7', title: 'Wireframe Kit Pro', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800', description: 'Low-fidelity layout blocks.', color: '#3b82f6' },
  { id: '8', title: 'Holographic Meshes', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?auto=format&fit=crop&q=80&w=800', description: 'Iridescent gradient shapes.', color: '#a855f7' },
  { id: '9', title: 'Mono Icons', category: 'Icons', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', description: 'Minimalist line icons.', color: '#ffffff' },
  { id: '10', title: 'Brutalist Type', category: 'Fonts', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800', description: 'Bold, heavy, impact fonts.', color: '#22c55e' },
  { id: '11', title: 'Gradient Maps', category: 'Utilities', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800', description: 'Photoshop gradient presets.', color: '#f97316' },
  { id: '12', title: 'Dashboard UI', category: 'UI Kits', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', description: 'Admin panel templates.', color: '#3b82f6' },
  { id: '13', title: 'Neon Glow Palette', category: 'Colors', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', description: 'Vibrant neon color schemes.', color: '#ec4899' },
  { id: '14', title: '3D Abstract Shapes', category: 'Illustrations', image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=800', description: 'High-quality 3D renders.', color: '#14b8a6' },
  { id: '15', title: 'Grid Layout System', category: 'Utilities', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800', description: 'Responsive grid templates.', color: '#8b5cf6' },
  { id: '16', title: 'Tech Icons Pack', category: 'Icons', image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=compress&cs=tinysrgb&w=800', description: 'Modern tech icon set.', color: '#06b6d4' },
];

// --- Components ---

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = "" }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return; // Disable on mobile
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.5);
    y.set((e.clientY - centerY) * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.button>
  );
};

interface TiltCardProps {
  resource: Resource;
  index: number;
}

const TiltCard: React.FC<TiltCardProps> = React.memo(({ resource, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  const { setCursor } = useCursor();

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Disable on mobile
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    x.set(mouseXVal / width - 0.5);
    y.set(mouseYVal / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setCursor('default');
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
        setCursor('text', 'VIEW');
    }
  };

  const isFeatured = (index + 1) % 4 === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative group ${isFeatured ? 'md:col-span-2' : 'col-span-1'} h-[340px] perspective-1000`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Border Beam Effect Container - Slightly larger than content */}
      <div className="absolute -inset-[1px] rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
          <div 
             className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
             style={{
               background: `conic-gradient(from 90deg at 50% 50%, #0000 0%, ${resource.color} 50%, #0000 100%)`
             }}
          />
      </div>

      <motion.div
        className="w-full h-full relative rounded-3xl bg-[#111111] border border-white/5 overflow-hidden z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl z-0"
          style={{ background: resource.color }}
        />
        
        <div className="w-full h-[65%] overflow-hidden relative z-10">
          <img 
            src={resource.image} 
            alt={resource.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111]" />
        </div>

        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 pointer-events-none">
          <div className="pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
             <span style={{ color: resource.color }} className="text-[10px] font-bold uppercase tracking-widest mb-2 block">{resource.category}</span>
             <h3 className="text-white text-xl font-bold leading-tight mb-1">{resource.title}</h3>
             <p className="text-slate-500 text-sm line-clamp-1">{resource.description}</p>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
           <MagneticButton className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-slate-200 transition-colors cursor-pointer">
              <ArrowUpRight className="w-5 h-5" />
           </MagneticButton>
        </div>
      </motion.div>
    </motion.div>
  );
});

const MainContent = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { setCursor } = useCursor();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  const filteredResources = activeCategory === 'All' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.category === activeCategory);

  return (
    <div className="relative w-full min-h-screen bg-[#060606] text-white selection:bg-yellow-500 selection:text-black pb-0">
       
       {/* Sticky Filter Navigation */}
       <div className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-[#060606]/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
           {/* Filters */}
           <div className="relative w-full md:w-auto min-w-0">
             {/* Gradient Mask for Scroll Hint (Mobile) */}
             <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#060606] via-[#060606]/80 to-transparent pointer-events-none z-20 md:hidden" />
             
             <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto items-center pr-12 md:pr-0">
               {CATEGORIES.map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`relative px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap flex-shrink-0 ${activeCategory === cat ? 'text-black' : 'text-slate-400 hover:text-white'}`}
                   onMouseEnter={() => setCursor('default')}
                 >
                   {activeCategory === cat && (
                     <motion.div 
                       layoutId="activeFilter"
                       className="absolute inset-0 bg-white rounded-full"
                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     />
                   )}
                   <span className="relative z-10">{cat}</span>
                 </button>
               ))}
             </div>
           </div>
           
           {/* Search */}
           <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-2 w-full md:w-auto">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                placeholder="Search resources..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full md:w-48"
              />
           </div>
         </div>
       </div>

       {/* Gallery Grid */}
       <div className="max-w-7xl mx-auto px-6 mt-8 mb-32">
         <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
           <AnimatePresence mode='popLayout'>
             {filteredResources.map((resource, i) => (
               <TiltCard key={resource.id} resource={resource} index={i} />
             ))}
           </AnimatePresence>
         </motion.div>
       </div>
       
       {/* Smart Video Showcase */}
       <SmartVideoGallery />

       {/* Big Urban Footer */}
       <BigFooter />
    </div>
  );
};

export default MainContent;