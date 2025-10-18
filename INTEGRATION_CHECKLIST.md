# Integration Checklist & Migration Guide

This checklist will guide you through integrating the new optimization, RBAC, and security features into your existing HMS application.

---

## ✅ Completed Steps

- [x] Installed React Query dependencies
- [x] Integrated QueryProvider in app providers
- [x] Integrated RBACProvider in app providers
- [x] Added Mantine Notifications to providers
- [x] Added security headers to Next.js config
- [x] Created middleware for authentication
- [x] Created example protected page

---

## 🔄 Next Steps

### 1. Update Existing API Routes (Backend)

Your API routes need CSRF validation middleware. Create this file:

**File**: `apps/api/src/middleware/csrf.ts` (or similar based on your backend structure)

```typescript
import { validateCSRFToken } from '@/lib/security/csrf';

export function csrfMiddleware(req, res, next) {
  const csrfToken = req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;

  if (!validateCSRFToken(csrfToken, sessionToken)) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
}
```

Apply to POST/PUT/DELETE routes:

```typescript
app.post('/api/patients', csrfMiddleware, createPatientHandler);
```

---

### 2. Update Existing Pages with RBAC

#### Option A: Using HOC (Recommended for full pages)

```tsx
// Before
export default function PatientsPage() {
  return <div>Patients</div>;
}

// After
import { withRBAC, Permission } from '@/lib/rbac/RBACProvider';

function PatientsPage() {
  return <div>Patients</div>;
}

export default withRBAC(PatientsPage, [Permission.VIEW_PATIENTS]);
```

#### Option B: Using Hook (For conditional rendering)

```tsx
import { useRBAC, Permission } from '@/lib/rbac/RBACProvider';

function PatientsPage() {
  const { hasPermission } = useRBAC();

  return (
    <div>
      <h1>Patients</h1>
      {hasPermission(Permission.CREATE_PATIENTS) && (
        <button>Add Patient</button>
      )}
    </div>
  );
}
```

#### Option C: Using Component (For specific elements)

```tsx
import { ProtectedElement, Permission } from '@/lib/rbac/RBACProvider';

function Dashboard() {
  return (
    <div>
      <ProtectedElement permissions={[Permission.VIEW_REPORTS]}>
        <ReportsWidget />
      </ProtectedElement>
    </div>
  );
}
```

---

### 3. Replace Data Fetching with React Query Hooks

#### Before (Traditional approach):

```tsx
function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* render patients */}</div>;
}
```

#### After (React Query approach):

```tsx
import { usePatients } from '@/lib/api/hooks';
import { TableSkeleton, ErrorState } from '@/components/shared/LoadingStates';

function PatientsPage() {
  const { data: patients, isLoading, error, refetch } = usePatients();

  if (isLoading) return <TableSkeleton rows={10} />;
  if (error) return <ErrorState message={error.message} onAction={refetch} />;

  return <div>{/* render patients */}</div>;
}
```

---

### 4. Add Loading States Throughout Application

Replace all loading indicators with the new components:

```tsx
import {
  LoadingSpinner,
  TableSkeleton,
  CardSkeleton,
  FullPageLoader,
} from '@/components/shared/LoadingStates';

// For tables
{isLoading ? <TableSkeleton rows={10} /> : <DataTable data={data} />}

// For cards
{isLoading ? <CardSkeleton /> : <Card {...props} />}

// For full page
{isLoading && <FullPageLoader message="Loading dashboard..." />}

// For inline
{isLoading && <LoadingSpinner size="sm" />}
```

---

### 5. Implement Authentication Flow

Create login functionality that sets user in RBAC:

```tsx
// apps/web/src/app/auth/login/page.tsx
'use client';

import { useRBAC, UserRole } from '@/lib/rbac/RBACProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useRBAC();
  const router = useRouter();

  const handleLogin = async (credentials) => {
    // Call your login API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const user = await response.json();

    // Store user in RBAC context
    login({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Login form fields */}
    </form>
  );
}
```

---

### 6. Update Navigation with Permission Checks

```tsx
import { useRBAC, Permission } from '@/lib/rbac/RBACProvider';

function Navigation() {
  const { hasPermission } = useRBAC();

  return (
    <nav>
      {hasPermission(Permission.VIEW_PATIENTS) && (
        <Link href="/dashboard/patients">Patients</Link>
      )}
      {hasPermission(Permission.VIEW_APPOINTMENTS) && (
        <Link href="/dashboard/appointments">Appointments</Link>
      )}
      {hasPermission(Permission.VIEW_STAFF) && (
        <Link href="/dashboard/staff">Staff</Link>
      )}
      {hasPermission(Permission.VIEW_REPORTS) && (
        <Link href="/dashboard/reports">Reports</Link>
      )}
    </nav>
  );
}
```

