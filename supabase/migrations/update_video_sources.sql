-- Update motion_assets with reliable Pexels video URLs
-- Run this in Supabase Dashboard → SQL Editor

-- Update video URLs to Pexels (more reliable, no blocking issues)
UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3129671/free-video-3129671.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500'
WHERE title = 'Kinetic Typography';

UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/2278095/2278095-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/2278095/pexels-photo-2278095.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
WHERE title = 'Fluid Simulations';

UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3141206/3141206-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3141206/pexels-photo-3141206.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
WHERE title = 'Abstract Data';

UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3130284/pexels-photo-3130284.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
WHERE title = 'Cyber Particles';

-- Verify updates
SELECT id, title,
  SUBSTRING(video, 1, 50) as video_preview,
  SUBSTRING(thumb, 1, 50) as thumb_preview
FROM motion_assets
ORDER BY id;
