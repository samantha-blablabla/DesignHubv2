# 🐛 Debug: Data Loading Issue

**Issue**: SmartVideoGallery shows dummy data instead of Supabase data
**Status**: 🔍 Investigating

---

## Quick Diagnostic Steps

### 1. Check Browser Console

Open browser (http://localhost:5173) → F12 → Console tab

**Look for**:
- ❌ JavaScript errors
- ❌ "Error fetching motion assets" message
- ❌ Network errors
- ✅ Should see Supabase requests in Network tab

**Expected Console Output**:
```
(If working correctly, should see no errors)
```

**If seeing errors, note**:
- Error message
- Stack trace
- Which file/line

---

### 2. Check Network Tab

F12 → Network tab → Reload page

**Look for**:
- Request to `https://kmzcbwiqlfdcrqqndglm.supabase.co/rest/v1/motion_assets`
- Status: 200 OK
- Response: JSON array with 4 objects

**If no Supabase request**:
- Environment variables not loading
- Or fetch not happening

**If request fails (4xx/5xx)**:
- Check error message
- Verify RLS policies
- Check API key validity

---

### 3. Check Environment Variables

Open Console → Type:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Key exists' : 'Key missing')
```

**Expected**:
```
https://kmzcbwiqlfdcrqqndglm.supabase.co
Key exists
```

**If undefined**:
- .env.local not loading
- Need to restart dev server after creating .env.local
- Or Vite not picking up env vars

---

### 4. Manual Supabase Test

Open Console → Paste:
```javascript
import('https://esm.sh/@supabase/supabase-js@2').then(({ createClient }) => {
  const supabase = createClient(
    'https://kmzcbwiqlfdcrqqndglm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttemNid2lxbGZkY3JxcW5kZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4OTg5ODMsImV4cCI6MjA4MjQ3NDk4M30.jxqXaedHKG0K-FAAnMofXif-O0JlC1aSQeaSXzi03hQ'
  );

  supabase.from('motion_assets').select('*').then(({ data, error }) => {
    if (error) console.error('❌ Error:', error);
    else console.log('✅ Data:', data);
  });
});
```

**Expected**: ✅ Data with 4 motion assets

**If error**: Note the error message

---

## Common Causes & Solutions

### Cause 1: .env.local Not Loaded

**Symptoms**:
- `import.meta.env.VITE_SUPABASE_URL` is undefined
- No network requests to Supabase

**Solution**:
```bash
# Check .env.local exists
cat .env.local

# Should see:
VITE_SUPABASE_URL=https://kmzcbwiqlfdcrqqndglm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Restart dev server
npm run dev
```

---

### Cause 2: Import Path Issue

**Symptoms**:
- Error: "Cannot find module '../lib/supabase'"
- Or: "supabase is undefined"

**Solution**:
Check import in `components/SmartVideoGallery.tsx`:
```typescript
// Should be:
import { supabase, type MotionAsset } from '../lib/supabase';

// File structure:
components/SmartVideoGallery.tsx
lib/supabase.ts
```

---

### Cause 3: Table Doesn't Exist

**Symptoms**:
- Error: "relation motion_assets does not exist"
- 404 error in Network tab

**Solution**:
```bash
# Verify table exists
npm run db:setup

# Should see:
✅ Table motion_assets already exists
📈 Current rows in motion_assets: 4
```

If table missing, run SQL in Supabase Dashboard.

---

### Cause 4: RLS Policy Blocks Access

**Symptoms**:
- Network request returns empty array []
- Or 403 Forbidden

**Solution**:
Check Supabase Dashboard → Authentication → Policies

Should have:
- Policy: "Allow public read access on motion_assets"
- FOR SELECT
- TO public
- USING (true)

---

### Cause 5: CORS Issue

**Symptoms**:
- CORS error in console
- Network request blocked

**Solution**:
Unlikely with Supabase, but check:
- Supabase project settings → API → CORS allowed origins
- Should include localhost

---

## Quick Fix Script

If nothing works, try this hardcoded test in `SmartVideoGallery.tsx`:

```typescript
// Temporary: Replace useEffect with hardcoded test
useEffect(() => {
  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

  async function test() {
    try {
      const { data, error } = await supabase
        .from('motion_assets')
        .select('*');

      console.log('✅ Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase error:', error);
      }
      if (data) {
        console.log(`✅ Got ${data.length} motion assets`);
        setVideos(data as MotionAsset[]);
      }
    } catch (err) {
      console.error('❌ Catch error:', err);
    } finally {
      setLoading(false);
    }
  }

  test();
}, []);
```

Check console for detailed logs.

---

## Next Steps

1. **User**: Open browser console and check errors
2. **User**: Check Network tab for Supabase requests
3. **User**: Run environment variable check
4. **Claude**: Apply fix based on diagnostic results

---

**Created**: 2026-01-11 20:27
**Purpose**: Debug data loading issue
**Tokens Remaining**: ~90,000
