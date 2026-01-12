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
    // DEMO: Using dummy data instead of Supabase for testing
    // Replace with Supabase fetch when database is ready
    const DUMMY_VIDEOS: MotionAsset[] = [
      {
        id: 1,
        title: 'Cosmic Nebula',
        duration: '00:15',
        thumb: 'https://images.pexels.com/videos/3141211/free-video-3141211.jpg?auto=compress&w=800',
        video: 'https://videos.pexels.com/video-files/3141211/3141211-hd_1920_1080_30fps.mp4',
        link: '#project-nebula',
        description: 'Abstract colorful ink spreading in water',
        tags: ['abstract', 'fluid', 'colorful']
      },
      {
        id: 2,
        title: 'Digital Rain',
        duration: '00:12',
        thumb: 'https://images.pexels.com/videos/2278095/pictures/preview-0.jpg?auto=compress&w=800',
        video: 'https://videos.pexels.com/video-files/2278095/2278095-hd_1920_1080_25fps.mp4',
        link: '#project-rain',
        description: 'Matrix-style digital code falling',
        tags: ['digital', 'code', 'tech']
      },
      {
        id: 3,
        title: 'Particle Flow',
        duration: '00:20',
        thumb: 'https://images.pexels.com/videos/4111346/free-video-4111346.jpg?auto=compress&w=800',
        video: 'https://videos.pexels.com/video-files/4111346/4111346-hd_1920_1080_30fps.mp4',
        link: '#project-particles',
        description: 'Floating particles with depth and glow',
        tags: ['particles', 'motion', 'glow']
      },
      {
        id: 4,
        title: 'Neon Waves',
        duration: '00:18',
        thumb: 'https://images.pexels.com/videos/3843433/pictures/preview-4.jpg?auto=compress&w=800',
        video: 'https://videos.pexels.com/video-files/3843433/3843433-hd_1920_1080_30fps.mp4',
        link: '#project-neon',
        description: 'Vibrant neon waves in motion',
        tags: ['neon', 'waves', 'vibrant']
      },
      {
        id: 5,
        title: 'Abstract Paint',
        duration: '00:16',
        thumb: 'https://images.pexels.com/videos/3129782/free-video-3129782.jpg?auto=compress&w=800',
        video: 'https://videos.pexels.com/video-files/3129782/3129782-hd_1920_1080_30fps.mp4',
        link: '#project-paint',
        description: 'Paint colors mixing and swirling',
        tags: ['paint', 'mixing', 'fluid']
      },
      {
        id: 6,
        title: 'Smoke Art',
        duration: '00:14',
        thumb: 'https://images.pexels.com/videos/2868566/pictures/preview-1.jpg?auto=compress&w=800',
        video: 'https://videos.pexels.com/video-files/2868566/2868566-hd_1920_1080_30fps.mp4',
        link: '#project-smoke',
        description: 'Elegant smoke patterns in slow motion',
        tags: ['smoke', 'elegant', 'slow-mo']
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setVideos(DUMMY_VIDEOS);
      setLoading(false);
    }, 500);

    /* ORIGINAL SUPABASE CODE - Uncomment when database is ready:
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
    */
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