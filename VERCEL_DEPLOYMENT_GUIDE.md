# HMS SaaS Frontend
# HMS Vercel Deployment Guide - UPDATED

## BUILD SUCCESSFUL!

Your HMS frontend has been successfully built and is ready for Vercel deployment!

## **Configuration Ready!**

Your Next.js frontend is now configured and ready for Vercel deployment with:
- **Backend API**: Connected to https://hms-saas-staging.on.render.com
- ✅ **Environment Variables**: Production settings ready
- ✅ **Vercel Config**: Optimized for deployment

## 🎯 **Deploy to Vercel (Multiple Options)**

### **Option 1: Vercel CLI (Recommended)**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy from web directory:**
```bash
cd apps/web
vercel
```

3. **Follow the prompts:**
   - Link to existing project? **N** (for first deployment)
   - Project name: **hms-saas-frontend**
   - Which directory is your code located? **./apps/web**
   - Want to override settings? **Y**
   - Output directory: **.next**
   - Build command: **npm run build**

### **Option 2: GitHub Integration (Automatic)**

1. **Go to** [Vercel Dashboard](https://vercel.com/dashboard)
2. **Click "New Project"**
3. **Import from GitHub** (connect if needed)
4. **Select your repository**: `HMA-SAAS`
5. **Configure project:**
   - **Project Name**: `hms-saas-frontend`
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### **Option 3: Drag & Drop**

1. **Build locally:**
```bash
cd apps/web
npm run build
```

2. **Go to** [Vercel Dashboard](https://vercel.com/dashboard)
3. **Drag the `apps/web` folder** to deploy

## 🔧 **Environment Variables (Auto-Configured)**

The following are already set in your `vercel.json`:

```json
{
  "NEXT_PUBLIC_API_URL": "https://hms-saas-staging.onrender.com",
  "NEXT_PUBLIC_SUPABASE_URL": "https://uoxyyqbwuzjraxhaypko.supabase.co",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "NEXT_PUBLIC_APP_ENV": "production"
}
```

### **Optional: Set Additional Variables in Vercel Dashboard**

For sensitive data, set these in **Vercel Dashboard → Project Settings → Environment Variables**:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_your_production_key
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=123456
```

## 🏗️ **Build Configuration**

Your `vercel.json` is optimized with:

- ✅ **Framework**: Next.js with automatic optimization
- ✅ **Regions**: US East (iad1) for fast global delivery
- ✅ **Security Headers**: X-Frame-Options, XSS Protection, etc.
- ✅ **CORS Headers**: API communication configured
- ✅ **Redirects**: Dashboard routing optimized

## 🔐 **Security Features Enabled**

```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

## 🌐 **Custom Domain (Optional)**

After deployment:

1. **Go to** Vercel Dashboard → Your Project → **Settings** → **Domains**
2. **Add your domain**: `yourdomain.com`
3. **Configure DNS** as instructed
4. **Update CORS_ORIGINS** in your Render backend environment variables

## 🚦 **Post-Deployment Verification**

After deployment, verify:

### 1. **Frontend Access**
- Visit your Vercel URL (e.g., `hms-saas-frontend.vercel.app`)
- Check if the site loads correctly

### 2. **API Connectivity**
- Test login/register functionality
- Verify API calls work (check Network tab in DevTools)
- Confirm backend API is reachable

### 3. **Supabase Integration**
- Test authentication flows
- Verify database operations work

### 4. **Performance**
- Check Lighthouse scores
- Verify mobile responsiveness

## 📊 **Expected Deployment URLs**

- **Frontend**: `https://hms-saas-frontend.vercel.app`
- **Backend API**: `https://hms-saas-staging.onrender.com`
- **Supabase**: `https://uoxyyqbwuzjraxhaypko.supabase.co`

## 🔧 **Troubleshooting**

### **If Build Fails:**
1. Check Node.js version (should be 18+ for Next.js 15)
2. Verify all dependencies are in `package.json`
3. Check build command in Vercel settings

### **If API Calls Fail:**
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check CORS settings on backend
3. Confirm backend is running

### **If Supabase Auth Fails:**
1. Verify Supabase URL and keys
2. Check Supabase project settings
3. Confirm auth configuration

## 🎯 **Next Steps After Deployment**

1. **Update Backend CORS**: Add your Vercel URL to backend CORS origins
2. **Set up Analytics**: Configure Google Analytics, Hotjar, etc.
3. **Configure Monitoring**: Set up error tracking (Sentry)
4. **Custom Domain**: Point your domain to Vercel
5. **SSL Certificate**: Auto-configured by Vercel
6. **CDN Optimization**: Automatic global edge network

## ⚡ **Performance Optimizations Included**

- ✅ **Next.js 15** with App Router
- ✅ **Turbopack** for faster builds
- ✅ **Automatic Image Optimization**
- ✅ **Static Generation** where possible
- ✅ **Edge Runtime** optimized
- ✅ **Bundle Splitting** automatic

**Your HMS SaaS frontend is now ready for production deployment on Vercel! 🎉**