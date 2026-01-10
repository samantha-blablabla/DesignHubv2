import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Download, ExternalLink, ArrowRight, Heart } from 'lucide-react';

// --- Types & Mock Data ---

type Category = 'All' | 'UI Kits' | 'Icons' | '3D' | 'Fonts' | 'Mockups';

type Resource = {
  id: string;
  title: string;
  category: Category;
  image: string;
  author: string;
  isNew?: boolean;
  isFree?: boolean;
  size: 'small' | 'large' | 'wide';
  color: string; // Tailwind color class for hover glow (e.g., "blue-500")
  description: string;
};

const CATEGORIES: Category[] = ['All', 'UI Kits', 'Icons', '3D', 'Fonts', 'Mockups'];

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Cyberpunk UI Kit',
    category: 'UI Kits',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    author: 'NeonLab',
    isNew: true,
    size: 'large',
    color: 'yellow-500',
    description: 'A complete design system for futuristic interfaces. Includes over 200 components, variants, and glowing effects.'
  },
  {
    id: '2',
    title: 'Glass Icons',
    category: 'Icons',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    author: 'VividPixels',
    isFree: true,
    size: 'small',
    color: 'blue-500',
    description: 'Beautifully crafted frosted glass icons for modern dashboards.'
  },
  {
    id: '3',
    title: 'Abstract 3D Shapes',
    category: '3D',
    image: 'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?auto=format&fit=crop&q=80&w=600',
    author: 'RenderGods',
    size: 'small',
    color: 'purple-500',
    description: 'High-resolution abstract 3D renders perfect for hero sections and backgrounds.'
  },
  {
    id: '4',
    title: 'Neo-Grotesque Font',
    category: 'Fonts',
    image: 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?auto=format&fit=crop&q=80&w=800',
    author: 'TypeFoundry',
    size: 'wide',
    color: 'green-500',
    description: 'A versatile variable font family with aggressive ink traps and modern spacing.'
  },
  {
    id: '5',
    title: 'iPhone 15 Mockups',
    category: 'Mockups',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600',
    author: 'DeviceStudio',
    size: 'small',
    color: 'orange-500',
    description: 'Ultra-realistic clay and realistic mockups for your mobile designs.'
  },
  {
    id: '6',
    title: 'Holographic Textures',
    category: '3D',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600',
    author: 'TextureMate',
    isNew: true,
    size: 'small',
    color: 'blue-500',
    description: 'Iridescent foil and holographic texture pack.'
  },
  {
    id: '7',
    title: 'Brutalist Web Layouts',
    category: 'UI Kits',
    image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&q=80&w=1000',
    author: 'BoldFrame',
    size: 'large',
    color: 'red-500',
    description: 'Start your next brutalist project with these wireframes and layout grids.'
  }
];

// --- Sub-Components ---

