-- Create motion_assets table for SmartVideoGallery component
-- This table stores motion design assets with video previews and project links

CREATE TABLE IF NOT EXISTS motion_assets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT NOT NULL, -- Format: "00:12" (MM:SS)
  thumb TEXT NOT NULL, -- Thumbnail image URL
  video TEXT NOT NULL, -- Video MP4 URL
  link TEXT NOT NULL, -- Project destination URL or external link
  description TEXT, -- Optional: Project description
  tags TEXT[], -- Optional: Array of tags for filtering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_motion_assets_created_at ON motion_assets(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_motion_assets_updated_at
    BEFORE UPDATE ON motion_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (from SmartVideoGallery hardcoded data)
INSERT INTO motion_assets (title, duration, thumb, video, link, description, tags) VALUES
(
  'Kinetic Typography',
  '00:12',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-196-large.mp4',
  '#project-kinetic',
  'Dynamic text animation with fluid ink effects',
  ARRAY['typography', 'kinetic', 'animation']
),
(
  'Fluid Simulations',
  '00:08',
  'https://images.unsplash.com/photo-1604533038676-e82df491c10d?q=80&w=1000&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/preview/mixkit-holographic-fluid-surface-loop-2747-large.mp4',
  '#project-fluid',
  'Holographic fluid surface with seamless loop',
  ARRAY['fluid', 'holographic', '3d']
),
(
  'Abstract Data',
  '00:15',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-2766-large.mp4',
  '#project-data',
  'Technology network visualization with abstract lines',
  ARRAY['data-viz', 'abstract', 'technology']
),
(
  'Cyber Particles',
  '00:10',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-particles-4618-large.mp4',
  '#project-particles',
  'Digital particle animation with cyber aesthetic',
  ARRAY['particles', 'cyber', 'digital']
);

-- Enable Row Level Security (RLS)
ALTER TABLE motion_assets ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access
CREATE POLICY "Allow public read access on motion_assets"
ON motion_assets FOR SELECT
TO public
USING (true);

-- Create policy: Allow authenticated users to insert (optional - for future admin panel)
CREATE POLICY "Allow authenticated insert on motion_assets"
ON motion_assets FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy: Allow authenticated users to update (optional - for future admin panel)
CREATE POLICY "Allow authenticated update on motion_assets"
ON motion_assets FOR UPDATE
TO authenticated
USING (true);

-- Grant permissions
GRANT SELECT ON motion_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON motion_assets TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'motion_assets table created successfully with % sample records', (SELECT COUNT(*) FROM motion_assets);
END $$;
