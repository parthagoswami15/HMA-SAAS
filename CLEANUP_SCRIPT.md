# HMS Cleanup Script

This document contains commands to clean up the HMS project.

## ⚠️ WARNING
**Before running these commands:**
1. Ensure you have committed all important changes to Git
2. Create a backup branch: `git checkout -b backup-before-cleanup`
3. Review each file before deletion

## Phase 1: Remove Backup Files

### Root Level Files
```powershell
# Remove temporary and backup files
Remove-Item "c:\Users\HP\Desktop\HMS\structure.txt~" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\TEST_AUTH.js" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\test-system.js" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\package.json.deployment-scripts" -ErrorAction SilentlyContinue
```

### API Backup Files
```powershell
# Remove API backup files
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\src\main.ts.backup" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\src\app.superminimal.ts" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\src\main.superminimal.ts" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\src\prisma\prisma.service.ts.backup" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\src\prisma\prisma.module.ts.backup" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\prisma\schema.prisma.backup" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\package.json.backup" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\ormconfig.ts.backup" -ErrorAction SilentlyContinue

# Remove compiled backup files
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\dist\app.superminimal.*" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\dist\main.superminimal.*" -ErrorAction SilentlyContinue
```

### Web Backup Files
```powershell
# Remove web backup files
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\login\page_backup.tsx" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\dashboard\page-original.tsx" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\dashboard\patients\simple-page.tsx" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\dashboard\enhanced-page.tsx" -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\test-icons.js" -ErrorAction SilentlyContinue
```

## Phase 2: Remove Duplicate Routes

### ⚠️ IMPORTANT: Review Before Deletion
These routes are duplicates of dashboard routes. Ensure no external links point to them.

```powershell
# Remove duplicate route directories
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\appointments" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\billing" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\emergency" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\inventory" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\lab-tests" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\medical-records" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\notifications" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\prescriptions" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\radiology" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\reports" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\staff" -Recurse -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\src\app\telemedicine" -Recurse -ErrorAction SilentlyContinue

# Keep these as they may be intentional:
# - /app/auth (authentication routes)
# - /app/login (login page)
# - /app/signup (signup page)
# - /app/profile (user profile)
# - /app/settings (user settings)
# - /app/patients (if this is a public patient portal)
```

## Phase 3: Move Environment Files

```powershell
# Move environment files to correct locations
# NOTE: Only move if they don't already exist in target location

# Check if api.env should be moved
if (Test-Path "c:\Users\HP\Desktop\HMS\api.env") {
    if (-not (Test-Path "c:\Users\HP\Desktop\HMS\apps\api\.env")) {
        Move-Item "c:\Users\HP\Desktop\HMS\api.env" "c:\Users\HP\Desktop\HMS\apps\api\.env"
        Write-Host "Moved api.env to apps/api/.env"
    } else {
        Write-Host "WARNING: apps/api/.env already exists. Please merge manually and delete root api.env"
    }
}

# Check if web.env should be moved
if (Test-Path "c:\Users\HP\Desktop\HMS\web.env") {
    if (-not (Test-Path "c:\Users\HP\Desktop\HMS\apps\web\.env.local")) {
        Move-Item "c:\Users\HP\Desktop\HMS\web.env" "c:\Users\HP\Desktop\HMS\apps\web\.env.local"
        Write-Host "Moved web.env to apps/web/.env.local"
    } else {
        Write-Host "WARNING: apps/web/.env.local already exists. Please merge manually and delete root web.env"
    }
}
```

## Phase 4: Clean Build Artifacts

```powershell
# Clean all build artifacts and reinstall
Remove-Item "c:\Users\HP\Desktop\HMS\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\web\.next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "c:\Users\HP\Desktop\HMS\apps\api\dist" -Recurse -Force -ErrorAction SilentlyContinue

# Reinstall dependencies
cd "c:\Users\HP\Desktop\HMS"
npm install
```

## Phase 5: Run Linting and Formatting

```powershell
cd "c:\Users\HP\Desktop\HMS"

# Install Prettier if not already installed
npm install --save-dev prettier

# Format all files
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"

# Run ESLint with auto-fix
npm run lint:web
npm run lint:api

# Or run both
npm run lint
```

## Phase 6: Verify Changes

```powershell
# Check Git status
git status

# Review changes
git diff

# If everything looks good, commit
git add .
git commit -m "chore: cleanup backup files, duplicate routes, and format code"
```

## Manual Tasks

### 1. Review and Remove Unused Dependencies

```powershell
# Install depcheck
npm install -g depcheck

# Run dependency check
cd "c:\Users\HP\Desktop\HMS\apps\web"
depcheck

cd "c:\Users\HP\Desktop\HMS\apps\api"
depcheck
```

### 2. Review Duplicate Modules

Check if `pharmacy` and `pharmacy-management` are truly different:
- If same: merge into one module
- If different: rename for clarity

### 3. Update Import Paths

After removing duplicate routes, search for any imports that reference them:

```powershell
# Search for imports to deleted routes (example)
Get-ChildItem -Path "c:\Users\HP\Desktop\HMS\apps\web\src" -Recurse -Include "*.tsx","*.ts" | 
    Select-String -Pattern "from ['\"]@/app/appointments" |
    Select-Object -Property Path, LineNumber, Line
```

### 4. Add Redirects (if needed)

If external links exist to old routes, add redirects in `next.config.ts`:

```typescript
// apps/web/next.config.ts
module.exports = {
  async redirects() {
    return [
      {
        source: '/appointments',
        destination: '/dashboard/appointments',
        permanent: true,
      },
      // Add more redirects as needed
    ];
  },
};
```

## Rollback Plan

If something goes wrong:

```powershell
# Rollback to backup branch
git checkout backup-before-cleanup

# Or reset to previous commit
git reset --hard HEAD~1

# Or restore specific files
git checkout HEAD -- path/to/file
```

## Post-Cleanup Checklist

- [ ] All backup files removed
- [ ] Duplicate routes removed or redirected
- [ ] Environment files in correct locations
- [ ] Code formatted with Prettier
- [ ] Lint errors reduced significantly
- [ ] Application builds successfully
- [ ] Application runs without errors
- [ ] Tests pass (if any)
- [ ] Git commit created
- [ ] Documentation updated

## Notes

- Keep the `demo` folder if it's used for demonstrations
- Keep `components` folder in `app` if it contains route-specific components
- Review each deletion carefully - when in doubt, keep it and mark for later review
