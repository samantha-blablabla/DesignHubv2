import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCursor } from './CursorContext';

const VIDEOS = [
  {
    id: 1,
    title: 'Kinetic Typography',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-196-large.mp4',
  },
  {
    id: 2,
    title: 'Fluid Simulations',
    thumb: 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-holographic-fluid-surface-loop-2747-large.mp4',
  },
  {
    id: 3,
    title: 'Abstract Data',
    thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-2766-large.mp4',
  },
  {
    id: 4,
    title: 'Cyber Particles',
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-particles-4618-large.mp4',
  },
];

interface VideoItemProps {
  item: typeof VIDEOS[0];
}

const VideoItem: React.FC<VideoItemProps> = ({ item }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setCursor } = useCursor();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auto-play on mobile when 50% visible
  const isInView = useInView(containerRef, { amount: 0.5 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop Hover Logic (UI Interaction)
  const handleMouseEnter = () => {
    if (isMobile) return;
    setCursor('text', 'PLAY');
    setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setCursor('default');
    setIsPlaying(false);
  };

  // Mobile In-View Logic (UI Interaction)
  useEffect(() => {
    if (isMobile) {
      if (isInView) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
  }, [isInView, isMobile]);

  // Sync Video Playback State
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
             // Autoplay was prevented by browser policy or interaction needed
          });
        }
      } else {
        videoRef.current.pause();
        if (!isMobile) videoRef.current.currentTime = 0; // Reset on desktop hover exit
      }
    }
  }, [isPlaying, isMobile]);

  return (
    <motion.div
      ref={containerRef}
      className="relative aspect-video rounded-2xl overflow-hidden cursor-none group bg-[#111] border border-white/5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={!isMobile ? { scale: 1.02 } : {}}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Thumbnail Layer */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${item.thumb})` }}
      />
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />

      {/* Video Layer */}
      <video
        ref={videoRef}
        src={item.video}
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: isPlaying ? 1 : 0 }}
      />

      {/* Content Overlay (UI) */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
        <h3 className={`text-white font-bold text-xl tracking-tight transition-all duration-500 ${isMobile ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100'}`}>
            {item.title}
        </h3>
      </div>
    </motion.div>
  );
};

const SmartVideoGallery = () => {
  return (
    <section className="w-full py-12 md:py-24 px-6 bg-[#060606]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="h-px flex-1 bg-white/10"></div>
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest">Motion Gallery</h2>
            <div className="h-px flex-1 bg-white/10"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {VIDEOS.map((video) => (
            <VideoItem key={video.id} item={video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartVideoGallery;