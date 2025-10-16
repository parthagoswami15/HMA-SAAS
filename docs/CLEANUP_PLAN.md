# HMS Project Cleanup & Refactoring Plan

## 🎯 **PRODUCTION-READY TRANSFORMATION**

### **Phase 1: Immediate Cleanup (Priority: CRITICAL)**

#### **1.1 Remove Excessive Documentation**
- **Issue**: 74+ markdown files cluttering root directory
- **Action**: Move to `/docs` folder, keep only essential ones in root
- **Files to Keep in Root**: `README.md`, `SETUP_GUIDE.md`, `DEPLOYMENT.md`

#### **1.2 Remove Unused Dependencies**
**Frontend Cleanup:**
```bash
npm uninstall @emotion/react @mantine/carousel @mantine/dropzone @mantine/form @mantine/spotlight @mantine/tiptap @tanstack/react-query @tiptap/pm @tiptap/react @tiptap/starter-kit
```

**Backend Cleanup:**
```bash
npm uninstall @nestjs/event-emitter @nestjs/schedule @nestjs/serve-static @sendgrid/mail @types/cookie-parser cookie-parser exceljs helmet jsonwebtoken moment node-cron pdfkit razorpay stripe swagger-ui-express twilio uuid
```

#### **1.3 Fix Critical TypeScript Issues**
- Add missing imports (`SimpleGrid`, `DatePicker`)
- Replace `any` types with proper interfaces
- Fix React HTML entity issues
- Add proper type definitions

### **Phase 2: Code Structure Optimization**

#### **2.1 Standardize Folder Structure**

**Current Issues:**
- Inconsistent component organization
- Mixed concerns in directories
- No clear separation of utilities/services

**New Structure:**
```
apps/
├── web/
│   ├── src/
│   │   ├── app/                    # Next.js app router
│   │   │   ├── (auth)/            # Auth route group
│   │   │   ├── (dashboard)/       # Dashboard route group
│   │   │   └── globals.css
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ui/               # Base UI components
│   │   │   ├── forms/            # Form components
│   │   │   └── shared/           # Shared components
│   │   ├── hooks/                # Custom hooks
│   │   ├── lib/                  # Utilities and config
│   │   │   ├── utils.ts
│   │   │   ├── constants.ts
│   │   │   └── validations.ts
│   │   ├── services/             # API calls
│   │   ├── stores/               # State management
│   │   ├── types/                # TypeScript definitions
│   │   └── styles/               # Global styles
│   └── package.json
└── api/
    ├── src/
    │   ├── common/               # Shared utilities
    │   │   ├── decorators/
    │   │   ├── filters/
    │   │   ├── guards/
    │   │   ├── interceptors/
    │   │   └── pipes/
    │   ├── config/               # Configuration
    │   ├── database/             # Database related
    │   │   ├── migrations/
    │   │   └── seeds/
    │   ├── modules/              # Feature modules
    │   │   ├── auth/
    │   │   ├── users/
    │   │   ├── patients/
    │   │   └── ...
    │   └── main.ts
    └── package.json
```

### **Phase 3: Architecture Improvements**

#### **3.1 Frontend Architecture**
- **State Management**: Consolidate Zustand stores
- **API Layer**: Implement proper error handling and loading states
- **Component Architecture**: Create atomic design system
- **Routing**: Organize with Next.js route groups

#### **3.2 Backend Architecture**
- **Module Structure**: Proper NestJS module organization
- **Database**: Optimize Prisma schema and queries
- **Authentication**: Secure JWT implementation
- **Error Handling**: Global exception filters
- **Validation**: Proper DTO validation

### **Phase 4: Production Readiness**

#### **4.1 Performance Optimization**
- **Code Splitting**: Implement proper lazy loading
- **Bundle Analysis**: Optimize dependencies
- **Database**: Add proper indexing
- **Caching**: Implement Redis caching

#### **4.2 Security Hardening**
- **Input Validation**: Comprehensive validation
- **Authentication**: Secure session management
- **Authorization**: Role-based access control
- **Environment**: Secure environment variables

#### **4.3 Monitoring & Observability**
- **Logging**: Structured logging
- **Error Tracking**: Error monitoring
- **Performance**: Performance monitoring
- **Health Checks**: Application health endpoints

### **Estimated Timeline**
- **Phase 1**: 2-3 days (Immediate cleanup)
- **Phase 2**: 3-4 days (Structure optimization)
- **Phase 3**: 5-7 days (Architecture improvements)
- **Phase 4**: 3-5 days (Production readiness)

### **Risk Assessment**
- **Low Risk**: Dependency cleanup, documentation organization
- **Medium Risk**: Folder restructuring, import path updates
- **High Risk**: Major architecture changes, database modifications

### **Success Metrics**
- ✅ Zero unused dependencies
- ✅ <50 TypeScript errors (from 1000+)
- ✅ Clean folder structure
- ✅ Production-ready deployment
- ✅ Comprehensive documentation