# Local Testing Instructions

## 🚀 Start Backend (Terminal 1)
```bash
cd "E:\OURHMS\HMA-SAAS\apps\api"
npm run start:dev
```

## 🌐 Start Frontend (Terminal 2)
```bash
cd "E:\OURHMS\HMA-SAAS\apps\web"
npm run dev
```

## 🧪 Testing Steps

### 1. Test Signup Flow
- Go to http://localhost:3001/signup
- Fill out the form with test data:
  - Organization Type: Hospital/Clinic/Private Practice
  - Organization Name: Test Hospital
  - Address: 123 Test Street, City, Country
  - Phone: +1234567890
  - Email: test@hospital.com
  - Admin First Name: John
  - Admin Last Name: Doe
  - Admin Email: admin@testhospital.com
  - Admin Phone: +1234567891
  - Admin Password: testpassword123
  - Confirm Password: testpassword123
  - ✅ Agree to terms
- Click "Create Account"
- Should show success message and redirect to login

### 2. Test Login Flow
- Go to http://localhost:3001/login (or wait for redirect)
- Enter the credentials you used for signup:
  - Email: admin@testhospital.com
  - Password: testpassword123
- Click "Sign In"
- Should show success message and redirect to dashboard

### 3. Expected Results
- ✅ No connection errors
- ✅ Successful account creation
- ✅ Successful login with created account
- ✅ JWT token stored in localStorage
- ✅ User redirected to appropriate pages

### 4. Check Browser Console
- Open Developer Tools (F12)
- Check Console tab for any errors
- Check Network tab to see API requests

### 5. Verify Database
- Check that new user and tenant were created in Supabase

## 🐛 If Issues Occur
1. Check both terminals for error messages
2. Verify both servers are running on correct ports
3. Check browser console for JavaScript errors
4. Check Network tab in DevTools for failed requests
5. Ensure .env.local files are properly configured

## 📝 Notes
- Backend runs on port 10000
- Frontend runs on port 3001  
- Database uses Supabase session pooler
- CORS is configured for localhost:3001