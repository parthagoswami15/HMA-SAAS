// Run this in your browser console to debug authentication issues
// Press F12 → Console tab → Copy and paste this code

console.log('\n🔐 === AUTHENTICATION DEBUG INFO ===\n');

// Check for tokens
const token = localStorage.getItem('token');
const accessToken = localStorage.getItem('accessToken');
const user = localStorage.getItem('user');

console.log('📝 Token Check:');
console.log('  - token:', token ? `✅ Found (${token.length} chars)` : '❌ Not found');
console.log('  - accessToken:', accessToken ? `✅ Found (${accessToken.length} chars)` : '❌ Not found');
console.log('  - user:', user ? '✅ Found' : '❌ Not found');

// Show actual token (first 50 chars for security)
if (token) {
  console.log('\n🎫 Token Preview (first 50 chars):');
  console.log('  ', token.substring(0, 50) + '...');
}
if (accessToken) {
  console.log('\n🎫 AccessToken Preview (first 50 chars):');
  console.log('  ', accessToken.substring(0, 50) + '...');
}

// Show user info
if (user) {
  try {
    const userObj = JSON.parse(user);
    console.log('\n👤 User Info:');
    console.log('  - Email:', userObj.email || 'N/A');
    console.log('  - Name:', `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim() || 'N/A');
    console.log('  - Role:', userObj.role || 'N/A');
    console.log('  - Tenant ID:', userObj.tenantId || 'N/A');
  } catch (e) {
    console.log('\n⚠️ User data exists but cannot be parsed');
  }
}

// Test API connectivity
console.log('\n🌐 Testing API Connection...');
const apiUrl = 'http://localhost:3001';

fetch(`${apiUrl}/health`)
  .then(r => r.json())
  .then(data => {
    console.log('✅ API Health Check:', data);
  })
  .catch(err => {
    console.log('❌ API Health Check Failed:', err.message);
  });

// Test authenticated endpoint
const authToken = token || accessToken;
if (authToken) {
  console.log('\n🔒 Testing Authenticated Endpoint...');
  fetch(`${apiUrl}/patients?limit=1`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  })
    .then(r => {
      console.log('Status:', r.status, r.statusText);
      return r.json();
    })
    .then(data => {
      if (data.success) {
        console.log('✅ Patient API Working!');
        console.log('   Total Patients:', data.data?.pagination?.total || 0);
      } else {
        console.log('⚠️ API Response:', data);
      }
    })
    .catch(err => {
      console.log('❌ Authenticated Request Failed:', err.message);
    });
} else {
  console.log('\n❌ Cannot test authenticated endpoint - no token found');
  console.log('👉 Please log in first at: http://localhost:3000/login');
}

console.log('\n=== END DEBUG INFO ===\n');

// Summary
console.log('📊 SUMMARY:');
if (authToken && user) {
  console.log('✅ You are logged in');
  console.log('✅ You should be able to access patient management');
} else if (!authToken) {
  console.log('❌ No authentication token found');
  console.log('👉 Please log in at: http://localhost:3000/login');
} else if (!user) {
  console.log('⚠️ Token found but no user data');
  console.log('👉 Try logging in again');
}
