/**
 * Update Video Sources Script
 * Changes Mixkit URLs to Pexels URLs (more reliable)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const newVideoSources = [
  {
    title: 'Kinetic Typography',
    video: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4',
    thumb: 'https://images.pexels.com/videos/3129671/free-video-3129671.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    title: 'Fluid Simulations',
    video: 'https://videos.pexels.com/video-files/2278095/2278095-uhd_2560_1440_25fps.mp4',
    thumb: 'https://images.pexels.com/videos/2278095/pexels-photo-2278095.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    title: 'Abstract Data',
    video: 'https://videos.pexels.com/video-files/3141206/3141206-uhd_2560_1440_25fps.mp4',
    thumb: 'https://images.pexels.com/videos/3141206/pexels-photo-3141206.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    title: 'Cyber Particles',
    video: 'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4',
    thumb: 'https://images.pexels.com/videos/3130284/pexels-photo-3130284.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  }
];

async function updateVideoSources() {
  console.log('🔄 Updating video sources from Mixkit to Pexels...\n');

  for (const source of newVideoSources) {
    console.log(`📝 Updating: ${source.title}`);

    const { data, error } = await supabase
      .from('motion_assets')
      .update({
        video: source.video,
        thumb: source.thumb
      })
      .eq('title', source.title)
      .select();

    if (error) {
      console.error(`❌ Error updating ${source.title}:`, error.message);
    } else {
      console.log(`✅ Updated ${source.title}`);
    }
  }

  console.log('\n🔍 Verifying updates...');
  const { data: allData, error: verifyError } = await supabase
    .from('motion_assets')
    .select('id, title, video, thumb')
    .order('id');

  if (verifyError) {
    console.error('❌ Verification error:', verifyError.message);
  } else {
    console.log('\n✅ All motion assets:');
    allData?.forEach(asset => {
      console.log(`\n${asset.id}. ${asset.title}`);
      console.log(`   Video: ${asset.video.substring(0, 60)}...`);
      console.log(`   Thumb: ${asset.thumb.substring(0, 60)}...`);
    });
  }

  console.log('\n✅ Video sources updated to Pexels!');
  console.log('🎯 Refresh browser to see new videos.\n');
}

updateVideoSources();
