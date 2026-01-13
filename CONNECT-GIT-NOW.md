# 🔗 Connect Git to Cloudflare - Keep Domain `designhubv2.pages.dev`

**Mục tiêu**: Connect GitHub để auto-deploy, **GIỮ NGUYÊN** domain `designhubv2.pages.dev`

---

## ✅ Thông Tin Project

**Current Status**:
- Project Name: `designhubv2`
- Production Domain: `designhubv2.pages.dev` ✅ (KHÔNG THAY ĐỔI)
- Git Provider: `No` → Sẽ change thành `GitHub`
- GitHub Repo: `samantha-blablabla/DesignHubv2`
- Production Branch: `main`

---

## 🎯 Bước 1: Mở Cloudflare Dashboard

**Click vào link này** (tự động mở đúng page):

👉 **https://dash.cloudflare.com/pages/view/designhubv2/settings/builds**

Hoặc thủ công:
1. Vào: https://dash.cloudflare.com/
2. Click **Pages** (bên trái)
3. Click **designhubv2**
4. Click **Settings** (tab trên)
5. Scroll xuống **"Build settings"**

---

## 🎯 Bước 2: Connect to Git

### Tìm Section "Source"

Trong Settings page, tìm section có tên **"Source"** hoặc **"Git integration"**

Sẽ thấy:
```
Git Provider: No
```

### Click "Connect to Git" Button

1. Click nút **"Connect to Git"** (màu xanh/cam)
2. Popup sẽ hiện ra

---

## 🎯 Bước 3: Authorize GitHub

### Nếu Chưa Authorize Cloudflare
1. Popup GitHub sẽ hiện ra
2. Click **"Authorize Cloudflare Pages"**
3. Đăng nhập GitHub nếu cần
4. Click **"Install & Authorize"**

### Nếu Đã Authorize Rồi
→ Bỏ qua bước này, sẽ thấy list repositories luôn

---

## 🎯 Bước 4: Chọn Repository

### Trong Popup "Select Repository"

1. Tìm và chọn: **`samantha-blablabla/DesignHubv2`**
2. Nếu không thấy, click **"+ Add account"** để add organization
3. Click **"Select"** hoặc **"Connect repository"**

---

## 🎯 Bước 5: Configure Build Settings

### Form "Production branch"
**QUAN TRỌNG**: Chọn branch `main` cho production

```
Production branch: main
```

### Form "Build settings" (Tự động điền)

Cloudflare sẽ tự động detect, verify lại cho đúng:

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
```

**Node.js version**: Sẽ tự detect từ `.nvmrc` (20.19) ✅

---

## 🎯 Bước 6: Environment Variables

Trong Settings → Environment variables, verify rằng đã có:

### Production Environment
```
VITE_SUPABASE_URL = https://kmzcbwiqlfdcrqqndglm.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Nếu chưa có** → Add ngay:
1. Scroll xuống **"Environment variables"**
2. Click **"Add variable"**
3. Environment: **Production**
4. Paste values từ `.env.local`

---

## 🎯 Bước 7: Save

1. Scroll xuống cuối page
2. Click **"Save"** hoặc **"Save and Deploy"**

**Cloudflare sẽ**:
- ✅ Connect GitHub repository
- ✅ Trigger first build từ `main` branch
- ✅ Deploy lên **`designhubv2.pages.dev`** (GIỮ NGUYÊN DOMAIN)

---

## ✅ Verification

### Check 1: Git Provider Connected

```bash
wrangler pages project list
```

**Expected**:
```
Project Name: designhubv2
Git Provider: GitHub ✅ (changed from "No")
```

### Check 2: Production Domain Unchanged

**Truy cập**: https://designhubv2.pages.dev

**Kết quả**:
- ✅ Website vẫn LIVE
- ✅ Domain KHÔNG THAY ĐỔI
- ✅ Mọi thứ hoạt động bình thường

### Check 3: Dashboard Shows Commit

Vào Cloudflare Dashboard → designhubv2 → **Deployments**

