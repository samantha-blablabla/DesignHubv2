# DesignHub Production - Setup Guide

## 📁 Files Cậu Cần Copy

### Từ Project WebForDesign:

#### 1. Components (Copy từ `WebForDesign/components/`)
```
✅ ScrollWrapper.tsx
✅ CursorContext.tsx
✅ CustomCursor.tsx
✅ NoiseOverlay.tsx
✅ HeroSection.tsx
```

**Copy vào**: `DesignHub-Production/src/components/`

#### 2. Environment Variables
Tạo file `.env.local` với nội dung:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Lấy values từ**: `WebForDesign/.env.local` (nhưng đổi `NEXT_PUBLIC_` thành `VITE_`)

#### 3. Supabase Helper (Tạo mới)
File: `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 🎨 CSS Setup

File: `src/index.css` - thay toàn bộ bằng:

```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Urban Dark Theme */
:root {
  --urban-bg: #060606;
  --urban-neon-yellow: #eab308;
  --urban-neon-blue: #3b82f6;
  --urban-neon-orange: #f97316;
  --urban-neon-purple: #a855f7;
  --urban-neon-green: #22c55e;
}

body {
  margin: 0;
  padding: 0;
  background-color: #060606;
  color: white;
  font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', system-ui, sans-serif;
  overflow-x: hidden;
}

/* Hide default cursor */
body, body * {
  cursor: none;
}

/* Selection */
::selection {
  background-color: var(--urban-neon-yellow);
  color: black;
}
```

## 📦 Main App Structure

File: `src/App.tsx` - thay bằng:

```typescript
import { CursorProvider } from './components/CursorContext';
import CustomCursor from './components/CustomCursor';
import { ScrollWrapper } from './components/ScrollWrapper';
import NoiseOverlay from './components/NoiseOverlay';
import HeroSection from './components/HeroSection';

function App() {
  return (
    <CursorProvider>
      <ScrollWrapper>
        <div className="cursor-none bg-[#060606] min-h-screen text-white">
          <CustomCursor />
          <NoiseOverlay />
          <HeroSection />
          {/* More sections will be added here */}
        </div>
      </ScrollWrapper>
    </CursorProvider>
  );
}

export default App;
```

## 🚀 Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Checklist

- [ ] Copy 5 components vào `src/components/`
- [ ] Tạo `.env.local` với Supabase credentials
- [ ] Tạo `src/lib/supabase.ts`
- [ ] Update `src/index.css`
- [ ] Update `src/App.tsx`
- [ ] Run `npm run dev`
- [ ] Test at `http://localhost:5173`

## 🔄 Next Steps (After Basic Setup Works)

1. Fetch ResourceGallery từ DesignHubv2
2. Fetch VideoShowcase từ DesignHubv2
3. Create data fetching hooks
4. Map Supabase data (333 resources + 216 videos)
5. Deploy to Vercel/Netlify

---

**Current Status**: Ready for component copy
**Time Estimate**: 10 minutes setup
