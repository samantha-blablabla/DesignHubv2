# 🔄 WORKFLOW: Google AI Studio + Claude Code

## 📋 Tổng quan

**Phân công công việc:**
- **Google AI Studio (GAS)**: UI/UX design, styling, component layout
- **Claude Code**: Back-end logic, API integration, state management, hooks

**Workflow chính**: Sequential → Review → Merge

---

## 🎯 Workflow Step-by-Step

### 1️⃣ GAS: Thiết kế UI/UX
```
GAS tạo/sửa components
↓
Test UI locally
↓
git add . && git commit -m "ui: description"
↓
git push origin master
↓
Báo Claude Code: "GAS vừa push UI cho [feature]"
```

### 2️⃣ Claude Code: Review & Integrate
```
Nhận thông báo từ user
↓
git pull origin master
↓
Review changes (check conflicts, compatibility)
↓
Báo user: "Reviewed, no conflicts" hoặc "Found conflicts in [files]"
↓
User xác nhận OK → proceed
```

### 3️⃣ Claude Code: Add Back-end Logic
```
Add API calls, hooks, utilities
↓
Integrate với UI components từ GAS
↓
Test local (npm run dev)
↓
git add . && git commit -m "feat: [feature] - add backend logic"
↓
git push origin master
↓
Báo user: "Backend integrated, deployed to [URL]"
```

---

## 📁 File Conventions

### Shared Ownership với Quy ước

**Cả GAS và Claude Code đều có thể sửa mọi file**, nhưng tuân thủ:

#### 🎨 GAS Focus Areas
```typescript
// === UI/UX ELEMENTS (GAS Priority) ===
- JSX/TSX structure
- className styling
- Framer Motion animations
- Layout & positioning
- Visual effects
- User interactions (onClick handlers - UI only)

// Example:
<div className="flex items-center gap-4 hover:scale-105 transition-transform">
  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500">
    Click Me
  </button>
</div>
```

#### ⚙️ Claude Code Focus Areas
```typescript
// === BACKEND LOGIC (Claude Code Priority) ===
- useState, useEffect hooks
- API calls (fetch, Supabase)
- Data transformation
- Error handling
- Type definitions (interfaces, types)
- Business logic functions

// Example:
const [data, setData] = useState<Resource[]>([]);

useEffect(() => {
  async function fetchData() {
    const { data, error } = await supabase
      .from('resources')
      .select('*');
    if (data) setData(data);
  }
  fetchData();
}, []);
```

#### 🤝 Shared Areas (Collaboration)
```typescript
// Cả 2 có thể sửa, nhưng phải coordinate:
- Component props interfaces
- Event handlers (UI trigger + backend logic)
- Form submissions
- Modal states
```

---

## 🏷️ Code Markers (Optional but Recommended)

Để tránh conflicts, có thể dùng comments:

```typescript
// === GAS: UI Section ===
<div className="grid grid-cols-3 gap-6">
  {/* GAS designs this layout */}
</div>

// === CLAUDE CODE: Logic Section ===
const handleSubmit = async (e: FormEvent) => {
  // Claude Code handles API calls
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};

// === SHARED: Both can modify ===
interface ResourceProps {
  // GAS adds UI-related props
  // Claude Code adds data-related props
}
```

---

## 🔔 Communication Protocol

### User → Claude Code Notifications

**Khi GAS push xong:**
```
"GAS vừa push UI cho [feature name]"
"GAS đã update [component names]"
"GAS hoàn thành UI phase [X]"
```

**Claude Code Response:**
```
1. Pull code về
2. Review changes
3. Báo status:
   - "✅ No conflicts, proceeding with backend"
   - "⚠️ Found conflicts in [files], need your decision"
   - "❓ Question about [specific UI choice]"
```

### Claude Code → User Notifications

**Khi hoàn thành backend:**
```
"✅ Backend logic added for [feature]"
"✅ API integrated, tested locally"
"✅ Deployed to [production URL]"
"⚠️ Need to test [specific functionality]"
```

---

## 📦 Git Commit Conventions

### GAS Commits (UI/UX)
```bash
git commit -m "ui: Add resource card hover effects"
git commit -m "style: Update BigFooter newsletter form"
git commit -m "ui: Redesign hero section layout"
git commit -m "fix(ui): Fix button alignment in modal"
```

