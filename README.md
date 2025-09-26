# HMS SaaS - Complete Multi-Tenant Hospital Management System

A comprehensive, scalable SaaS-based Hospital Management System designed for multi-tenancy, security, and modularity. Supports hospitals, labs, pharmacies, and private chambers with complete isolation and role-based access control.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript, TailwindCSS, and Shadcn/UI
- **Backend**: NestJS with TypeScript, Prisma ORM, PostgreSQL
- **Database**: PostgreSQL with shared-schema multi-tenancy (tenantId partitioning)
- **Authentication**: JWT-based with comprehensive RBAC
- **Payments**: Razorpay integration for subscription billing
- **File Storage**: Support for medical reports and prescriptions

## 🚀 Features

### Multi-Tenant Architecture
- **Complete Data Isolation**: Shared schema with tenantId partitioning
- **Tenant Middleware**: Automatic tenant context injection
- **Scalable Design**: Supports unlimited hospitals/clinics/labs

### Role-Based Access Control (RBAC)
- **Owner**: Super admin managing the entire SaaS platform
- **Hospital Admin**: Manages specific hospital/clinic/lab/pharmacy
- **Healthcare Staff**: Doctors, Nurses, Pharmacists, Receptionists, Lab Technicians
- **Patients**: Access to personal records, appointments, and billing

### Core Modules

#### 🏥 Hospital Management
- **Patient Registration**: Complete patient demographics and medical history
- **OPD/IPD Management**: Outpatient and inpatient department workflows
- **Room Allocation**: Bed management and room assignments
- **Doctor Scheduling**: Appointment scheduling and availability management
- **Emergency Department**: Triage system with priority-based case management

#### 🔬 Laboratory Module
- **Test Management**: Comprehensive lab test catalog
- **Sample Tracking**: Barcode-based sample tracking system
- **Result Management**: Digital result entry and verification
- **EHR Integration**: Seamless integration with electronic health records
- **Quality Control**: Result verification and audit trails

#### 💊 Pharmacy Module
- **Inventory Management**: Real-time stock tracking with low-stock alerts
- **Prescription Management**: Digital prescription processing
- **Expiry Tracking**: Automated expiry date monitoring
- **Sales Analytics**: Top-selling items and revenue reports

#### 🏠 Private Chambers
- **Independent Practice**: Doctors can manage their private chambers
- **Appointment Booking**: Online appointment scheduling
- **Payment Integration**: Direct payment processing
- **Working Hours**: Flexible schedule management

#### 💰 Billing & Insurance
- **Invoice Generation**: Automated billing for services
- **Insurance Claims**: Third-party payer integration
- **Payment Tracking**: Comprehensive payment history
- **Revenue Reports**: Financial analytics and reporting

#### 📊 Analytics & Reporting
- **Hospital Dashboards**: Real-time performance metrics
- **Patient Statistics**: Demographic and health analytics
- **Revenue Reports**: Financial performance tracking
- **Operational Metrics**: Efficiency and utilization reports

#### 🔔 Notifications
- **Multi-Channel**: SMS, Email, and WhatsApp integration
- **Automated Reminders**: Appointment and medication reminders
- **Emergency Alerts**: Critical patient notifications
- **System Notifications**: Platform updates and announcements

#### 🔒 Compliance & Security
- **Audit Logging**: Complete activity tracking for HIPAA/GDPR compliance
- **Data Encryption**: End-to-end encryption for sensitive data
- **Access Controls**: Granular permission management
- **Backup & Recovery**: Automated data backup systems

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd hms-saas
npm install
```

### 2. Environment Configuration

**Backend (.env in apps/api/)**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hms_saas?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1d"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

**Frontend (.env.local in apps/web/)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Database Setup
```bash
# Generate Prisma client
npm --workspace api exec prisma generate

# Run database migrations
npm --workspace api exec prisma migrate dev --name init

