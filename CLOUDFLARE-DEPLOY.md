# 🚀 Cloudflare Pages Deployment Guide

## 📋 Prerequisites

- [x] GitHub repo: https://github.com/samantha-blablabla/DesignHubv2
- [x] Code pushed to master branch
- [x] Production build tested (`npm run build` ✅)
- [ ] Cloudflare account (free)

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Create Cloudflare Account (nếu chưa có)

1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up with email
3. Verify email
4. Login to dashboard

---

### Step 2: Connect GitHub Repository

1. **Navigate to Pages**
   - Dashboard → Workers & Pages → Create application
   - Click **Pages** tab
   - Click **Connect to Git**

2. **Authorize Cloudflare**
   - Choose **GitHub**
   - Click **Connect GitHub**
   - Authorize Cloudflare Pages
   - Select repositories:
     - Option A: All repositories
     - Option B: Only `DesignHubv2` (Recommended)

3. **Select Repository**
   - Choose: `samantha-blablabla/DesignHubv2`
   - Click **Begin setup**

---

### Step 3: Configure Build Settings

**Project name**: `designhub-production` (hoặc tên bạn muốn)

**Production branch**: `master`

**Build settings**:
```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
```

**Environment variables**:
Click **Add variable** cho mỗi key:

```
VITE_SUPABASE_URL=https://kmzcbwiqlfdcrqqndglm.supabase.co
VITE_SUPABASE_ANON_KEY=<your-key-from-.env.local>
```

⚠️ **IMPORTANT**: Copy exact values từ `.env.local` của bạn!

---

### Step 4: Deploy

1. Click **Save and Deploy**
2. Wait ~2-3 minutes
3. Build logs sẽ hiện:
   ```
   ✓ Building...
   ✓ Deploying...
   ✓ Success!
   ```

---

### Step 5: Get Your URL

After deployment:
- **Production URL**: `https://designhub-production.pages.dev`
- Hoặc custom domain nếu bạn setup

**Share URL**: Copy và test!

---

## 🔧 MANUAL DEPLOYMENT (Alternative)

Nếu bạn muốn deploy manual qua CLI:

### Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler

# Login
wrangler login

# Deploy
cd "c:\Users\Admin\OneDrive\Máy tính\DesignHub-Production"
npx wrangler pages deploy dist --project-name=designhub-production
```

---

## 📊 BUILD CONFIGURATION

File `wrangler.toml` (optional, for advanced config):

```toml
name = "designhub-production"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"

[[env.production.vars]]
VITE_SUPABASE_URL = "https://kmzcbwiqlfdcrqqndglm.supabase.co"
```

⚠️ **Don't commit this file** if it contains secrets!

---

## 🎨 CUSTOM DOMAIN (Optional)

### Add Custom Domain

1. Go to Pages project → Custom domains
2. Click **Set up a custom domain**
3. Enter your domain: `yourdomain.com`
4. Follow DNS setup instructions:
   - Add CNAME record: `yourdomain.com` → `designhub-production.pages.dev`

---

## 🔍 VERIFY DEPLOYMENT

### Checklist After Deploy

- [ ] Open production URL
- [ ] Check Hero section loads
- [ ] Check ResourceGallery fetches from Supabase
- [ ] Check VideoShowcase loads videos
- [ ] Check BigFooter displays
- [ ] Test resource modal
- [ ] Test Load More button
- [ ] Test filters & search
- [ ] Test on mobile

### Debug Issues

**Issue 1: Blank page**
- Check browser console (F12)
- Check Cloudflare build logs
- Verify environment variables

**Issue 2: Supabase not connecting**
- Verify `VITE_SUPABASE_URL` is set
- Verify `VITE_SUPABASE_ANON_KEY` is correct
- Check Supabase CORS settings

**Issue 3: 404 errors**
- Check `dist/` folder structure
- Verify build output directory = `dist`

---

## 📈 CLOUDFLARE PAGES FEATURES

### Free Tier Includes:
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ Concurrent builds: 1
- ✅ Custom domains
- ✅ Automatic HTTPS
- ✅ DDoS protection

### Analytics (Optional)
- Enable Web Analytics in dashboard
- Track page views, performance

---

## 🔄 AUTOMATIC DEPLOYMENTS

**Production**: Every push to `master` → Auto deploy
**Preview**: Every PR → Preview URL

### Disable auto-deploy:
- Settings → Builds & deployments → Pause deployments

---

## 🚀 PREVIEW DEPLOYMENT

Test before merging to master:

```bash
# Create feature branch
git checkout -b feature/test

# Make changes
git add .
git commit -m "test changes"
git push origin feature/test

# Create PR on GitHub
# → Cloudflare auto-creates preview URL
```

---

## 📊 COMPARISON

| Feature | Vercel | Cloudflare Pages |
|---------|--------|------------------|
| Build time | ~30s | ~40s |
| Bandwidth | Unlimited | Unlimited |
| Builds/month | 6000 | 500 |
| Edge network | Global | Global |
| DDoS protection | Good | Excellent |
| Setup time | 5 min | 10 min |

**Your choice**: Cloudflare Pages ✅

---

## 🐛 TROUBLESHOOTING

### Build fails

**Check**:
1. Build command: `npm run build`
2. Output directory: `dist`
3. Node version: Auto-detected (should be 18+)

**Fix**: Add `.nvmrc` file:
```
20.19.0
```

### Environment variables not working

**Check**:
1. Variable names start with `VITE_`
2. No quotes around values
3. Redeploy after adding variables

---

## 📞 SUPPORT

**Cloudflare Docs**: https://developers.cloudflare.com/pages/
**Community**: https://community.cloudflare.com/

---

**Ready to deploy?** Follow Step 1-5 above! 🚀
