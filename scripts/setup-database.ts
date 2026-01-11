/**
 * Database Setup Script
 * Automatically creates motion_assets table and populates with sample data
 *
 * Run: npx tsx scripts/setup-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role (for admin operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sampleData = [
  {
    title: 'Kinetic Typography',
    duration: '00:12',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-196-large.mp4',
    link: '#project-kinetic',
    description: 'Dynamic text animation with fluid ink effects',
    tags: ['typography', 'kinetic', 'animation']
  },
  {
    title: 'Fluid Simulations',
    duration: '00:08',
    thumb: 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-holographic-fluid-surface-loop-2747-large.mp4',
    link: '#project-fluid',
    description: 'Holographic fluid surface with seamless loop',
    tags: ['fluid', 'holographic', '3d']
  },
  {
    title: 'Abstract Data',
    duration: '00:15',
    thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-2766-large.mp4',
    link: '#project-data',
    description: 'Technology network visualization with abstract lines',
    tags: ['data-viz', 'abstract', 'technology']
  },
  {
    title: 'Cyber Particles',
    duration: '00:10',
    thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-particles-4618-large.mp4',
    link: '#project-particles',
    description: 'Digital particle animation with cyber aesthetic',
    tags: ['particles', 'cyber', 'digital']
  }
];

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Step 1: Check if table exists
    console.log('📊 Checking if motion_assets table exists...');
    const { data: existingData, error: checkError } = await supabase
      .from('motion_assets')
      .select('count')
      .limit(1);

    if (!checkError) {
      console.log('✅ Table motion_assets already exists');

      // Check row count
      const { count } = await supabase
        .from('motion_assets')
        .select('*', { count: 'exact', head: true });

      console.log(`📈 Current rows in motion_assets: ${count}`);

      if (count && count > 0) {
        console.log('\n⚠️  Table already has data. Skipping insert.');
        console.log('   To re-populate, delete rows in Supabase Dashboard first.');
        return;
      }
    } else {
      console.log('⚠️  Table does not exist or is not accessible via client');
      console.log('   You need to create it manually via SQL Editor');
      console.log('   See: supabase/migrations/create_motion_assets_table.sql\n');
      return;
    }

    // Step 2: Insert sample data
    console.log('\n📝 Inserting sample motion assets...');
    const { data, error } = await supabase
      .from('motion_assets')
      .insert(sampleData)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully inserted ${data?.length} motion assets`);

    // Step 3: Verify insertion
    console.log('\n🔍 Verifying data...');
    const { data: allData, error: verifyError } = await supabase
      .from('motion_assets')
      .select('id, title, duration')
      .order('id', { ascending: true });

    if (verifyError) {
      throw verifyError;
    }

    console.log('\n📋 Motion assets in database:');
    allData?.forEach((asset: any) => {
      console.log(`   ${asset.id}. ${asset.title} (${asset.duration})`);
    });

    console.log('\n✅ Database setup complete!');
    console.log('\n🎯 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Check Motion Gallery section');
    console.log('   3. Videos should load from database\n');

  } catch (error: any) {
    console.error('\n❌ Error setting up database:');
    console.error(error.message);

    if (error.code === '42P01') {
      console.log('\n💡 Solution:');
      console.log('   Table does not exist. Create it first:');
      console.log('   1. Open Supabase Dashboard → SQL Editor');
      console.log('   2. Run SQL from: supabase/migrations/create_motion_assets_table.sql');
      console.log('   3. Then run this script again\n');
    }

    process.exit(1);
  }
}

// Run setup
setupDatabase();