# Seed initial data (optional)
npm --workspace api exec prisma db seed
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:web    # Frontend at http://localhost:3000
npm run dev:api    # Backend at http://localhost:3001
```

## 📁 Project Structure

```
hms-saas/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/          # Authentication & Authorization
│   │   │   ├── audit/         # Audit logging for compliance
│   │   │   ├── billing/       # Billing & Insurance
│   │   │   ├── chambers/      # Private chambers management
│   │   │   ├── common/        # Shared guards, decorators, middleware
│   │   │   ├── dashboards/    # Analytics & reporting
│   │   │   ├── emergency/     # Emergency department
│   │   │   ├── lab/           # Laboratory management
│   │   │   ├── notifications/ # Multi-channel notifications
│   │   │   ├── patients/      # Patient management
│   │   │   ├── payments/      # Subscription & payment processing
│   │   │   ├── pharmacy/      # Pharmacy & inventory
│   │   │   ├── scheduling/    # Appointment scheduling
│   │   │   ├── tenants/       # Multi-tenant management
│   │   │   └── prisma/        # Database configuration
│   │   └── prisma/
│   │       └── schema.prisma  # Database schema
│   └── web/                   # Next.js Frontend
│       ├── app/               # App router pages
│       │   ├── dashboard/     # Main dashboard
│       │   ├── patients/      # Patient management UI
│       │   ├── lab/           # Laboratory UI
│       │   ├── pharmacy/      # Pharmacy UI
│       │   ├── chambers/      # Private chambers UI
│       │   ├── emergency/     # Emergency department UI
│       │   ├── billing/       # Billing UI
│       │   └── admin/         # Admin panel
│       └── components/        # Reusable UI components
└── docs/                      # Documentation
```

## 🔐 Security Features

### Data Protection
- **Encryption at Rest**: Database encryption for sensitive data
- **Encryption in Transit**: HTTPS/TLS for all communications
- **Field-Level Encryption**: Additional encryption for PII/PHI data

### Access Control
- **Multi-Factor Authentication**: Optional 2FA for enhanced security
- **Session Management**: Secure JWT token handling
- **IP Whitelisting**: Restrict access by IP address
- **Rate Limiting**: API rate limiting to prevent abuse

### Compliance
- **HIPAA Compliance**: Healthcare data protection standards
- **GDPR Compliance**: European data protection regulations
- **Audit Trails**: Complete activity logging
- **Data Retention**: Configurable data retention policies

## 🌐 Multi-Language & Multi-Currency

### Internationalization
- **Language Support**: English, Spanish, French, German, Hindi
- **RTL Support**: Right-to-left language support
- **Localized Content**: Region-specific content and formats

### Currency Support
- **Multiple Currencies**: USD, EUR, GBP, INR, and more
- **Exchange Rates**: Real-time currency conversion
- **Regional Pricing**: Location-based pricing strategies

## 📈 Scalability & Performance

### Infrastructure
- **Horizontal Scaling**: Support for multiple server instances
- **Database Optimization**: Indexed queries and connection pooling
- **Caching Strategy**: Redis caching for improved performance
- **CDN Integration**: Static asset delivery optimization

### Monitoring
- **Health Checks**: Automated system health monitoring
- **Performance Metrics**: Real-time performance tracking
- **Error Tracking**: Comprehensive error logging and alerts
- **Uptime Monitoring**: 24/7 system availability monitoring

## 🚀 Deployment

### Production Deployment
```bash
# Build applications
npm run build

# Start production servers
npm run start
```

### Docker Deployment
```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d
```

### Cloud Deployment
- **AWS**: ECS, RDS, ElastiCache
- **Google Cloud**: Cloud Run, Cloud SQL, Memorystore
- **Azure**: Container Instances, Azure Database, Redis Cache

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Core Module Endpoints
- **Patients**: `/patients/*` - Patient management
- **Laboratory**: `/lab/*` - Lab tests, samples, results
- **Pharmacy**: `/pharmacy/*` - Inventory, prescriptions
- **Chambers**: `/chambers/*` - Private chamber management
- **Emergency**: `/emergency/*` - Emergency department
- **Billing**: `/billing/*` - Invoices, insurance claims
- **Audit**: `/audit/*` - Audit logs and compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Create an issue on GitHub
- **Email**: support@hms-saas.com

## 🎯 Roadmap

### Phase 1 (Completed)
- ✅ Multi-tenant architecture
- ✅ Core hospital management modules
- ✅ Authentication & authorization
- ✅ Basic frontend interface

### Phase 2 (In Progress)
- 🔄 Advanced analytics and reporting
- 🔄 Mobile application
- 🔄 Telemedicine integration
- 🔄 AI-powered diagnostics

### Phase 3 (Planned)
- 📋 IoT device integration
- 📋 Blockchain for medical records
- 📋 Advanced ML/AI features
- 📋 Global expansion features

---

**Built with ❤️ for healthcare professionals worldwide**
