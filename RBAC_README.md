# 🔐 RBAC System - Hospital Management SaaS

## Quick Links

📚 **Documentation**
- [Quick Start Guide](./RBAC_QUICK_START.md) - Get started in 5 minutes
- [Implementation Guide](./RBAC_IMPLEMENTATION_GUIDE.md) - Complete technical documentation
- [Deployment Checklist](./RBAC_DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment
- [Implementation Summary](./RBAC_IMPLEMENTATION_COMPLETE.md) - What was delivered

---

## 🎯 What is RBAC?

Role-Based Access Control (RBAC) is a security system that restricts access based on user roles. Instead of managing permissions for each user individually, you assign users to roles, and roles have specific permissions.

**Example:**
- **Doctor Role** → Can view/create patients, prescriptions, medical records
- **Nurse Role** → Can view patients, update vital signs, view prescriptions
- **Receptionist Role** → Can create appointments, view patient info, process billing
- **Admin Role** → Can do everything including manage roles and users

---

## ✨ Key Features

### 🏥 Tenant Isolation
Each hospital/clinic manages its own roles independently. Roles created in Hospital A are completely separate from Hospital B.

### 🔒 Security First
- Every protected route validates permissions
- All RBAC operations are logged
- System roles cannot be deleted
- Complete audit trail

### 🎨 User-Friendly
- Beautiful role management UI
- Visual permission selection
- Real-time stats dashboard
- Clear error messages

### 🔧 Developer-Friendly
- Simple decorator: `@RequirePermissions('patient.view')`
- Type-safe permission constants
- Comprehensive documentation
- Easy to extend

### ♻️ Backward Compatible
- No breaking changes
- Existing auth flows work unchanged
- All existing data preserved
- Gradual migration path

---

## 🚀 Quick Start

### 1. Run Setup Script

```powershell
cd apps/api
.\setup-rbac.ps1
```

### 2. Restart Backend

```bash
npm run start:dev
```

### 3. Access UI

Navigate to: `http://localhost:3000/dashboard/roles`

**That's it!** Your RBAC system is ready to use.

---

## 📖 Documentation Structure

### For Quick Setup
Start here → [RBAC_QUICK_START.md](./RBAC_QUICK_START.md)
- 5-minute setup guide
- Common use cases
- Quick reference

### For Deployment
Use this → [RBAC_DEPLOYMENT_CHECKLIST.md](./RBAC_DEPLOYMENT_CHECKLIST.md)
- Pre-deployment checklist
- Step-by-step deployment
- Verification steps
- Rollback plan

### For Development
Read this → [RBAC_IMPLEMENTATION_GUIDE.md](./RBAC_IMPLEMENTATION_GUIDE.md)
- Architecture overview
- Database schema
- API documentation
- Frontend integration
- Security considerations
- Troubleshooting

### For Overview
Check this → [RBAC_IMPLEMENTATION_COMPLETE.md](./RBAC_IMPLEMENTATION_COMPLETE.md)
- What was delivered
- Features list
- Files created
- Success metrics

---

## 🎓 Common Scenarios

### Scenario 1: Create a New Role

**Via UI:**
1. Go to `/dashboard/roles`
2. Click "Create Role"
3. Enter name and description
4. Select permissions
5. Click "Create"

**Via API:**
```typescript
POST /roles
{
  "name": "Doctor",
  "description": "Medical practitioner",
  "permissionIds": ["perm1", "perm2", ...],
  "isActive": true
}
```

### Scenario 2: Assign Role to User

**Via API:**
```typescript
POST /roles/{roleId}/assign/{userId}
```

**Via Database:**
```sql
UPDATE users SET role_id = 'role_id_here' WHERE id = 'user_id_here';
```

### Scenario 3: Protect a Route

**Backend:**
```typescript
@Get()
@RequirePermissions('patient.view')
async findAll() {
  return this.patientsService.findAll();
}
```

**Frontend:**
```typescript
if (!hasPermission(user, PERMISSIONS.PATIENT_VIEW)) {
  return <AccessDenied />;
}
```

### Scenario 4: Check Permissions in UI

```typescript
{hasPermission(user, PERMISSIONS.PATIENT_CREATE) && (
  <Button>Add Patient</Button>
)}
```

---

## 📊 Default Permissions

The system comes with **100+ pre-defined permissions** organized into **21 categories**:

- **Patient Management** - View, create, update, delete patients
- **Appointments** - Manage appointments and schedules
- **Billing & Finance** - Handle invoices, payments, financial reports
- **Pharmacy** - Manage medications and prescriptions
- **Laboratory** - Lab orders and results
- **Radiology** - Radiology orders and reports
- **Inventory** - Manage medical supplies
- **Staff** - Manage staff members
- **RBAC** - Manage roles and permissions
- **EMR** - Electronic medical records
- **IPD/OPD** - Inpatient and outpatient management
- **Emergency** - Emergency case management
- **Surgery** - Surgery scheduling and management
- **Telemedicine** - Virtual consultations
- **Insurance** - Insurance claims
- **Reports** - Generate and export reports
- **Quality** - Quality management
- **Research** - Research data management
- **Communications** - Messages and notifications
- **Settings** - System configuration
- **Audit** - View audit logs

---

## 🏗️ Architecture

```
Frontend (Next.js)
    ↓
JWT with Permissions
    ↓
Backend (NestJS)
    ↓
PermissionsGuard
    ↓
Database (PostgreSQL)
```

### Database Tables

1. **permissions** - Global permission registry
2. **tenant_roles** - Tenant-specific roles
3. **role_permissions** - Role-permission mappings
4. **users** - Added `roleId` field

---

## 🔒 Security Features

✅ **Tenant Isolation** - Complete data separation between tenants  
✅ **Permission Validation** - Every route checks permissions  
✅ **Audit Logging** - All RBAC operations logged  
✅ **System Protection** - Critical roles cannot be deleted  
✅ **JWT Security** - Permissions in token, validated on each request  
✅ **SQL Injection Prevention** - Prisma ORM with parameterized queries  
✅ **Input Validation** - All inputs validated  
✅ **Foreign Key Constraints** - Data integrity enforced

---

## 🧪 Testing

### Manual Testing
1. Create a role with specific permissions
2. Assign role to a test user
3. Login as test user
4. Try to access permitted features → Should work
5. Try to access restricted features → Should be denied

### API Testing
```bash
# Get token
TOKEN="your_jwt_token"

# Test permissions
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/permissions

# Test roles
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/roles
```

---

## 🆘 Troubleshooting

### Issue: TypeScript Errors

**Solution:**
```bash
cd apps/api
npx prisma generate
npm run build
```

### Issue: Permissions Not Working

**Solution:** Re-login to get fresh JWT with updated permissions.

### Issue: Cannot Delete Role

**Reason:** Role has users assigned or is a system role.

**Solution:** Reassign users to different role first.

### Issue: 403 Forbidden

**Reason:** User lacks required permission.

**Solution:** Assign appropriate role/permissions to user.

---

## 📞 Getting Help

1. **Check Documentation**
   - Quick Start Guide
   - Implementation Guide
   - Deployment Checklist

2. **Check Logs**
   - Backend logs: `apps/api/logs/`
   - Database audit logs: `SELECT * FROM audit_logs`

3. **Verify Setup**
   - Run deployment checklist
   - Check database tables exist
   - Verify permissions seeded

4. **Common Issues**
   - See Troubleshooting section in Implementation Guide

---

## 📈 What's Next?

### Immediate Steps
1. ✅ Run setup script
2. ✅ Create standard roles for your organization
3. ✅ Assign roles to staff members
4. ✅ Protect routes with `@RequirePermissions()`
5. ✅ Update UI with permission checks

### Future Enhancements
- Role templates and cloning
- Permission groups
- Row-level permissions
- Role hierarchies
- Time-based role assignments
- Permission analytics

---

## 📝 Files & Locations

### Backend
```
apps/api/
├── prisma/
│   ├── schema.prisma (modified)
│   └── seeds/
│       ├── permissions.seed.ts
│       ├── default-roles.seed.ts
│       └── index.ts
├── src/
│   ├── rbac/ (new module)
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── permissions/
│   │   └── roles/
│   └── auth/ (modified)
└── setup-rbac.ps1
```

### Frontend
```
apps/web/
├── src/
│   ├── app/dashboard/roles/page.tsx
│   └── lib/permissions.ts
```

### Documentation
```
HMS/
├── RBAC_README.md (this file)
├── RBAC_QUICK_START.md
├── RBAC_IMPLEMENTATION_GUIDE.md
├── RBAC_DEPLOYMENT_CHECKLIST.md
└── RBAC_IMPLEMENTATION_COMPLETE.md
```

---

## ✅ Status

**Implementation:** ✅ Complete  
**Testing:** ✅ Verified  
**Documentation:** ✅ Complete  
**Production Ready:** ✅ Yes  
**Breaking Changes:** ❌ None  
**Data Migration:** ❌ Not Required

---

## 🎉 Summary

The RBAC system is **complete and ready for production use**. It provides:

- ✅ Secure, tenant-isolated permission management
- ✅ 100+ pre-defined permissions
- ✅ Easy-to-use role management UI
- ✅ Simple API with decorators
- ✅ Complete backward compatibility
- ✅ Comprehensive documentation
- ✅ Zero data loss
- ✅ Production-grade security

**Get Started:** Run `.\setup-rbac.ps1` in `apps/api` directory

---

**Version:** 1.0.0  
**Last Updated:** January 23, 2025  
**Status:** ✅ Production Ready
