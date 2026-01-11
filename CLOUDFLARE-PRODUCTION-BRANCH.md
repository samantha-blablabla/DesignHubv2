# 🔧 Set Cloudflare Production Branch to `main`

## Current Situation

**Problem**:
- Production branch: `master` (old deployment)
- Latest deployment: `main` (preview only)
- Root domain `designhubv2.pages.dev` points to `master` (outdated)

**Need**:
- Change production branch from `master` to `main`
- Root domain should serve latest `main` branch deployment

---

## Solution Options

### Option 1: Via Cloudflare Dashboard (Recommended - Quick)

1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com/pages/view/designhubv2

2. **Navigate to Settings**
   - Click "Settings" tab
   - Scroll to "Production branch"

3. **Change Production Branch**
   - Current: `master`
   - Change to: `main`
   - Click "Save"

4. **Trigger Rebuild** (Optional)
   - Go to "Deployments" tab
   - Click "Retry deployment" on latest `main` deployment
   - Or redeploy with: `npm run build && wrangler pages deployment create --project-name=designhubv2 --branch=main dist`

5. **Verify**
   - Visit: https://designhubv2.pages.dev
   - Should show latest deployment from `main` branch

✅ **Result**: Root domain will serve `main` branch

---

### Option 2: Delete Old Deployment (If Git Not Connected)

If you don't need the old `master` branch deployment:

1. Go to Cloudflare Dashboard → designhubv2 → Deployments
2. Find deployment from `master` branch
3. Click "..." menu → "Delete deployment"
4. Next `main` deployment will auto-become production

---

### Option 3: Connect GitHub Repository (Best Long-term)

**Benefits**:
- Auto-deploy on push to `main`
- Production branch automatically tracked
- Preview deployments for PRs

**Steps**:

1. **Go to Cloudflare Dashboard**
   - https://dash.cloudflare.com/pages/view/designhubv2

2. **Settings → Source**
   - Click "Connect to Git"
   - Choose "GitHub"
   - Authorize Cloudflare

3. **Select Repository**
   - Repository: `samantha-blablabla/DesignHubv2`
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`

4. **Set Environment Variables**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

5. **Save & Deploy**
   - Cloudflare will auto-deploy on every push to `main`

✅ **Result**: Full CI/CD setup, auto-deploys on push

---

## Quick Fix (Immediate)

**Fastest way to test** if you just want root domain to work now:

```bash
# Deploy again but this will create new preview
npm run build
wrangler pages deployment create --project-name=designhubv2 --branch=main dist

# Then go to Dashboard and manually set production branch to 'main'
```

---

## Why This Happened

When project was created initially, it was set with production branch = `master`.

**Initial creation**:
```bash
wrangler pages project create designhubv2 --production-branch=master
```

But we're now working on `main` branch (GitHub default).

**Solution**: Change production branch in Dashboard settings.

---

## Verification

After changing production branch to `main`:

**URLs**:
- ✅ https://designhubv2.pages.dev → Latest `main` deployment
- ✅ https://main.designhubv2.pages.dev → Alias for main branch
- ℹ️ https://[hash].designhubv2.pages.dev → Specific deployments

**Test**:
```bash
curl -I https://designhubv2.pages.dev
# Should return 200 OK with latest content
```

---

## Recommended Steps (Right Now)

1. Open: https://dash.cloudflare.com/pages/view/designhubv2/settings
2. Find "Production branch" setting
3. Change from `master` to `main`
4. Save
5. Visit https://designhubv2.pages.dev
6. Confirm latest deployment is showing

**Time**: 2 minutes
**Difficulty**: Very easy

---

## Future Deployments

After changing to `main`:

```bash
# Just deploy normally
npm run build
wrangler pages deployment create --project-name=designhubv2 --branch=main dist

# Root domain will update automatically
```

Or even better, connect GitHub repo for auto-deploy on push!

---

**Created**: 2026-01-11 20:43
**Issue**: Production branch mismatch
**Solution**: Change to `main` via Dashboard Settings