---

### 7. Create Custom Hooks for Your Specific APIs

If you have custom endpoints not covered in `apps/web/src/lib/api/hooks.ts`, add them:

```tsx
// Add to apps/web/src/lib/api/hooks.ts

export function useCustomEndpoint(id: string) {
  return useQuery({
    queryKey: ['custom', id],
    queryFn: () => apiClient.get(`/api/custom/${id}`),
    enabled: !!id,
  });
}

export function useCreateCustom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/custom', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom'] });
      notifications.show({
        title: 'Success',
        message: 'Created successfully',
        color: 'green',
      });
    },
  });
}
```

---

### 8. Add Lazy Loading to Heavy Components

For large pages or components, use lazy loading:

```tsx
import { lazyLoad } from '@/lib/lazy/LazyComponents';

// Create lazy component
const HeavyChart = lazyLoad(
  () => import('@/components/charts/HeavyChart')
);

function ReportsPage() {
  return (
    <div>
      <h1>Reports</h1>
      <HeavyChart /> {/* Automatically wrapped with Suspense */}
    </div>
  );
}
```

---

### 9. Test the Integration

#### Test RBAC:

```bash
1. Login as different user roles
2. Verify navigation items appear/disappear based on permissions
3. Try accessing restricted routes directly
4. Verify redirect to dashboard with notification
```

#### Test React Query:

```bash
1. Open React Query DevTools (bottom-left corner in development)
2. Verify queries are cached
3. Navigate away and back - data loads instantly from cache
4. Trigger mutations - verify auto-refetch of related queries
```

#### Test Security:

```bash
1. Check browser DevTools → Network → Response Headers
2. Verify security headers are present
3. Test file upload with invalid file types
4. Test rate limiting by making rapid requests
```

---

### 10. Performance Optimization

#### Enable Bundle Analysis:

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

```bash
npm install -D @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

---

## 📋 Pages to Update

Update these existing pages with RBAC, React Query, and loading states:

- [ ] `/dashboard/page.tsx`
- [ ] `/dashboard/patients/page.tsx`
- [ ] `/dashboard/patients/[id]/page.tsx`
- [ ] `/dashboard/appointments/page.tsx`
- [ ] `/dashboard/appointments/[id]/page.tsx`
- [ ] `/dashboard/billing/page.tsx`
- [ ] `/dashboard/billing/invoices/[id]/page.tsx`
- [ ] `/dashboard/staff/page.tsx`
- [ ] `/dashboard/staff/[id]/page.tsx`
- [ ] `/dashboard/pharmacy/page.tsx`
- [ ] `/dashboard/laboratory/page.tsx`
- [ ] `/dashboard/radiology/page.tsx`
- [ ] `/dashboard/reports/page.tsx`
- [ ] `/dashboard/settings/page.tsx`

---

## 🎯 Priority Order

1. **High Priority** (Do first):
   - Update authentication/login flow
   - Apply RBAC to main dashboard pages
   - Replace data fetching in patient and appointment modules

2. **Medium Priority** (Do next):
   - Add loading states to all pages
   - Update navigation with permission checks
   - Apply security features to forms

3. **Low Priority** (Polish):
   - Add lazy loading to heavy components
   - Optimize bundle size
   - Add advanced caching strategies

---

## 🐛 Common Issues & Solutions

### Issue: "useRBAC must be used within RBACProvider"

**Solution**: Ensure `RBACProvider` is in your providers and wrapping your app.

### Issue: React Query hooks not working

**Solution**: Verify `QueryProvider` is wrapping your app and `@tanstack/react-query` is installed.

### Issue: Middleware redirecting all routes

**Solution**: Check `publicRoutes` array in `middleware.ts` includes your auth routes.

### Issue: CSRF validation failing

**Solution**: Ensure `initializeCSRFToken()` is called on app mount and token is sent in headers.

### Issue: Performance not improved

**Solution**: 
- Check bundle size with analyzer
- Verify lazy loading is implemented
- Ensure React Query caching is working (use DevTools)

---

## 📚 Additional Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Mantine Components](https://mantine.dev/)
- [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md) - Detailed usage guide

---

## ✨ Success Criteria

You'll know the integration is successful when:

- ✅ Users can only access pages they have permissions for
- ✅ Navigation automatically hides/shows based on permissions
- ✅ Data loads instantly on revisit (React Query cache)
- ✅ Loading states show consistently across all pages
- ✅ Security headers appear in browser DevTools
- ✅ No hydration or build errors
- ✅ Performance metrics improve (use Lighthouse)

---

**Need Help?** Refer to the example file: `apps/web/src/app/dashboard/example-protected-page.tsx`
