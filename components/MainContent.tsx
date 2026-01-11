import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionValueEvent, useScroll } from 'framer-motion';
import { Search, ArrowUpRight, Zap, Twitter, Instagram, Github, Dribbble, ArrowRight } from 'lucide-react';

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

const TiltCard: React.FC<TiltCardProps> = ({ resource, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    >
      <motion.div
        className="w-full h-full relative rounded-3xl bg-[#111111] border border-white/5 overflow-hidden"
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
};

const SocialLink = ({ Icon, href, color }: { Icon: React.ElementType, href: string, color: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a 
      href={href}
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 border border-white/5 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? color : 'rgba(255,255,255,0.05)',
        backgroundColor: isHovered ? `${color}15` : 'rgba(255,255,255,0.05)',
        boxShadow: isHovered ? `0 0 15px ${color}30` : 'none'
      }}
    >
      <Icon 
        className="w-5 h-5 transition-all duration-300"
        style={{
          color: isHovered ? color : '#94a3b8',
          filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none'
        }}
      />
    </a>
  );
};

const MainContent = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

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
           <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto items-center">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`relative px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${activeCategory === cat ? 'text-black' : 'text-slate-400 hover:text-white'}`}
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
       
       {/* Expanded Footer */}
       <footer className="border-t border-white/10 bg-[#080808] relative z-10">
         <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
              {/* Brand Section */}
              <div className="md:col-span-4 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <Zap className="w-6 h-6 text-black fill-current" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">DesignHub</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                  The definitive archive for digital creators. Curating the finest UI kits, icons, and assets for the modern web. Built for speed, aesthetics, and utility.
                </p>
                <div className="flex gap-4 pt-2">
                    <SocialLink Icon={Twitter} href="#" color="#38bdf8" />
                    <SocialLink Icon={Instagram} href="#" color="#e1306c" />
                    <SocialLink Icon={Dribbble} href="#" color="#ea4c89" />
                    <SocialLink Icon={Github} href="#" color="#ffffff" />
                </div>
              </div>

              {/* Navigation Links */}
              <div className="md:col-span-3 space-y-6">
                 <h4 className="text-white font-bold text-lg tracking-wide">Explore</h4>
                 <div className="flex flex-col gap-4 text-sm text-slate-400">
                    <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" /> All Resources
                    </a>
                    <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300">Trending</a>
                    <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300">Submit Resource</a>
                    <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300">About Us</a>
                 </div>
              </div>

              {/* Newsletter */}
              <div className="md:col-span-5 space-y-6">
                <div>
                   <h4 className="text-white font-bold text-lg tracking-wide mb-2">Join the Collective</h4>
                   <p className="text-slate-500 text-sm">Weekly drops of free resources, straight to your inbox. No spam, just fire assets.</p>
                </div>
                <form className="relative group max-w-md" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="email@address.com" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-14 text-sm text-white placeholder-slate-600 outline-none focus:border-yellow-500 focus:bg-white/10 transition-all duration-300"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-500 rounded-lg text-black hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
                <div className="flex gap-6 text-xs text-slate-600">
                    <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-600 text-xs tracking-wider">© 2024 DESIGN HUB. TOKYO.</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                   <p className="text-slate-600 text-xs font-mono uppercase">Systems Operational</p>
                </div>
            </div>
         </div>
       </footer>
    </div>
  );
};

export default MainContent;