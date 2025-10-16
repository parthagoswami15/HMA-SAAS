# Authentication Debug Guide

## Issue: "Unauthorized" Error When Adding Patient

This error means you're not currently logged in or your token has expired.

## Quick Fix - Check Authentication Status

### Option 1: Check in Browser Console

1. Open your browser (where the HMS app is running)
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Type the following commands:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User:', localStorage.getItem('user'));
```

### Option 2: Login Again

If no token is found, you need to log in:

1. Go to the login page: `http://localhost:3000/auth/login` (or your frontend URL)
2. Log in with your credentials
3. After successful login, try adding a patient again

### Option 3: Test API Directly

Test if your API is working by running this in the browser console:

```javascript
fetch('http://localhost:3001/patients', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

## Common Solutions

### Solution 1: Re-login
The most common fix is simply logging out and logging back in.

### Solution 2: Check API Server
Make sure your API server is running:
```bash
# In apps/api directory
npm run dev
```

### Solution 3: Check Token in Browser
1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Local Storage**
4. Look for your domain (e.g., `http://localhost:3000`)
5. Check if `token` or `accessToken` exists
6. If not, you need to log in

### Solution 4: Clear Storage and Re-login
If the token is corrupted:

1. Open Developer Tools (F12)
2. Go to **Application** tab → **Local Storage**
3. Right-click on your domain → **Clear**
4. Refresh the page
5. Log in again

## Testing After Login

After logging in successfully, test the patient creation:

1. Go to Patient Management page
2. Click "Add Patient"
3. Fill in at least:
   - First Name
   - Last Name
4. Optionally fill Aadhar Number
5. Click "Add Patient"

## Expected Behavior

✅ **Success:** Patient is created and added to the list
❌ **Unauthorized:** Token is missing or invalid - need to re-login
❌ **Validation Error:** Check that required fields are filled

## API Endpoints Status

To verify your API is working:

**Check Health:**
```
GET http://localhost:3001/health
```

**Login Endpoint:**
```
POST http://localhost:3001/auth/login
```

**Patients Endpoint (requires auth):**
```
GET http://localhost:3001/patients
Headers: Authorization: Bearer <your-token>
```

## Need a Test User?

If you don't have login credentials, you may need to:
1. Check your user seeding/migration scripts
2. Create a user directly in the database
3. Or use the registration endpoint if available

## Troubleshooting Checklist

- [ ] Backend API is running (`npm run dev` in apps/api)
- [ ] Frontend is running (`npm run dev` in apps/web)
- [ ] You are logged in (check localStorage for token)
- [ ] Token has not expired
- [ ] API URL is correct (check NEXT_PUBLIC_API_URL in .env)
- [ ] No CORS errors in browser console
- [ ] Database connection is working

## Quick Test Commands

Run these in your browser console after logging in:

```javascript
// 1. Check auth state
console.log('Logged in:', !!localStorage.getItem('token'));

// 2. Test creating a patient
fetch('http://localhost:3001/patients', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'Patient',
    gender: 'MALE',
    aadharNumber: '123456789012'
  })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```
