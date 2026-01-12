# 🚀 Easy Deployment Guide - DesignHubV2

## Mục Đích
Hướng dẫn deploy website một cách **TỰ ĐỘNG** mà không cần làm thủ công.

---

## ✅ Giải Pháp Tốt Nhất: Kết Nối GitHub (Một Lần Setup, Mãi Mãi Tự Động)

### Tại Sao Nên Dùng?
- ✅ Push code lên GitHub → Tự động deploy
- ✅ Không cần token, không cần command
- ✅ Có preview cho mỗi commit
- ✅ Dễ quản lý, dễ rollback

### Cách Setup (CHỈ 1 LẦN):

#### Bước 1: Vào Cloudflare Dashboard
Mở: https://dash.cloudflare.com/

#### Bước 2: Tìm Nút "Connect Git"
Có 2 cách:

**Cách A: Từ Trang Chính**
1. Click vào project **designhubv2**
2. Tìm banner hoặc notice có chữ **"Connect to Git"** hoặc **"Connect GitHub"**
3. Click vào đó

**Cách B: Từ Settings**
1. Click vào project **designhubv2**
2. Click tab **Settings**
3. Scroll xuống tìm section **"Source"** hoặc **"Builds & deployments"**
4. Click nút **"Connect to Git"**

#### Bước 3: Chọn GitHub
1. Click **"GitHub"**
2. Click **"Authorize Cloudflare"** (nếu chưa authorize)
3. Đăng nhập GitHub nếu cần

#### Bước 4: Chọn Repository
1. Tìm repository: **samantha-blablabla/DesignHubv2**
2. Click **"Begin setup"** hoặc **"Install & Authorize"**

#### Bước 5: Configure Build
Điền thông tin:

```
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: (để trống)
Environment variables: (đã có sẵn trong Settings)
```

#### Bước 6: Save & Deploy
1. Click **"Save and Deploy"**
2. Đợi 3-5 phút
3. Done! ✅

### Sau Khi Setup:
Mỗi khi bạn:
```bash
git add .
git commit -m "update feature"
git push origin main
```

→ Cloudflare **TỰ ĐỘNG DEPLOY** trong 3-5 phút! 🎉

---

## 🔧 Giải Pháp Thay Thế: Deploy Script (Nếu Không Muốn Connect GitHub)

Nếu bạn không muốn connect GitHub, dùng script này:

### Bước 1: Set API Token (CHỈ 1 LẦN)

**Windows (PowerShell):**
```powershell
$env:CLOUDFLARE_API_TOKEN="your-token-here"
```

**Windows (CMD):**
```cmd
set CLOUDFLARE_API_TOKEN=your-token-here
```

**Mac/Linux:**
```bash
export CLOUDFLARE_API_TOKEN=your-token-here
```

### Bước 2: Chạy Deploy Script

**Windows (Git Bash):**
```bash
bash deploy.sh
```

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Hoặc Chạy Trực Tiếp:
```bash
npm run build
wrangler pages deployment create --project-name=designhubv2 --branch=main dist
```

---

## 📝 Token Permissions Cần Thiết

Nếu bạn dùng script (không connect GitHub), token cần có:

✅ **Account Permissions:**
- Cloudflare Pages → Edit

✅ **User Permissions:**
- User Details → Read
- Memberships → Read

✅ **Zone Permissions:**
- Zone → Read

### Tạo Token:
1. Vào: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Chọn template: **"Edit Cloudflare Workers"**
4. Hoặc custom với permissions trên
5. Copy token

---

## 🎯 So Sánh 2 Phương Pháp

| Feature | GitHub Integration | Deploy Script |
|---------|-------------------|---------------|
| Setup lần đầu | 5 phút | 2 phút |
| Deploy sau này | Tự động (push code) | Chạy script |
| Cần token | ❌ Không | ✅ Có |
| Preview deployment | ✅ Có | ❌ Không |
| Rollback | ✅ Dễ | ⚠️  Khó |
| Recommended | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## ✅ Recommend: Connect GitHub!

**Lý do:**
1. Chỉ setup 1 lần, mãi mãi tự động
2. Không cần nhớ token, không cần command
3. Có preview cho mọi commit
4. Dễ rollback nếu có lỗi
5. Industry standard

**Time Investment:**
- Setup: 5 phút
- Benefit: Tiết kiệm hàng giờ sau này

---

## 🆘 Nếu Gặp Vấn Đề

### Issue 1: Không Tìm Thấy "Connect Git" Button
→ Có thể project đã được connect rồi!
→ Check: Settings → Source section

### Issue 2: Token Permission Error
→ Tạo lại token với template "Edit Cloudflare Workers"

### Issue 3: Build Fails
→ Check logs trong Cloudflare Dashboard
→ Đảm bảo environment variables được set

### Issue 4: Deploy Thành Công Nhưng Site Không Update
→ Clear browser cache (Ctrl + Shift + R)
→ Đợi 2-3 phút để CDN propagate

---

## 📞 Contact & Support

Nếu cần help, check:
- Cloudflare Docs: https://developers.cloudflare.com/pages/
- GitHub Issues: https://github.com/samantha-blablabla/DesignHubv2/issues

---

## 🎉 Quick Start (Recommended Path)

1. ✅ Vào Cloudflare Dashboard
2. ✅ Click "Connect to Git" (tìm trong Settings hoặc banner)
3. ✅ Authorize GitHub
4. ✅ Chọn repository: samantha-blablabla/DesignHubv2
5. ✅ Configure: branch=main, build=npm run build, output=dist
6. ✅ Save & Deploy
7. ✅ Push code → Auto deploy! 🚀

**That's it! Mãi mãi tự động từ giờ!** 🎉

---

**Created**: 2026-01-12
**Purpose**: Make deployment automatic and easy
**Recommended Method**: GitHub Integration
