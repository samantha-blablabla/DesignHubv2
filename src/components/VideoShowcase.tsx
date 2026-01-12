import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from './CursorContext';
import { supabase } from '../lib/supabase';

interface Video {
  id: number;
  title: string;
  thumb: string;
  video: string;
}

interface VideoItemProps {
  item: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ item }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setCursor } = useCursor();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    setCursor('text', 'PLAY');
    setIsPlaying(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setCursor('default');
    setIsPlaying(false);
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <motion.div
      className="relative aspect-video rounded-2xl overflow-hidden cursor-none group bg-[#111] border border-white/5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Thumbnail */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${item.thumb})` }}
      />
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />

      {/* Video */}
      <video
        ref={videoRef}
        src={item.video}
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: isPlaying ? 1 : 0 }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
        <h3 className="text-white font-bold text-xl tracking-tight translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            {item.title}
        </h3>
      </div>
    </motion.div>
  );
};

const VideoShowcase = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos from Supabase
  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setVideos(data as Video[]);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <section className="w-full py-24 px-6 bg-[#060606]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-white/10"></div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Motion Gallery</h2>
            <div className="h-px flex-1 bg-white/10"></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <VideoItem key={video.id} item={video} />
            ))}
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No videos found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoShowcase;
