# 🗄️ Supabase Database Migrations

This folder contains SQL migration scripts for the DesignHub Production database.

---

## 📁 Migration Files

### `create_motion_assets_table.sql`
Creates the `motion_assets` table for the SmartVideoGallery component.

**Features:**
- Table structure with all required fields
- Indexes for performance
- Auto-update timestamp trigger
- Row Level Security (RLS) policies
- Sample data (4 motion assets)
- Public read access

**Schema:**
```sql
motion_assets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  thumb TEXT NOT NULL,
  video TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## 🚀 How to Run Migrations

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `kmzcbwiqlfdcrqqndglm`

2. **Navigate to SQL Editor**
   - Left sidebar → SQL Editor
   - Click "New query"

3. **Copy & Paste Migration**
   - Open: `create_motion_assets_table.sql`
   - Copy entire file content
   - Paste into SQL Editor

4. **Run Migration**
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for success message
   - Check output: Should show "4 sample records"

5. **Verify Table**
   - Go to Table Editor
   - Find `motion_assets` table
   - Verify 4 rows exist

---

### Method 2: Supabase CLI (Advanced)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref kmzcbwiqlfdcrqqndglm

# Run migration
supabase db push

# Or run specific migration
psql "postgresql://postgres:[PASSWORD]@db.kmzcbwiqlfdcrqqndglm.supabase.co:5432/postgres" -f supabase/migrations/create_motion_assets_table.sql
```

---

### Method 3: Direct SQL Query (Quick Test)

If you just want to test, you can run the SQL directly:

1. Go to SQL Editor in Supabase Dashboard
2. Paste and run this quick version:

```sql
-- Quick create table (without policies)
CREATE TABLE motion_assets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  thumb TEXT NOT NULL,
  video TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO motion_assets (title, duration, thumb, video, link) VALUES
('Kinetic Typography', '00:12', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000', 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-196-large.mp4', '#project-kinetic'),
('Fluid Simulations', '00:08', 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?q=80&w=1000', 'https://assets.mixkit.co/videos/preview/mixkit-holographic-fluid-surface-loop-2747-large.mp4', '#project-fluid'),
('Abstract Data', '00:15', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000', 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-2766-large.mp4', '#project-data'),
('Cyber Particles', '00:10', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000', 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-particles-4618-large.mp4', '#project-particles');

-- Enable public read
ALTER TABLE motion_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON motion_assets FOR SELECT TO public USING (true);
```

---

## ✅ Verification

After running migration, verify:

1. **Table exists**
   ```sql
   SELECT * FROM motion_assets;
   ```
   Should return 4 rows

2. **Check structure**
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'motion_assets';
   ```

3. **Test from app**
   - Run `npm run dev`
   - Navigate to Motion Gallery section
   - Should see 4 videos from database

---

## 📊 Sample Data

The migration includes 4 sample motion assets:

1. **Kinetic Typography** (12s) - Ink swirling effects
2. **Fluid Simulations** (8s) - Holographic surface
3. **Abstract Data** (15s) - Technology network lines
4. **Cyber Particles** (10s) - Digital particle animation

All videos are from Mixkit (free stock videos).

---

## 🔐 Security & Permissions

**Row Level Security (RLS)**: Enabled

**Policies:**
- ✅ Public read access (anyone can view)
- ✅ Authenticated insert (for future admin panel)
- ✅ Authenticated update (for future admin panel)

**Grants:**
- `anon` role: SELECT
- `authenticated` role: SELECT, INSERT, UPDATE, DELETE

---

## 🎯 Next Steps After Migration

1. **Run migration** using Method 1 above
2. **Verify** table has 4 sample records
3. **Test** SmartVideoGallery component loads data
4. **Add more assets** via Supabase Dashboard → Table Editor

---

## 📝 Adding New Motion Assets

### Via Supabase Dashboard

1. Go to Table Editor → `motion_assets`
2. Click "Insert row"
3. Fill in fields:
   - `title`: Asset name
   - `duration`: "MM:SS" format (e.g., "00:15")
   - `thumb`: Thumbnail image URL
   - `video`: MP4 video URL
   - `link`: Destination URL (or "#" for placeholder)
   - `description`: (optional) Project description
   - `tags`: (optional) Array like `{"tag1", "tag2"}`
4. Click "Save"

### Via SQL

```sql
INSERT INTO motion_assets (title, duration, thumb, video, link, description, tags)
VALUES (
  'Your Project Name',
  '00:20',
  'https://your-thumbnail-url.jpg',
  'https://your-video-url.mp4',
  'https://your-project-link.com',
  'Project description here',
  ARRAY['tag1', 'tag2', 'tag3']
);
```

---

## 🐛 Troubleshooting

### Error: "relation motion_assets already exists"
**Solution**: Table already created. Skip migration or drop first:
```sql
DROP TABLE IF EXISTS motion_assets CASCADE;
```

### Error: "permission denied"
**Solution**: Make sure you're logged into correct Supabase project

### Error: "could not connect"
**Solution**: Check internet connection and Supabase project status

---

**Created**: 2026-01-11
**For**: SmartVideoGallery component backend integration
**Database**: Supabase (kmzcbwiqlfdcrqqndglm)