const ResourceCard: React.FC<{ resource: Resource; onClick: () => void }> = ({ resource, onClick }) => {
  // Map size to grid spans
  const spanClass = 
    resource.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
    resource.size === 'wide' ? 'md:col-span-2' : 
    'col-span-1';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={`
        group relative ${spanClass} 
        bg-[#111111] border border-white/5 rounded-3xl overflow-hidden cursor-pointer
        hover:border-${resource.color}/50 transition-colors duration-300
      `}
    >
      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-${resource.color}/5 pointer-events-none`} />
      <div className={`absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl bg-${resource.color}`} />

      {/* Image */}
      <div className="relative w-full h-full aspect-[4/3] md:aspect-auto overflow-hidden">
        <img 
          src={resource.image} 
          alt={resource.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {resource.isNew && (
            <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-full">New</span>
          )}
          {resource.isFree && (
            <span className="px-3 py-1 bg-green-500 text-black text-xs font-bold uppercase tracking-wider rounded-full">Free</span>
          )}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        <p className={`text-${resource.color} text-xs font-bold uppercase tracking-widest mb-2`}>{resource.category}</p>
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:underline decoration-2 underline-offset-4">
              {resource.title}
            </h3>
            <p className="text-slate-400 text-sm mt-1">by {resource.author}</p>
          </div>
          <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300`}>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FilterBar: React.FC<{ active: Category; setActive: (c: Category) => void }> = ({ active, setActive }) => {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060606]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`
                relative px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors
                ${active === cat ? 'text-black' : 'text-slate-400 hover:text-white'}
              `}
            >
              {active === cat && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

const ResourceDetailPanel: React.FC<{ resource: Resource | null; onClose: () => void }> = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 z-50 w-full md:w-[500px] h-screen bg-[#111111] border-l border-white/10 shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-white" />
            </button>
            <span className="text-slate-400 text-sm uppercase tracking-wider">Details</span>
        </div>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Heart className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ExternalLink className="w-5 h-5 text-white" />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 border border-white/5">
            <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex items-start justify-between mb-2">
             <h2 className="text-3xl font-bold text-white leading-tight">{resource.title}</h2>
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-${resource.color}/20 text-${resource.color} border border-${resource.color}/20`}>
                 {resource.category}
             </span>
        </div>
        
        <p className="text-slate-500 text-sm mb-6">By {resource.author}</p>

        <p className="text-slate-300 leading-relaxed mb-8">
            {resource.description}
        </p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-slate-500 text-xs uppercase mb-1">File Size</p>
                <p className="text-white font-mono">245 MB</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-slate-500 text-xs uppercase mb-1">License</p>
                <p className="text-white font-mono">Personal Use</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-slate-500 text-xs uppercase mb-1">Format</p>
                <p className="text-white font-mono">.FIG, .BLEND</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-slate-500 text-xs uppercase mb-1">Version</p>
                <p className="text-white font-mono">v2.4.0</p>
            </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/10 bg-[#111111]">
        <button className={`w-full py-4 bg-${resource.color} hover:opacity-90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all`}>
            <Download className="w-5 h-5" />
            Download Resource
        </button>
      </div>
    </motion.div>
  );
};

const Footer: React.FC = () => {
    return (
        <footer className="relative border-t border-white/10 bg-black pt-20 pb-10 px-6 overflow-hidden">
             {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none">
                            STAY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-white">CREATIVE.</span>
                        </h2>
                        <p className="text-slate-400 max-w-md text-lg">
                            Join 50,000+ designers getting high-quality assets delivered to their inbox weekly. No spam, just fire.
                        </p>
                    </div>

                    <div className="flex flex-col justify-end">
                        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-2 flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="flex-1 bg-transparent border-none text-white px-4 focus:outline-none placeholder-slate-600"
                            />
                            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
                    <p className="text-slate-600 text-sm">© 2024 DesignHub. All rights reserved.</p>
                    <div className="flex gap-8">
                        {['Twitter', 'Instagram', 'Dribbble', 'LinkedIn'].map((social, i) => (
                             <a 
                                key={social} 
                                href="#" 
                                className="text-slate-500 hover:text-white font-medium transition-colors hover:underline underline-offset-4"
                             >
                                {social}
                             </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

// --- Main Content Component ---

const MainContent: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Filter Logic
  const filteredResources = activeCategory === 'All' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.category === activeCategory);

  return (
    <div className="relative w-full min-h-screen bg-[#060606]">
      {/* Background Grid Pattern (Extending from Hero) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <FilterBar active={activeCategory} setActive={setActiveCategory} />

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto"
        >
            <AnimatePresence>
                {filteredResources.map((resource) => (
                    <ResourceCard 
                        key={resource.id} 
                        resource={resource} 
                        onClick={() => setSelectedResource(resource)}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
      </section>

      <Footer />

      {/* Overlay Panel */}
      <AnimatePresence>
        {selectedResource && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedResource(null)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                <ResourceDetailPanel 
                    resource={selectedResource} 
                    onClose={() => setSelectedResource(null)} 
                />
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainContent;