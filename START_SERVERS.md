# HMS SAAS - Server Startup Guide

## 🚀 Quick Start

### Option 1: Automatic Startup (Recommended)

Run the PowerShell script:
```powershell
.\start-servers.ps1
```

### Option 2: Manual Startup

#### 1. Start Backend Server (Port 3001)
```bash
cd apps/api
npm run start:dev
```

Wait for message: `Application is running on: http://localhost:3001`

#### 2. Start Frontend Server (Port 3000)
```bash
cd apps/web
npm run dev
```

Wait for message: `Ready in X.Xs` and `Local: http://localhost:3000`

---

## ✅ Verify Servers Are Running

### Check Ports:
```powershell
netstat -ano | findstr "3000 3001"
```

Expected output:
```
TCP    0.0.0.0:3000    ...    LISTENING    <PID>
TCP    0.0.0.0:3001    ...    LISTENING    <PID>
```

### Test Backend:
```powershell
curl http://localhost:3001
```

### Test Frontend:
```powershell
curl http://localhost:3000
```

---

## 🔧 Troubleshooting

### Problem: Port Already in Use

#### Kill Process on Port 3000:
```powershell
# Find PID
netstat -ano | findstr :3000

# Kill process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

#### Kill Process on Port 3001:
```powershell
# Find PID
netstat -ano | findstr :3001

# Kill process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

#### Kill All Node Processes (Nuclear Option):
```powershell
taskkill /IM node.exe /F
```

### Problem: Module Not Found

#### Backend:
```bash
cd apps/api
npm install
npm run prisma:generate
npm run start:dev
```

#### Frontend:
```bash
cd apps/web
npm install
npm run dev
```

### Problem: Database Connection Error

Check your `.env` file in `apps/api`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hms"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3001
```

Run database migrations:
```bash
cd apps/api
npm run prisma:migrate
npm run prisma:generate
```

### Problem: Frontend Build Errors

Clear Next.js cache:
```bash
cd apps/web
rm -rf .next
npm run dev
```

---

## 📊 Server Status Check

### Quick Health Check Script:
```powershell
# Check if ports are listening
$backend = netstat -ano | findstr ":3001.*LISTENING"
$frontend = netstat -ano | findstr ":3000.*LISTENING"

if ($backend) {
    Write-Host "✅ Backend is running on port 3001" -ForegroundColor Green
} else {
    Write-Host "❌ Backend is NOT running on port 3001" -ForegroundColor Red
}

if ($frontend) {
    Write-Host "✅ Frontend is running on port 3000" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend is NOT running on port 3000" -ForegroundColor Red
}
```

---

## 🌐 Access URLs

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Patient Module**: http://localhost:3000/dashboard/patients
- **Appointment Module**: http://localhost:3000/appointments-new

---

## 📝 Common Commands

### Backend:
```bash
cd apps/api

# Development mode (with auto-reload)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug

# Database commands
npm run prisma:studio      # Open Prisma Studio
npm run prisma:migrate     # Run migrations
npm run prisma:generate    # Generate Prisma Client
```

### Frontend:
```bash
cd apps/web

# Development mode
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

---

## 🔍 Debugging Tips

### View Backend Logs:
Backend logs appear in the terminal where you ran `npm run start:dev`

### View Frontend Logs:
Frontend logs appear in:
1. Terminal where you ran `npm run dev`
2. Browser console (F12)

### Common Error Messages:

#### "EADDRINUSE: address already in use"
- Port is already occupied
- Kill the process using that port

#### "Cannot find module"
- Run `npm install` in the respective directory

#### "Prisma Client not generated"
- Run `npm run prisma:generate` in apps/api

#### "Database connection failed"
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running

---

## 🎯 Development Workflow

1. **Start Backend First**
   ```bash
   cd apps/api
   npm run start:dev
   ```
   Wait for: `Application is running on: http://localhost:3001`

2. **Then Start Frontend**
   ```bash
   cd apps/web
   npm run dev
   ```
   Wait for: `Ready in X.Xs`

3. **Open Browser**
   Navigate to: http://localhost:3000

4. **Make Changes**
   - Both servers have hot-reload enabled
   - Changes will auto-refresh

---

## 🛑 Stopping Servers

### Graceful Shutdown:
Press `Ctrl + C` in each terminal

### Force Stop:
```powershell
# Stop all node processes
taskkill /IM node.exe /F
```

---

## 📦 First Time Setup

If this is your first time running the servers:

### 1. Install Dependencies:
```bash
# Backend
cd apps/api
npm install

# Frontend
cd apps/web
npm install
```

### 2. Setup Database:
```bash
cd apps/api
npm run prisma:generate
npm run prisma:migrate
```

### 3. Configure Environment:
Create `.env` file in `apps/api`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hms"
JWT_SECRET="your-secret-key-change-this"
JWT_EXPIRES_IN="1d"
PORT=3001
```

Create `.env.local` file in `apps/web`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Start Servers:
Follow the Quick Start guide above

---

## ✅ Success Indicators

### Backend is Ready When You See:
```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] AppModule dependencies initialized
[Nest] INFO [RoutesResolver] Mapped {/patients, GET} route
[Nest] INFO [RoutesResolver] Mapped {/appointments, GET} route
[Nest] INFO [NestApplication] Nest application successfully started
Application is running on: http://localhost:3001
```

### Frontend is Ready When You See:
```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in X.Xs
```

---

## 🎉 You're All Set!

Both servers should now be running:
- ✅ Backend: http://localhost:3001
- ✅ Frontend: http://localhost:3000

Happy coding! 🚀
