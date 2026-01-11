-- Direct update with exact matching
UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3129671/free-video-3129671.jpg'
WHERE id = 1;

UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/2278095/2278095-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/2278095/pexels-photo-2278095.jpeg'
WHERE id = 2;

UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3141206/3141206-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3141206/pexels-photo-3141206.jpeg'
WHERE id = 3;

UPDATE motion_assets SET
  video = 'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4',
  thumb = 'https://images.pexels.com/videos/3130284/pexels-photo-3130284.jpeg'
WHERE id = 4;
