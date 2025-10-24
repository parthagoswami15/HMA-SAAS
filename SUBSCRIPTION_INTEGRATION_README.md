# 🚀 HMS Subscription System - Complete Integration Guide

## 📋 Overview

This guide provides complete instructions for integrating the subscription system into your HMS SaaS application. The system includes subscription management, billing, usage tracking, and payment processing via Stripe.

## 🏗️ Architecture

```
Frontend (Next.js + Mantine) ←→ Backend (NestJS) ←→ Database (PostgreSQL + Prisma)
                                    ↓
                                Stripe API
```

## 📦 What's Included

### ✅ Backend Components
- **Subscription Module** - Complete CRUD operations
- **Stripe Integration** - Payment processing & webhooks
- **Database Schema** - Plans, subscriptions, invoices
- **Authentication** - JWT-based tenant isolation
- **Usage Tracking** - Real-time limit monitoring

### ✅ Frontend Components
- **Subscription Page** - Clean, responsive UI
- **Usage Dashboard** - Visual progress indicators
- **Plan Selection** - Interactive plan comparison
- **Billing History** - Invoice management
- **Empty States** - Professional no-data messaging

## 🚀 Quick Setup

### 1. Environment Setup

Add these variables to `apps/api/.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database (already configured)
DATABASE_URL=postgresql://user:pass@localhost:5432/hms_db

# JWT (already configured)
JWT_ACCESS_TOKEN_SECRET=your_jwt_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
```

### 2. Database Setup

```bash
# Generate Prisma client
cd apps/api
npx prisma generate

# Push schema to database
npx prisma db push

# Seed subscription plans
npx ts-node prisma/seed-subscriptions.ts
```

### 3. Start Services

```bash
# Terminal 1: Backend
cd apps/api
npm run start:dev

# Terminal 2: Frontend
cd apps/web
npm run dev
```

## 🔌 API Endpoints

### Subscription Management
```
GET    /subscription/current     - Get current subscription
GET    /subscription/usage       - Get usage statistics
GET    /subscription/plans       - Get available plans
POST   /subscription             - Create new subscription
PUT    /subscription/:id         - Update subscription
DELETE /subscription/:id         - Cancel subscription
```

### Billing & Invoices
```
GET    /subscription/invoices    - Get billing history
GET    /subscription/invoices/:id - Get specific invoice
POST   /subscription/invoices    - Create invoice (admin)
```

### Usage & Limits
```
GET    /subscription/limits      - Get subscription limits
GET    /subscription/check/:feature - Check feature access
```

## 💳 Stripe Integration

### 1. Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account or login
3. Get API keys from Developers → API keys

### 2. Configure Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/subscription/webhooks`
3. Select events: `customer.subscription.created`, `customer.subscription.updated`, `invoice.payment_succeeded`

### 3. Test Cards for Development
- **Success**: 4242424242424242 (any CVV, future expiry)
- **Decline**: 4000000000000002

## 🎨 Frontend Integration

### Real API Usage

The frontend now fetches real data from your backend:

```typescript
// Fetch current subscription
const response = await fetch('/api/subscription/current', {
  credentials: 'include',
});
const subscription = await response.json();

// Fetch usage statistics
const usageResponse = await fetch('/api/subscription/usage', {
  credentials: 'include',
});
const usage = await usageResponse.json();
```

### Error Handling

Built-in error handling with user-friendly messages:

```typescript
try {
  const response = await fetch('/api/subscription/current');
  if (!response.ok) throw new Error('Failed to load subscription');
  const data = await response.json();
} catch (error) {
  // Shows error notification to user
  notifications.show({
    title: 'Error',
    message: 'Failed to load subscription data',
    color: 'red',
  });
}
```

## 📊 Database Schema

### Subscription Plans
```sql
CREATE TABLE SubscriptionPlan (
  id              STRING PRIMARY KEY,
  name            STRING UNIQUE,
  displayName     STRING,
  price           FLOAT,
  userLimit       INT,
  patientLimit    INT,
  storageLimit    INT,
  features        STRING[],
  isActive        BOOLEAN,
  tenantId        STRING
);
```

### Subscriptions
```sql
CREATE TABLE Subscription (
  id              STRING PRIMARY KEY,
  tenantId        STRING,
  planId          STRING,
  status          ENUM('ACTIVE', 'CANCELLED', 'SUSPENDED'),
  startDate       DATETIME,
  endDate         DATETIME,
  stripeSubscriptionId STRING,
  stripeCustomerId STRING
);
```

## 🔐 Security Features

### Authentication
- JWT-based authentication required for all endpoints
- Tenant isolation ensures data privacy
- Role-based access control

### Stripe Security
- Webhook signature verification
- Secure API key storage
- PCI compliance through Stripe

## 🧪 Testing

### 1. Manual Testing

1. **Create Subscription**
   ```bash
   POST /subscription
   {
     "planId": "plan-id-from-database",
     "billingCycle": "monthly"
   }
   ```

2. **Check Usage**
   ```bash
   GET /subscription/usage
   # Returns current usage vs limits
   ```

3. **View Invoices**
   ```bash
   GET /subscription/invoices
   # Shows billing history
   ```

### 2. Stripe Testing

1. **Test Webhooks**
   ```bash
   stripe listen --forward-to localhost:3001/subscription/webhooks
   ```

2. **Create Test Customer**
   ```bash
   stripe customers create --email test@example.com
   ```

## 🚨 Common Issues & Solutions

### Issue: "No subscription found"
**Solution**: Ensure tenant has active subscription in database

### Issue: "Stripe payment failed"
**Solution**: Check Stripe dashboard for detailed error logs

### Issue: "Usage limits exceeded"
**Solution**: Upgrade subscription plan or wait for billing cycle reset

### Issue: "API connection failed"
**Solution**: Verify backend is running and API URL is correct

## 🔄 Migration from Mock Data

### What Was Removed
- ❌ Hardcoded subscription data
- ❌ Fake usage statistics
- ❌ Mock invoice history
- ❌ Static plan definitions

### What Was Added
- ✅ Real API endpoints
- ✅ Database schema
- ✅ Stripe integration
- ✅ Dynamic data loading
- ✅ Error handling
- ✅ Loading states

## 🎯 Production Deployment

### 1. Environment Variables
```env
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
DATABASE_URL=postgresql://...
```

### 2. Database Migration
```bash
npx prisma migrate deploy
npx prisma db seed
```

### 3. SSL & Security
- Enable HTTPS for webhook endpoints
- Configure CORS properly
- Set up rate limiting

## 📞 Support

For issues or questions:
1. Check Stripe dashboard for payment errors
2. Review application logs
3. Verify database connections
4. Test API endpoints manually

---

**🎉 Your subscription system is now fully integrated and ready for production!**
