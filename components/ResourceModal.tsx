import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Tag } from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  link: string;
  tags?: string[];
}

interface ResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ resource, isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!resource) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors group"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Image */}
                <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1.5 rounded-full bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider">
                      {resource.category}
                    </div>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      {resource.title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6">
                      {resource.description}
                    </p>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-4 h-4 text-slate-500" />
                          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">View Resource</span>
                    <ExternalLink className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />

                    {/* Animated Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResourceModal;
