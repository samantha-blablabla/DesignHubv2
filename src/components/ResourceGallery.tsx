import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionValueEvent, useScroll } from 'framer-motion';
import { Search, ArrowUpRight } from 'lucide-react';
import { useCursor } from './CursorContext';
import { supabase } from '../lib/supabase';

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
  onClick: () => void;
}

const TiltCard: React.FC<TiltCardProps> = ({ resource, index, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  const { setCursor } = useCursor();

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
    setCursor('default');
  };

  const handleMouseEnter = () => {
    setCursor('text', 'VIEW');
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
      onClick={onClick}
    >
      {/* Border Beam Effect Container */}
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
};

const ResourceGallery = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(12); // Initial: 12 items
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const { scrollY } = useScroll();
  const { setCursor } = useCursor();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  // Fetch resources from Supabase
  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setResources(data as Resource[]);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Display limited resources
  const displayedResources = filteredResources.slice(0, displayCount);
  const hasMore = filteredResources.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

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

           {/* Search */}
           <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-2 w-full md:w-auto">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full md:w-48"
              />
           </div>
         </div>
       </div>

       {/* Gallery Grid */}
       <div className="max-w-7xl mx-auto px-6 mt-8 mb-16">
         {loading ? (
           <div className="flex items-center justify-center min-h-[400px]">
             <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
           </div>
         ) : (
           <>
             <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
               <AnimatePresence mode='popLayout'>
                 {displayedResources.map((resource, i) => (
                   <TiltCard
                     key={resource.id}
                     resource={resource}
                     index={i}
                     onClick={() => setSelectedResource(resource)}
                   />
                 ))}
               </AnimatePresence>
             </motion.div>

             {/* Load More Button */}
             {hasMore && (
               <div className="flex justify-center mt-12 mb-16">
                 <motion.button
                   onClick={handleLoadMore}
                   onMouseEnter={() => setCursor('default')}
                   className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white font-bold transition-all"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   Load More ({filteredResources.length - displayCount} remaining)
                 </motion.button>
               </div>
             )}
           </>
         )}

         {!loading && filteredResources.length === 0 && (
           <div className="text-center py-32">
             <p className="text-slate-500 text-lg">No resources found.</p>
           </div>
         )}
       </div>

       {/* Resource Detail Modal */}
       <AnimatePresence>
         {selectedResource && (
           <>
             {/* Backdrop */}
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
               onClick={() => setSelectedResource(null)}
             />

             {/* Modal Content */}
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 50 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
               onClick={() => setSelectedResource(null)}
             >
               <div
                 className="relative max-w-4xl w-full bg-[#111] rounded-3xl overflow-hidden border border-white/10 pointer-events-auto"
                 onClick={(e) => e.stopPropagation()}
               >
                 {/* Close Button */}
                 <button
                   onClick={() => setSelectedResource(null)}
                   className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors"
                   onMouseEnter={() => setCursor('default')}
                 >
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>

                 {/* Image */}
                 <div className="w-full h-[400px] overflow-hidden relative">
                   <img
                     src={selectedResource.image}
                     alt={selectedResource.title}
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111]" />
                 </div>

                 {/* Content */}
                 <div className="p-8">
                   <span
                     style={{ color: selectedResource.color }}
                     className="text-xs font-bold uppercase tracking-widest mb-3 block"
                   >
                     {selectedResource.category}
                   </span>
                   <h2 className="text-4xl font-bold text-white mb-4">{selectedResource.title}</h2>
                   <p className="text-slate-400 text-lg leading-relaxed mb-8">
                     {selectedResource.description}
                   </p>

                   {/* Action Buttons */}
                   <div className="flex gap-4">
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors"
                       onMouseEnter={() => setCursor('default')}
                     >
                       View Details
                     </motion.button>
                     <motion.button
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
                       onMouseEnter={() => setCursor('default')}
                     >
                       Download
                     </motion.button>
                   </div>
                 </div>
               </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>
    </div>
  );
};

export default ResourceGallery;
