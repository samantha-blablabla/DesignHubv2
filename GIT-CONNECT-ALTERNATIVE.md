# 🔗 Alternative: Connect Git via Pages Configuration

## 🎯 Cloudflare Changed UI - New Method

Cloudflare đã thay đổi UI, không còn "Connect to Git" button ở Settings nữa.

---

## ✅ Cách 1: Thông Qua Pages Configuration

### Step 1: Vào Pages Configuration Page

**Click vào link này**:
👉 https://dash.cloudflare.com/pages/new/provider/github

Hoặc:
1. Vào: https://dash.cloudflare.com/
2. Click **"Workers & Pages"** (sidebar trái)
3. Click **"Create application"**
4. Chọn **"Pages"** tab
5. Click **"Connect to Git"**

---

### Step 2: Authorize GitHub

1. Click **"Connect GitHub"**
2. Authorize Cloudflare Pages nếu chưa
3. Sẽ thấy list repositories

---

### Step 3: Select Repository

**QUAN TRỌNG**: Chọn repository `samantha-blablabla/DesignHubv2`

**⚠️ CHÚ Ý**: Khi select repo này, Cloudflare sẽ hỏi:
```
"This repository is already connected to project: designhubv2"
"Do you want to reconfigure the connection?"
```

→ Click **"Yes, reconfigure"** hoặc **"Continue"**

---

### Step 4: Configure Connection

**Project name**: `designhubv2` (keep existing)
**Production branch**: `main`

**Build settings**:
```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

**Environment variables**: (Already configured, will be preserved)

---

### Step 5: Save

Click **"Save and Deploy"**

**Result**:
- ✅ Git connected to existing project `designhubv2`
- ✅ Domain stays `designhubv2.pages.dev`
- ✅ Auto-deploy enabled

---

## ✅ Cách 2: Via Cloudflare API (Advanced)

Nếu UI không work, có thể dùng Cloudflare API để connect Git.

**Cần**:
- Cloudflare API Token
- Account ID
- Project ID

Nhưng cách này phức tạp hơn, chỉ dùng khi cách 1 không được.

---

## ✅ Cách 3: Recreate Project with Git (Last Resort)

**⚠️ CHỈ DÙNG KHI CẦN THIẾT**

Nếu không connect được, có thể:
1. Backup environment variables hiện tại
2. Delete project `designhubv2`
3. Tạo lại từ GitHub (auto-connect Git)
4. Restore environment variables

**Lưu ý**: Sẽ mất deployment history

---

## 🎯 Recommended: Cách 1

**Link trực tiếp**:
👉 https://dash.cloudflare.com/pages/new/provider/github

**Steps**:
1. Click link trên
2. Authorize GitHub
3. Select `samantha-blablabla/DesignHubv2`
4. Khi hỏi "already connected", click "Reconfigure"
5. Verify settings (main branch, npm run build, dist)
6. Save

**Domain sẽ giữ nguyên**: `designhubv2.pages.dev` ✅

---

**Created**: 2026-01-12
**Reason**: Cloudflare UI changed, no "Connect to Git" in Settings
**Solution**: Use Pages Configuration page to reconfigure connection
