# Quick Fix - Authentication Redirect Issue

## Problem
After logging in, visiting the patients page redirects back to login.

## Root Cause
The login page stores the token as `accessToken`, but the patient page was only checking for `token`.

## Solution Applied ✅
Updated the patient page to check for both `token` and `accessToken`.

---

## Steps to Test

### 1. Clear Browser Storage (Fresh Start)
Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

### 2. Log In
1. Go to: `http://localhost:3000/login`
2. Enter your credentials
3. Click "Sign In"
4. Wait for redirect to dashboard

### 3. Check Authentication (Optional)
In browser console, run:
```javascript
console.log('Token:', localStorage.getItem('accessToken') ? '✅ Found' : '❌ Missing');
console.log('User:', localStorage.getItem('user') ? '✅ Found' : '❌ Missing');
```

Or use the full debug script in `TEST_AUTH.js`

### 4. Visit Patient Management
1. Go to: `http://localhost:3000/dashboard/patients`
2. **Expected Result:** Patient list loads successfully ✅
3. **NOT Expected:** Redirect to login ❌

---

## If Still Having Issues

### Option 1: Check Browser Console
1. Press F12
2. Go to Console tab
3. Look for the message: `🔐 Auth Check:`
4. Check the output:
   - `hasToken: true` ✅ Good
   - `hasToken: false` ❌ Problem - token not saved during login
   - `tokenType: 'accessToken'` ✅ Good - using the right token

### Option 2: Run Full Diagnostics
1. Copy the content from `TEST_AUTH.js`
2. Paste it in browser console
3. Check the output - it will tell you exactly what's wrong

### Option 3: Manual Token Check
In browser console:
```javascript
// Check if tokens exist
console.log('token:', localStorage.getItem('token'));
console.log('accessToken:', localStorage.getItem('accessToken'));
console.log('user:', localStorage.getItem('user'));
```

---

## Common Issues & Solutions

### Issue 1: Token exists but still redirecting
**Check:** Is the token valid?
```javascript
// Test the token
fetch('http://localhost:3001/patients?limit=1', {
  headers: {
    'Authorization': 'Bearer ' + (localStorage.getItem('token') || localStorage.getItem('accessToken')),
  }
})
.then(r => console.log('Status:', r.status))
.catch(e => console.log('Error:', e));
```
- Status 200 ✅ Token is valid
- Status 401 ❌ Token is invalid or expired

**Solution:** Log out and log in again

### Issue 2: Token not being saved during login
**Check:** Is the API returning the token?

In the login page, open Network tab (F12 → Network), then log in and check the `/auth/login` response.

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "user": { ... }
}
```

If missing, the backend login is not working correctly.

### Issue 3: Page flashes and redirects immediately
**Cause:** React useEffect running before localStorage is available

**Solution:** Already fixed! The code now checks `if (typeof window === 'undefined')` to ensure it only runs on client side.

---

## Technical Details

### What Changed

#### Before:
```typescript
const storedToken = localStorage.getItem('token');
```
Only checked for `token` ❌

#### After:
```typescript
const storedToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
```
Checks for both `token` and `accessToken` ✅

### Files Modified:
1. `apps/web/src/app/dashboard/patients/simple-page.tsx`
   - Line 80: Now checks for both token types
   - Line 130-131: Clears both tokens on logout
   - Line 178-179: Clears both tokens on logout

2. `apps/web/src/services/api-client.ts`
   - Already had this fix (line 14)

---

## Verification Checklist

After the fix, verify:

- [ ] ✅ Login page saves `accessToken` to localStorage
- [ ] ✅ Patient page can read `accessToken` from localStorage  
- [ ] ✅ API client sends token in Authorization header
- [ ] ✅ Backend validates the token successfully
- [ ] ✅ Patient list loads without redirecting
- [ ] ✅ Add patient works
- [ ] ✅ Edit patient works
- [ ] ✅ Aadhar number field is visible and optional

---

## Next Steps After Successful Login

1. **Test Add Patient:**
   - Click "Add Patient"
   - Fill only First Name and Last Name
   - Optionally add Aadhar Number
   - Click "Add Patient"
   - **Expected:** Patient created successfully ✅

2. **Test Optional Fields:**
   - Try adding patient with various combinations of fields
   - All should work (no required validation except name)

3. **Test Session Management:**
   - Refresh the page
   - **Expected:** Still logged in, patient list still shows ✅

---

## Need Help?

If you're still having issues, check these in order:

1. **Backend Running?**
   ```
   Check: http://localhost:3001/health
   Expected: {"status":"ok"}
   ```

2. **Frontend Running?**
   ```
   Check: http://localhost:3000
   Expected: Homepage loads
   ```

3. **Database Connected?**
   ```
   Check backend console logs for:
   "📊 Database: Connected via Prisma"
   ```

4. **CORS Working?**
   ```
   Check backend logs for:
   "Origin allowed from list: http://localhost:3000"
   ```

---

## Summary

**The fix is simple:** The patient page now checks for BOTH `token` and `accessToken`, so it doesn't matter which one the login page saves - it will find it! 🎉

Just log in again and it should work perfectly!
