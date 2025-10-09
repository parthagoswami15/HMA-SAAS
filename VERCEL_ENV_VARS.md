# Vercel Environment Variables

Add these environment variables in your Vercel dashboard:

## Frontend Environment Variables:
```
NEXT_PUBLIC_API_URL=https://hms-saas-staging.onrender.com
NEXT_PUBLIC_APP_NAME=HMS SAAS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## How to add in Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://hms-saas-staging.onrender.com`
   - Environment: Production, Preview, Development
4. Repeat for other variables
5. Redeploy your application after adding environment variables

## Notes:
- The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js
- Make sure to redeploy after adding environment variables
- The backend URL should match your Render deployment URL