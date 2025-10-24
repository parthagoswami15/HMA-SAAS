# 🇮🇳 Razorpay Integration Guide - UPI & Indian Payments

## ✅ What's Been Implemented

### **1. Razorpay Service** ✅
Complete Razorpay SDK integration with:
- ✅ Order creation
- ✅ Subscription management
- ✅ Payment verification
- ✅ Customer management
- ✅ Refund processing
- ✅ Payment links
- ✅ Webhook signature verification

### **2. Payment Gateway Service** ✅
Unified payment interface supporting:
- ✅ Stripe (International payments)
- ✅ Razorpay (UPI, Cards, NetBanking, Wallets)
- ✅ Automatic gateway selection
- ✅ Multi-currency support

### **3. Webhook Handlers** ✅
- ✅ Razorpay webhook controller
- ✅ Stripe webhook controller
- ✅ Automatic subscription status updates
- ✅ Payment verification

### **4. Payment Controller** ✅
New API endpoints for:
- ✅ Get available payment gateways
- ✅ Create payment orders
- ✅ Verify payments
- ✅ Get payment details

---

## 🚀 Setup Instructions

### Step 1: Stop Backend Server
```bash
# Press Ctrl+C in the terminal
```

### Step 2: Install Required Packages
```bash
cd apps/api

# Install Razorpay SDK
npm install razorpay

# Install Stripe SDK (if not already installed)
npm install stripe

# Regenerate Prisma Client
npx prisma generate
```

### Step 3: Configure Razorpay

1. **Get Razorpay API Keys:**
   - Go to https://dashboard.razorpay.com/app/keys
   - Copy your **Key ID** and **Key Secret**

2. **Add to `.env` file:**
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

3. **Setup Webhook (Optional but Recommended):**
   - Go to https://dashboard.razorpay.com/app/webhooks
   - Add webhook URL: `https://yourdomain.com/webhooks/razorpay`
   - Select events: `payment.captured`, `subscription.*`, `order.paid`
   - Copy the webhook secret and add to `.env`

### Step 4: Restart Backend
```bash
npm run start:dev
```

---

## 📊 Available Payment Methods

### **Razorpay (India)** 🇮🇳
- ✅ **UPI** - Google Pay, PhonePe, Paytm, BHIM
- ✅ **Cards** - Debit/Credit cards
- ✅ **NetBanking** - All major banks
- ✅ **Wallets** - Paytm, PhonePe, Mobikwik, etc.
- ✅ **EMI** - No-cost EMI options
- ✅ **Cardless EMI** - Bajaj Finserv, ZestMoney

### **Stripe (International)** 🌍
- ✅ **Cards** - Visa, Mastercard, Amex
- ✅ **Wallets** - Apple Pay, Google Pay
- ✅ **Bank Transfers**

---

## 🎯 API Endpoints

### **Get Available Payment Gateways**
```http
GET /payments/gateways
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "gateways": ["razorpay", "stripe"],
    "default": "razorpay",
    "supported": {
      "razorpay": {
        "available": true,
        "methods": ["upi", "card", "netbanking", "wallet"],
        "currencies": ["INR"]
      },
      "stripe": {
        "available": true,
        "methods": ["card", "wallet"],
        "currencies": ["USD", "EUR", "GBP", "INR"]
      }
    }
  }
}
```

### **Create Payment Order**
```http
POST /payments/create-order
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "gateway": "razorpay",
  "amount": 999,
  "currency": "INR",
  "planId": "plan_basic",
  "metadata": {
    "description": "Basic Plan Subscription"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "gateway": "razorpay",
    "orderId": "order_xyz123",
    "amount": 999,
    "currency": "INR",
    "keyId": "rzp_test_xxx"
  }
}
```

### **Verify Payment**
```http
POST /payments/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "gateway": "razorpay",
  "orderId": "order_xyz123",
  "paymentId": "pay_abc456",
  "signature": "signature_hash"
}
```

---

## 💻 Frontend Integration Examples

### **React/Next.js - Razorpay Checkout**

