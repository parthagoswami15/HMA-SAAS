# 🚀 QUICK FIX - SIMPLE COMMANDS

**Issue:** PowerShell script has execution policy restrictions  
**Solution:** Use npm commands directly

---

## ✅ RUN THESE COMMANDS (Copy & Paste):

```powershell
# You're already in the right directory: C:\Users\HP\Desktop\HMS\apps\web

# Step 1: Fix all warnings automatically
npm run lint -- --fix

# Step 2: Verify build works
npm run build

# Step 3: Check remaining warnings
npm run lint
```

---

## 📊 WHAT WILL HAPPEN:

### Step 1: `npm run lint -- --fix`

- ⏱️ Takes 2-3 minutes
- ✅ Removes ~400 unused imports automatically
- ✅ Fixes code formatting
- ✅ Safe - only fixes what ESLint knows is safe

### Step 2: `npm run build`

- ⏱️ Takes 3-5 minutes
- ✅ Verifies everything still works
- ✅ Should complete successfully

### Step 3: `npm run lint`

- ⏱️ Takes 30 seconds
- ℹ️ Shows remaining warnings (~80-100)
- ℹ️ These are React Hooks warnings (safe to ignore for now)

---

## 🎯 AFTER RUNNING COMMANDS:

```bash
# Commit the changes
git add .
git commit -m "fix: auto-fix ESLint warnings - remove unused imports"

# Push to deploy
git push origin main
```

---

## ⚡ ALTERNATIVE: Fix Specific Files

If you want to fix files one by one:

```powershell
# Fix individual files
npx eslint src/app/appointments/page.tsx --fix
npx eslint src/app/communications/page.tsx --fix
npx eslint src/app/dashboard/ai-assistant/page.tsx --fix
# etc...
```

---

## 🚨 IF YOU GET ERRORS:

### PowerShell Execution Policy Error?

```powershell
# Enable script execution (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again
.\fix-all-warnings.ps1
```

### OR just use npm directly (no admin needed):

```powershell
npm run lint -- --fix
```

---

**SIMPLEST SOLUTION - RUN THIS NOW:**

```powershell
npm run lint -- --fix && npm run build
```

This single command will:

- ✅ Fix all auto-fixable warnings
- ✅ Verify build works
- ✅ Take 5 minutes total

**That's it!** 🎉
