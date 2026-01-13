-- Update all video sources to Pexels (reliable, ad-blocker friendly)
-- Replace Mixkit URLs with verified working Pexels videos
-- Date: 2026-01-12

-- Video 1: Kinetic Typography → Abstract liquid motion
UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3129671/free-video-3129671.jpg?auto=compress&cs=tinysrgb&w=1000'
WHERE id = 1;

-- Video 2: Fluid Simulations → Holographic waves
UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/2278095/2278095-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/2278095/pexels-photo-2278095.jpeg?auto=compress&cs=tinysrgb&w=1000'
WHERE id = 2;

-- Video 3: Abstract Data → Digital particles
UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3141206/3141206-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3141206/pexels-photo-3141206.jpeg?auto=compress&cs=tinysrgb&w=1000'
WHERE id = 3;

-- Video 4: Cyber Particles → Tech network visualization
UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3130284/pexels-photo-3130284.jpeg?auto=compress&cs=tinysrgb&w=1000'
WHERE id = 4;

-- Verify updates
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count FROM motion_assets WHERE video LIKE '%pexels.com%';
  RAISE NOTICE 'Successfully updated % video sources to Pexels CDN', updated_count;
END $$;