Sẽ thấy:
- ✅ Commit message
- ✅ GitHub username
- ✅ Commit hash
- ✅ Branch: main

---

## 🚀 Test Auto-Deploy

### Sau Khi Connect Xong

Làm 1 thay đổi nhỏ để test:

```bash
# Tạo file test
echo "# Test auto-deploy" >> TEST.md

# Commit & push
git add TEST.md
git commit -m "test: Verify auto-deploy from GitHub"
git push origin main

# Xem Cloudflare Dashboard
# → Sẽ thấy deployment mới tự động trigger!
```

**Kết quả mong đợi**:
- ✅ Cloudflare tự động detect push
- ✅ Tự động build
- ✅ Tự động deploy lên `designhubv2.pages.dev`
- ✅ Không cần chạy `wrangler pages deployment create` nữa!

---

## 📊 Trước vs Sau

### Trước (Manual Deploy)
```bash
# Mỗi lần deploy:
npm run build
wrangler pages deployment create --project-name=designhubv2 --branch=main dist
# → 2 commands, manual
```

### Sau (Auto Deploy) ✅
```bash
# Mỗi lần deploy:
git push origin main
# → 1 command, tự động build & deploy!
```

---

## ⚠️ Important Notes

### Domain KHÔNG THAY ĐỔI
- ✅ `designhubv2.pages.dev` → GIỮ NGUYÊN
- ✅ Không mất deployment history
- ✅ Không mất environment variables
- ✅ Chỉ THÊM Git integration

### Branch Strategy
- **`main` branch** → Production (designhubv2.pages.dev)
- **Other branches** → Preview URLs (e.g., `dev-branch.designhubv2.pages.dev`)
- **Pull Requests** → Preview URLs automatically

### Build Time
- Mỗi push = 1 build (~3-5 seconds)
- Nếu build fail → Không deploy (giữ version cũ)
- Sẽ có email/notification khi build fail

---

## 🎯 What Happens After Connection

### Every `git push origin main`:
1. GitHub webhook → Cloudflare
2. Cloudflare pulls code from GitHub
3. Runs `npm run build`
4. Deploys `dist/` to production
5. Updates `designhubv2.pages.dev`

### Every Pull Request:
1. Auto-creates preview deployment
2. URL: `pr-123.designhubv2.pages.dev`
3. Can test before merging
4. Auto-deletes after PR closed

---

## 🔧 Troubleshooting

### "Can't find repository"
→ Click "Add account" → Authorize more repos

### "Build failed"
→ Check build logs in Cloudflare Dashboard
→ Usually: missing dependencies or env vars

### "Domain changed"
→ KHÔNG THỂ XẢY RA! Domain always stays `designhubv2.pages.dev`

---

## 📞 Links You Need

**Cloudflare Settings** (Connect Git here):
👉 https://dash.cloudflare.com/pages/view/designhubv2/settings/builds

**GitHub Repository**:
👉 https://github.com/samantha-blablabla/DesignHubv2

**Production Site** (unchanged):
👉 https://designhubv2.pages.dev

---

## ✅ Success Checklist

- [ ] Open Cloudflare Dashboard
- [ ] Navigate to Settings → Build settings
- [ ] Click "Connect to Git"
- [ ] Select `samantha-blablabla/DesignHubv2`
- [ ] Set production branch: `main`
- [ ] Verify build settings (Vite, npm run build, dist)
- [ ] Check environment variables exist
- [ ] Click "Save"
- [ ] Wait for first build to complete
- [ ] Verify `wrangler pages project list` shows "GitHub"
- [ ] Test auto-deploy with small commit

---

**Time Required**: 2-3 minutes
**Difficulty**: Very Easy (just clicking buttons)
**Risk**: ZERO (domain stays the same, can disconnect anytime)

**Result**: 🎉 Push to GitHub = Auto-deploy to `designhubv2.pages.dev`!

---

**Created**: 2026-01-12
**Purpose**: Connect Git while keeping `designhubv2.pages.dev` domain
**Status**: Ready to execute
