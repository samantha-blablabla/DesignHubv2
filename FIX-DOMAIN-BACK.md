# 🔧 Fix Domain Back to `designhubv2.pages.dev`

## 🎯 Vấn Đề Hiện Tại

**Trước khi connect Git**:
- Domain: `designhubv2.pages.dev` ✅

**Sau khi connect Git** (từ screenshot):
- Domain: `designhubv2.vynnt711.workers.dev` ❌
- Đây là Workers domain, KHÔNG phải Pages domain

---

## 🔍 Nguyên Nhân

Có 2 khả năng:

### 1. Cloudflare Tạo Project Mới (Workers)
Khi cậu connect Git, Cloudflare có thể đã tạo một **Workers project** mới thay vì connect vào **Pages project** cũ.

**Kết quả**:
- Pages project cũ: `designhubv2.pages.dev` (vẫn tồn tại, không có Git)
- Workers project mới: `designhubv2.vynnt711.workers.dev` (có Git)

### 2. Account Settings
Domain `vynnt711.workers.dev` là subdomain của Cloudflare Workers account (dựa trên email/username).

---

## ✅ Giải Pháp 1: Switch Về Pages Project Cũ

### Step 1: Xác Nhận Pages Project Vẫn Tồn Tại

Vào Cloudflare Dashboard:
👉 https://dash.cloudflare.com/pages

**Kiểm tra**:
- Có thấy project `designhubv2` không?
- Domain có phải `designhubv2.pages.dev` không?

### Step 2: Delete Workers Project (Nếu Có)

Nếu thấy 2 projects:
1. `designhubv2` (Pages) - designhubv2.pages.dev
2. `designhubv2` (Workers) - designhubv2.vynnt711.workers.dev

→ Delete cái Workers, giữ lại Pages

### Step 3: Connect Git Vào Pages Project Đúng

1. Vào Pages project `designhubv2`
2. Settings → Builds & deployments
3. Connect to Git (GitHub)
4. Select `samantha-blablabla/DesignHubv2`

---

## ✅ Giải Pháp 2: Add Custom Domain

Nếu muốn giữ nguyên project hiện tại nhưng đổi domain:

### Step 1: Vào Custom Domains

Trong project hiện tại:
1. Click tab **"Custom domains"**
2. Click **"Set up a custom domain"**

### Step 2: Add Pages Domain

**⚠️ Vấn đề**: `designhubv2.pages.dev` là Cloudflare Pages domain, không thể add như custom domain.

**Giải pháp**: Phải dùng Pages project, không phải Workers.

---

## ✅ Giải Pháp 3: Xóa & Tạo Lại Đúng

**⚠️ NUCLEAR OPTION - CHỈ DÙNG KHI CẦN**

### Step A: Backup Environment Variables

Trước khi xóa, copy values:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Step B: Delete Workers Project

```bash
# Nếu đây là Workers project
wrangler delete designhubv2
```

### Step C: Recreate Pages Project với Git

1. Vào: https://dash.cloudflare.com/pages/new
2. Click **"Connect to Git"**
3. Select GitHub repository
4. **Project name**: `designhubv2`
5. **Production branch**: `main`
6. Build command: `npm run build`
7. Output: `dist`
8. Add environment variables

**Kết quả**:
- Domain: `designhubv2.pages.dev` ✅
- Git: Connected ✅

---

## 🎯 Recommended Steps (Ngay Bây Giờ)

### Step 1: Check Pages Dashboard

👉 https://dash.cloudflare.com/pages

**Kiểm tra**:
- [ ] Có bao nhiêu projects tên `designhubv2`?
- [ ] Project nào có domain `designhubv2.pages.dev`?
- [ ] Project nào có Git connected?

### Step 2: Xác Định Project Type

**Pages Project** (muốn giữ):
- URL pattern: `*.pages.dev`
- Type: "Pages"
- Có Deployments history

**Workers Project** (không cần):
- URL pattern: `*.workers.dev`
- Type: "Workers"
- Khác với Pages

### Step 3: Navigate to Correct Project

Vào đúng **Pages project** `designhubv2`:
👉 https://dash.cloudflare.com/pages/view/designhubv2

**Verify**:
- Domain: `designhubv2.pages.dev` ✅
- Type: Pages ✅

### Step 4: Connect Git to Pages (Not Workers)

**From Pages project**:
1. Deployments → View details
2. Look for "Connect to Git" option
3. Or Settings → Source

---

## 🔍 Debug Commands

```bash
# List all Pages projects
wrangler pages project list

# Should show:
# designhubv2 | designhubv2.pages.dev | No/GitHub | ...

# Check current deployment
wrangler pages deployment list --project-name=designhubv2

# Should show deployments to designhubv2.pages.dev
```

---

## ⚠️ Important Notes

### Workers vs Pages
- **Workers**: `*.workers.dev` - Serverless functions
- **Pages**: `*.pages.dev` - Static site hosting

**Cậu cần**: Pages (not Workers)

### Domain Cannot Be Changed
- `designhubv2.pages.dev` → Tied to Pages project
- `designhubv2.vynnt711.workers.dev` → Tied to Workers project
- Cannot convert one to another

### Solution
Delete Workers project, use Pages project with Git.

---

## 📞 Next Actions for You

1. **Open**: https://dash.cloudflare.com/pages
2. **Screenshot** the projects list (bao nhiêu project `designhubv2`)
3. **Tell me** what you see
4. **I'll guide** you to fix it

---

**Created**: 2026-01-12
**Issue**: Domain changed from `.pages.dev` to `.workers.dev`
**Cause**: Connected Git to Workers instead of Pages
**Fix**: Use correct Pages project for Git connection
