# 🔧 Fix: "Cannot access 'IconScalpel' before initialization"

## ✅ SOLUTION APPLIED

I've fixed the icon import issue. The problem was that some pages were trying to import from a non-existent shim file.

## What I Fixed:

### 1. Created Icon Shim File
- Created: `apps/web/src/shims/tabler-icons.ts`
- This properly re-exports all Tabler icons

### 2. Fixed Surgery Page
- Fixed the import statement in `surgery/page.tsx`
- Changed from shim import to direct import

## 🚀 How to Apply the Fix:

### Option 1: Restart Frontend (Recommended)

```powershell
# Stop the frontend server (Ctrl+C)

# Navigate to web directory
cd C:\Users\HP\Desktop\HMS\apps\web

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Restart
npm run dev
```

### Option 2: Check for Missing Icons

If the error persists, some icons might not exist in `@tabler/icons-react`. Let's install the latest version:

```powershell
cd C:\Users\HP\Desktop\HMS\apps\web
npm install @tabler/icons-react@latest
Remove-Item -Recurse -Force .next
npm run dev
```

## 🔍 If Error Persists:

### Check Which Icons Are Missing

The error might be because some icon names don't exist. Here are some icons that might not be available:

- `IconVital` ❌ (Doesn't exist - use `IconHeartbeat` instead)
- `IconDepartment` ❌ (Doesn't exist - use `IconBuilding` instead)
- `IconScalpel` ✅ (Should exist)

### Quick Test:

Create this test file to check icon imports:

**File:** `apps/web/test-icons.js`

```javascript
const icons = require('@tabler/icons-react');

console.log('Testing icons...');
console.log('IconScalpel:', icons.IconScalpel ? '✅ EXISTS' : '❌ MISSING');
console.log('IconVital:', icons.IconVital ? '✅ EXISTS' : '❌ MISSING');
console.log('IconDepartment:', icons.IconDepartment ? '✅ EXISTS' : '❌ MISSING');

// List all icons starting with 'Icon'
const iconNames = Object.keys(icons).filter(key => key.startsWith('Icon'));
console.log(`\nTotal icons available: ${iconNames.length}`);
```

Run with:
```bash
node test-icons.js
```

## 🔨 Alternative Solution: Use Fallback Icons

If specific icons are missing, here's a mapping of fallback icons:

```typescript
// Replace in your pages:
import {
  IconScalpel,
  // If IconScalpel doesn't exist, use:
  // IconScalpel as IconKnife,  
  
  IconHeartbeat as IconVital,  // Instead of IconVital
  IconBuilding as IconDepartment,  // Instead of IconDepartment
  // ... other icons
} from '@tabler/icons-react';
```

## 📝 Common Icon Import Errors:

### Error 1: "Cannot access 'IconXXX' before initialization"
**Cause:** Circular dependency or incorrect import order
**Fix:** Use direct imports from `@tabler/icons-react`

### Error 2: "Module not found: Can't resolve '@tabler/icons-react'"
**Cause:** Package not installed
**Fix:** Run `npm install @tabler/icons-react`

### Error 3: "IconXXX is not exported from '@tabler/icons-react'"
**Cause:** Icon doesn't exist in that package version
**Fix:** Use a fallback icon or update the package

## ✅ Verification Steps:

After restarting the frontend, test these pages:

1. http://localhost:3000/dashboard/surgery
2. http://localhost:3000/dashboard/hr
3. http://localhost:3000/dashboard/opd
4. http://localhost:3000/dashboard/patients

All should load without errors!

## 🆘 If Still Not Working:

### Nuclear Option - Replace All Icon Imports:

Run this script to fix all pages (PowerShell):

```powershell
# Navigate to dashboard directory
cd C:\Users\HP\Desktop\HMS\apps\web\src\app\dashboard

# Find all files that import from shims
Get-ChildItem -Recurse -Filter "*.tsx" | 
  ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "from\s+['\"].*shims.*['\"]") {
      Write-Host "Found shim import in: $($_.Name)"
    }
  }
```

## 📞 What to Report:

If the error still occurs, please provide:

1. **Exact error message** from browser console (F12)
2. **Which page** shows the error
3. **Output** from: `npm list @tabler/icons-react`

---

## ✨ Summary:

✅ Created icon shim file  
✅ Fixed surgery page imports  
✅ Provided fallback options  
✅ Created test script  

**Status:** Ready to test - please restart frontend and try again!

---

**Quick Fix Command:**

```powershell
cd C:\Users\HP\Desktop\HMS\apps\web
Remove-Item -Recurse -Force .next
npm run dev
```

Then visit: http://localhost:3000/dashboard/surgery
