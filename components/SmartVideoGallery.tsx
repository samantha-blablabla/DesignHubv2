import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useCursor } from './CursorContext';
import { Play, Pause, Volume2, VolumeX, Maximize2, ArrowUpRight } from 'lucide-react';
import { supabase, type MotionAsset } from '../lib/supabase';

interface VideoItemProps {
  item: MotionAsset;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const VideoItem: React.FC<VideoItemProps> = React.memo(({ item, isHovered, isAnyHovered, onHoverStart, onHoverEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setCursor } = useCursor();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Performance: Only check visibility logic if needed
  const isInView = useInView(containerRef, { amount: 0.6, margin: "0px 0px -100px 0px" });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Logic: Decide if video should play
  useEffect(() => {
    let shouldPlay = false;

    if (isMobile) {
      // Mobile: Play if in center of view
      shouldPlay = isInView;
    } else {
      // Desktop: Play only on Hover
      shouldPlay = isHovered;
    }

    setIsPlaying(shouldPlay);

    const video = videoRef.current;
    if (video) {
      if (shouldPlay) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { /* Auto-play prevented */ });
        }
      } else {
        video.pause();
        if (!isMobile) video.currentTime = 0; // Reset on desktop for replay feel
      }
    }
  }, [isHovered, isInView, isMobile]);

  // Update Progress Bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  // Cinema Mode Styles
  // If something else is hovered, and I am NOT hovered -> Dim me
  const isDimmed = isAnyHovered && !isHovered && !isMobile;

  return (
    <motion.a
      href={item.link}
      ref={containerRef}
      className={`relative block aspect-video rounded-2xl overflow-hidden bg-[#111] border border-white/5 transition-all duration-500 group ${isDimmed ? 'opacity-30 scale-95 blur-[2px] grayscale' : 'opacity-100 scale-100 grayscale-0'}`}
      onMouseEnter={() => {
        if (!isMobile) {
            onHoverStart();
            setCursor('text', 'VIEW'); // Updated to explicit action
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
            onHoverEnd();
            setCursor('default');
        }
      }}
    >
      {/* Thumbnail */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${item.thumb})` }}
      />
      
      {/* Dark Overlay for Text Readability (When not playing) */}
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />

      {/* Video Element */}
      <video
        ref={videoRef}
        src={item.video}
        loop
        muted
        playsInline
        preload="metadata" // Performance: Don't load full video until needed
        onTimeUpdate={handleTimeUpdate}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none" // Ensure clicks pass to the anchor
        style={{ opacity: isPlaying ? 1 : 0 }}
      />

      {/* Floating UI Overlay - Visible on Hover/Play */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
        
        {/* Top Right Status */}
        <div className={`flex justify-end items-start transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white flex items-center gap-2 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                REC
            </div>
        </div>
        
        {/* Hover Arrow (Top Right) - Only shows when hovered/playing */}
        <div className={`absolute top-6 right-6 transition-all duration-300 transform ${isPlaying ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-2 translate-y-2'}`}>
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
            </div>
        </div>

        {/* Bottom Info */}
        <div className={`transform transition-all duration-500 ${isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-100'}`}>
            <div className="flex justify-between items-end mb-3">
                <div>
                    <h3 className="text-white font-bold text-lg md:text-xl tracking-tight leading-none mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-xs font-mono">{item.duration} • 4K 60FPS</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-yellow-500"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                />
            </div>
        </div>
      </div>
    </motion.a>
  );
});

const SmartVideoGallery = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [videos, setVideos] = useState<MotionAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // === CLAUDE CODE: Fetch motion assets from Supabase ===
  useEffect(() => {
    async function fetchMotionAssets() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('motion_assets')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setVideos(data as MotionAsset[]);
      } catch (error) {
        console.error('Error fetching motion assets:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMotionAssets();
  }, []);

  return (
    <section className="w-full py-12 md:py-24 px-6 bg-[#060606] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter">
                    Motion <span className="text-slate-600">Archive</span>
                </h2>
            </div>
            <p className="text-slate-500 text-sm md:max-w-md leading-relaxed">
                Hover to preview high-fidelity motion assets. Click to view project details.
            </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {videos.map((video) => (
                <VideoItem
                    key={video.id}
                    item={video}
                    isHovered={hoveredId === video.id}
                    isAnyHovered={hoveredId !== null}
                    onHoverStart={() => setHoveredId(video.id)}
                    onHoverEnd={() => setHoveredId(null)}
                />
              ))}
            </div>

            {/* Empty State */}
            {!loading && videos.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg">No motion assets found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SmartVideoGallery;