### Claude Code Commits (Backend)
```bash
git commit -m "feat: Add Supabase integration for resources"
git commit -m "feat: Implement pagination logic"
git commit -m "fix: Handle API error states"
git commit -m "refactor: Extract API calls to custom hook"
```

### Shared Commits (Both)
```bash
git commit -m "feat: Complete resource filtering (UI + logic)"
git commit -m "fix: Resolve modal state management issues"
```

---

## 🚨 Conflict Resolution

### Khi có conflicts:

1. **Claude Code discovers conflict**
   ```
   git pull origin master
   # CONFLICT in src/components/ResourceGallery.tsx
   ```

2. **Notify user**
   ```
   "⚠️ Conflict detected in ResourceGallery.tsx
   - GAS changed: lines 45-60 (UI layout)
   - I need to add: lines 55-70 (API logic)

   Options:
   A) I merge carefully, keeping both changes
   B) You merge manually in GAS
   C) We discuss which approach to keep"
   ```

3. **User decides** → Claude Code executes

---

## 📊 Example Workflow Session

### Scenario: Add "Favorite" feature

**Step 1: User assigns**
```
User: "GAS sẽ design UI button favorite, Claude Code add logic save vào Supabase"
```

**Step 2: GAS works**
```
GAS creates:
- Heart icon button
- Hover animations
- Active/inactive states
- Push to GitHub
```

**Step 3: User notifies**
```
User: "GAS vừa push favorite button UI"
```

**Step 4: Claude Code integrates**
```
Claude Code:
1. git pull origin master
2. Review: "✅ UI looks good, no conflicts"
3. Add:
   - useFavorites() hook
   - Supabase 'favorites' table calls
   - Toggle logic
   - Optimistic updates
4. git commit -m "feat: Add favorite functionality (backend)"
5. git push origin master
6. Report: "✅ Favorite feature complete, test at [URL]"
```

---

## 🎯 Best Practices

### DO ✅
- **GAS**: Focus on visual polish, animations, responsive design
- **Claude Code**: Focus on data flow, error handling, performance
- **Both**: Communicate before touching shared interfaces
- **Both**: Pull before starting work
- **Both**: Write descriptive commit messages
- **Both**: Test locally before pushing

### DON'T ❌
- **GAS**: Don't add API calls or complex state management
- **Claude Code**: Don't redesign UI without user approval
- **Both**: Don't force push (git push -f)
- **Both**: Don't commit .env files
- **Both**: Don't work on same file simultaneously without coordination

---

## 🔧 Quick Commands Reference

### For User
```bash
# After GAS pushes, notify Claude Code
"GAS vừa push [feature]"

# Check what GAS changed
git log -1 --stat

# If need to rollback
git reset --hard HEAD~1
```

### For Claude Code
```bash
# Start work session
git pull origin master

# Check what changed
git diff HEAD~1

# Review specific file
git show HEAD:path/to/file.tsx

# Safe commit after adding backend
git add . && git commit -m "feat: [description]" && git push
```

---

## 📈 Workflow Diagram

```
┌─────────────┐
│   GAS (UI)  │
└──────┬──────┘
       │ Design & Push
       ↓
┌─────────────────┐
│  GitHub Repo    │
└──────┬──────────┘
       │ User notifies
       ↓
┌──────────────────┐
│  Claude Code     │ ← Review
│  (Backend)       │
└──────┬───────────┘
       │ Pull & Integrate
       ↓
┌──────────────────┐
│  Add Logic       │
│  - API calls     │
│  - Hooks         │
│  - State mgmt    │
└──────┬───────────┘
       │ Test & Push
       ↓
┌──────────────────┐
│  GitHub Repo     │
└──────┬───────────┘
       │ Auto Deploy
       ↓
┌──────────────────┐
│ Cloudflare Pages │
│ (Production)     │
└──────────────────┘
```

---

## 🎊 Summary

**Sequential Workflow:**
1. GAS designs UI → push
2. User notifies Claude Code
3. Claude Code reviews → confirms
4. Claude Code adds backend → push
5. Both test production

**Shared Ownership with Clear Focus:**
- GAS = Visual & Interactions
- Claude Code = Data & Logic
- Communicate on overlaps

**Review-First Approach:**
- Always review before merging
- Report conflicts immediately
- User makes final decisions

---

**Last Updated**: 2026-01-11
**Status**: ✅ Active Workflow
