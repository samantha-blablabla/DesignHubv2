# 🚀 Quick Start: Hoàn thành Backend Integration

## Bước 1️⃣: Tạo Table trong Supabase (5 phút)

### Copy SQL này:

```sql
-- Copy toàn bộ nội dung file này: supabase/migrations/create_motion_assets_table.sql
-- Hoặc copy đoạn SQL dưới đây:

CREATE TABLE IF NOT EXISTS motion_assets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  thumb TEXT NOT NULL,
  video TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_motion_assets_created_at ON motion_assets(created_at DESC);

INSERT INTO motion_assets (title, duration, thumb, video, link, description, tags) VALUES
('Kinetic Typography', '00:12', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-196-large.mp4', '#project-kinetic', 'Dynamic text animation with fluid ink effects', ARRAY['typography', 'kinetic', 'animation']),
('Fluid Simulations', '00:08', 'https://images.unsplash.com/photo-1604533038676-e82df491c10d?q=80&w=1000&auto=format&fit=crop', 'https://assets.mixkit.co/videos/preview/mixkit-holographic-fluid-surface-loop-2747-large.mp4', '#project-fluid', 'Holographic fluid surface with seamless loop', ARRAY['fluid', 'holographic', '3d']),
('Abstract Data', '00:15', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-2766-large.mp4', '#project-data', 'Technology network visualization with abstract lines', ARRAY['data-viz', 'abstract', 'technology']),
('Cyber Particles', '00:10', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-particles-4618-large.mp4', '#project-particles', 'Digital particle animation with cyber aesthetic', ARRAY['particles', 'cyber', 'digital']);

ALTER TABLE motion_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON motion_assets FOR SELECT TO public USING (true);
```

### Paste vào Supabase:

1. Mở: https://supabase.com/dashboard
2. Chọn project: kmzcbwiqlfdcrqqndglm
3. Click: **SQL Editor** (sidebar trái)
4. Click: **New query**
5. Paste SQL phía trên
6. Click: **Run** (hoặc Ctrl+Enter)
7. Kiểm tra: Table Editor → `motion_assets` → Phải thấy 4 rows

✅ **Xong bước 1** nếu thấy 4 videos trong table

---

## Bước 2️⃣: Test Local (2 phút)

```bash
npm run dev
```

Mở: http://localhost:5173
Scroll xuống: **Motion Archive** section
Kiểm tra: 4 videos load từ database

✅ **Xong bước 2** nếu videos hiển thị và play được

---

## Bước 3️⃣: Deploy (3 phút)

```bash
npm run build
wrangler pages deployment create --project-name=designhubv2 --branch=main dist
```

✅ **Xong bước 3** khi deployment thành công

---

## 🎯 Tổng thời gian: ~10 phút

**Nếu gặp lỗi:**
- Xem file: `DEPLOYMENT-STEPS.md` (hướng dẫn chi tiết)
- Xem file: `supabase/README.md` (troubleshooting)

**Đã commit & push:**
- Commit: 40313b9
- Branch: main
- GitHub: https://github.com/samantha-blablabla/DesignHubv2

**Files quan trọng:**
- SQL migration: `supabase/migrations/create_motion_assets_table.sql`
- Component đã update: `components/SmartVideoGallery.tsx`
- Supabase client: `lib/supabase.ts`
