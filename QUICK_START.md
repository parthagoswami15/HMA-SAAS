# 🚀 HMS Optimization Quick Start

## ✅ Setup Complete

Your HMS application now has:

- ✅ **React Query** - API caching & optimization
- ✅ **RBAC System** - Role-based access control
- ✅ **Loading States** - Polished UX components
- ✅ **Security** - Headers, CSRF, validation
- ✅ **Middleware** - Authentication guards
- ✅ **Lazy Loading** - Code splitting utilities

---

## 🎯 What to Do Next

### 1. Fix Build Errors (Immediate)

Some pre-existing files have errors. Fix these first:

**apps/web/src/app/appointments/page.tsx**
- Line 466: `'Input'` is not defined
- Line 551: Escape apostrophe

**apps/web/src/app/auth/login/page.tsx**
- Line 388: Escape apostrophe

**apps/web/src/app/dashboard/appointments/page.tsx**
- Line 569: Escape apostrophe

**apps/web/src/app/dashboard/enhanced-page.tsx**
- Lines 353: Escape apostrophes

```tsx
// Fix: Replace straight quotes with &apos; or use different quotes
"Don't forget" → "Don&apos;t forget"
// or
"Don't forget" → "Do not forget"
```

---

### 2. Start Development Server

```bash
cd apps/web
npm run dev
```

Visit: http://localhost:3000

---

### 3. Test React Query (5 min)

Open DevTools → Bottom left corner → **React Query DevTools** icon

1. Navigate between pages
2. Watch queries cache data
3. Go back → instant load from cache!

---

### 4. Test RBAC (10 min)

#### Create Test Login

```tsx
// apps/web/src/app/test-login/page.tsx
'use client';

import { useRBAC, UserRole } from '@/lib/rbac/RBACProvider';
import { useRouter } from 'next/navigation';
import { Button, Stack, Paper, Title } from '@mantine/core';

export default function TestLogin() {
  const { login } = useRBAC();
  const router = useRouter();

  const loginAs = (role: UserRole) => {
    login({
      id: '1',
      email: 'test@example.com',
      role,
      firstName: 'Test',
      lastName: 'User',
    });
    router.push('/dashboard');
  };

  return (
    <Paper p="xl" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <Title order={2} mb="lg">Test Login</Title>
      <Stack>
        <Button onClick={() => loginAs(UserRole.SUPER_ADMIN)}>
          Login as Super Admin
        </Button>
        <Button onClick={() => loginAs(UserRole.DOCTOR)}>
          Login as Doctor
        </Button>
        <Button onClick={() => loginAs(UserRole.NURSE)}>
          Login as Nurse
        </Button>
        <Button onClick={() => loginAs(UserRole.RECEPTIONIST)}>
          Login as Receptionist
        </Button>
        <Button onClick={() => loginAs(UserRole.PATIENT)}>
          Login as Patient
        </Button>
      </Stack>
    </Paper>
  );
}
```

Visit: http://localhost:3000/test-login

Try different roles → Watch navigation change!

---

### 5. Apply to Your First Page (15 min)

Pick one page to start. Example: **Patients List**

#### Before:
```tsx
// apps/web/src/app/dashboard/patients/page.tsx
export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(setPatients)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render */}</div>;
}
```

#### After:
```tsx
// apps/web/src/app/dashboard/patients/page.tsx
'use client';

import { withRBAC, Permission } from '@/lib/rbac/RBACProvider';
import { usePatients } from '@/lib/api/hooks';
import { TableSkeleton } from '@/components/shared/LoadingStates';

function PatientsPage() {
  const { data: patients, isLoading } = usePatients();

  if (isLoading) return <TableSkeleton rows={10} />;
  return <div>{/* render */}</div>;
}

export default withRBAC(PatientsPage, [Permission.VIEW_PATIENTS]);
```

**Result**: ✨ Role protection + caching + loading states!

---

### 6. Update Navigation (10 min)

Add permission checks to your sidebar/nav:

```tsx
// apps/web/src/components/Navigation.tsx
import { useRBAC, Permission } from '@/lib/rbac/RBACProvider';

export function Navigation() {
  const { hasPermission, user } = useRBAC();

  return (
    <nav>
      <div>Welcome, {user?.firstName}!</div>
      
      {hasPermission(Permission.VIEW_PATIENTS) && (
        <NavLink href="/dashboard/patients">Patients</NavLink>
      )}
      
      {hasPermission(Permission.VIEW_APPOINTMENTS) && (
        <NavLink href="/dashboard/appointments">Appointments</NavLink>
      )}
      
      {hasPermission(Permission.VIEW_REPORTS) && (
        <NavLink href="/dashboard/reports">Reports</NavLink>
      )}
    </nav>
  );
}
```

---

## 📊 Verify Success

### Check React Query is Working:

1. Open a page with data
2. Open React Query DevTools
3. See query in "fresh" state
4. Navigate away and back
5. Data loads instantly (from cache)

### Check RBAC is Working:

1. Login as Doctor role
2. Try accessing `/dashboard/settings`
3. Should redirect to `/dashboard` with notification
4. Check navigation - some links hidden

### Check Security Headers:

1. Open DevTools → Network tab
2. Click any request
3. Check Response Headers
4. Should see: `X-Frame-Options`, `X-Content-Type-Options`, etc.

---

## 🎓 Learn More

- **Full docs**: `OPTIMIZATION_GUIDE.md`
- **Integration steps**: `INTEGRATION_CHECKLIST.md`
- **Example**: `apps/web/src/app/dashboard/example-protected-page.tsx`

---

## 🐛 Common Issues

### "useRBAC must be used within RBACProvider"

✅ **Fixed** - RBACProvider is in `apps/web/src/app/providers.tsx`

### Build errors about existing code

❌ Fix pre-existing errors in appointment and auth pages (see section 1)

### Middleware redirecting everything

✅ **Configured** - Public routes include `/auth/*` and `/`

### TypeScript errors

Run: `npm run build` to see all errors at once

---

## 📈 Performance Tips

### 1. Monitor Bundle Size

```bash
npm install -D @next/bundle-analyzer
```

```js
// next.config.js (add this)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

```bash
ANALYZE=true npm run build
```

### 2. Use Lazy Loading

For heavy components:

```tsx
import { lazyLoad } from '@/lib/lazy/LazyComponents';

const HeavyChart = lazyLoad(() => import('@/components/HeavyChart'));
```

### 3. Prefetch Links

```tsx
<Link href="/dashboard/patients" prefetch>Patients</Link>
```

---

## 🎉 Success Metrics

You'll know it's working when:

- ✅ Navigation instant between pages (cache!)
- ✅ Skeletons show while loading
- ✅ Different roles see different menus
- ✅ Unauthorized pages redirect
- ✅ Build completes without errors
- ✅ Lighthouse score improves

---

## 🤝 Need Help?

1. Check `OPTIMIZATION_GUIDE.md` for detailed docs
2. Look at `example-protected-page.tsx` for patterns
3. Review `INTEGRATION_CHECKLIST.md` for step-by-step

---

**Built with** ❤️ **for HMS**

*Ready to scale! 🚀*