```typescript
// Install Razorpay SDK
// npm install razorpay

import { useEffect } from 'react';

function PaymentButton() {
  const handlePayment = async () => {
    // 1. Create order from backend
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gateway: 'razorpay',
        amount: 999,
        currency: 'INR',
        planId: 'plan_basic'
      })
    });

    const { data } = await response.json();

    // 2. Initialize Razorpay Checkout
    const options = {
      key: data.keyId,
      amount: data.amount * 100, // Amount in paise
      currency: data.currency,
      name: 'Hospital Management System',
      description: 'Subscription Payment',
      order_id: data.orderId,
      handler: async function (response) {
        // 3. Verify payment on backend
        const verifyResponse = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gateway: 'razorpay',
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          })
        });

        if (verifyResponse.ok) {
          alert('Payment successful!');
          // Redirect to success page
        }
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <button onClick={handlePayment}>
      Pay with Razorpay
    </button>
  );
}
```

### **UPI Payment Flow**

```typescript
// User selects UPI as payment method
const handleUPIPayment = async () => {
  const order = await createPaymentOrder('razorpay', 999, 'INR');
  
  // Razorpay will show UPI options:
  // - Google Pay
  // - PhonePe
  // - Paytm
  // - BHIM
  // - Or enter UPI ID manually
  
  const rzp = new Razorpay({
    ...order,
    method: {
      upi: true
    }
  });
  
  rzp.open();
};
```

---

## 🔒 Security Features

### **Payment Verification**
- ✅ HMAC SHA256 signature verification
- ✅ Webhook signature validation
- ✅ Order ID validation
- ✅ Amount verification

### **Webhook Security**
- ✅ Signature verification for all webhooks
- ✅ Automatic subscription status updates
- ✅ Payment reconciliation

---

## 📱 Supported Payment Flows

### **1. One-Time Payment**
```
User → Select Plan → Create Order → Pay → Verify → Activate Subscription
```

### **2. Recurring Subscription**
```
User → Select Plan → Create Razorpay Subscription → Auto-charge monthly/yearly
```

### **3. UPI AutoPay**
```
User → Setup UPI AutoPay → Automatic recurring payments via UPI
```

---

## 🎨 Features

### **Razorpay Features** ✅
- ✅ Multiple payment methods
- ✅ UPI support (Google Pay, PhonePe, etc.)
- ✅ Instant payment verification
- ✅ Automatic retries for failed payments
- ✅ Payment links for invoices
- ✅ Refund processing
- ✅ Customer management
- ✅ Subscription management

### **Multi-Gateway Support** ✅
- ✅ Automatic gateway selection based on currency
- ✅ Fallback to alternative gateway
- ✅ Unified payment interface
- ✅ Gateway-specific features

---

## 🔧 Testing

### **Razorpay Test Cards**
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### **Test UPI IDs**
```
success@razorpay
failure@razorpay
```

### **Test Mode**
- Use `rzp_test_` keys for testing
- No real money is charged
- All test payments are automatically captured

---

## 📊 Webhook Events Handled

### **Razorpay Webhooks**
- ✅ `payment.captured` - Payment successful
- ✅ `payment.failed` - Payment failed
- ✅ `subscription.activated` - Subscription started
- ✅ `subscription.charged` - Recurring payment
- ✅ `subscription.cancelled` - Subscription cancelled
- ✅ `subscription.completed` - Subscription ended
- ✅ `subscription.paused` - Subscription paused
- ✅ `subscription.resumed` - Subscription resumed
- ✅ `order.paid` - Order payment completed

---

## 🎯 Next Steps

1. **Stop the backend server**
2. **Run:** `npm install razorpay stripe && npx prisma generate`
3. **Add Razorpay keys to `.env`**
4. **Restart backend**
5. **Test payment flow**

---

## 🎉 Summary

You now have a **complete dual payment gateway system** with:
- ✅ Razorpay for UPI and Indian payments
- ✅ Stripe for international payments
- ✅ Automatic gateway selection
- ✅ Webhook handling
- ✅ Payment verification
- ✅ Subscription management

**Your Hospital Management System now supports UPI payments!** 🚀🇮🇳
