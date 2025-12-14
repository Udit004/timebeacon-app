# Production Deployment Setup Guide

## 🎯 Step-by-Step Instructions

### 1️⃣ Update Your .env File

Replace your `.env` file content with your production credentials:

```env
# Neon PostgreSQL Database
DATABASE_URL="your_neon_connection_string_here"
DIRECT_URL="your_neon_connection_string_here"

# Pusher Credentials
PUSHER_APP_ID="your_pusher_app_id"
PUSHER_KEY="your_pusher_key"
PUSHER_SECRET="your_pusher_secret"
PUSHER_CLUSTER="your_pusher_cluster"
NEXT_PUBLIC_PUSHER_KEY="your_public_pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_pusher_cluster"

# Inngest Cloud
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"
```

**Important**: Your Neon connection string should look like:
```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
```

---

### 2️⃣ Generate and Run Migrations

```bash
# Generate new Prisma client for PostgreSQL
bun prisma generate

# Create migration for PostgreSQL
bun prisma migrate dev --name switch_to_postgresql

# Or deploy directly (production)
bun prisma migrate deploy
```

---

### 3️⃣ Setup Cloud Inngest

#### A. Get Inngest Cloud Credentials

1. **Sign up/Login** to [Inngest Cloud](https://www.inngest.com/)
   
2. **Create a new app** in your Inngest dashboard

3. **Get your keys**:
   - Go to your app settings
   - Copy the **Event Key** (starts with `inngest_`)
   - Copy the **Signing Key** (starts with `signkey_`)

4. **Update your .env** with these keys

#### B. Update Inngest Configuration

Your Inngest client is already configured correctly in `lib/inngest.ts`. It will automatically use cloud when you set the environment variables.

#### C. Configure Webhook in Inngest Dashboard

After deploying to Vercel:
1. Go to Inngest Dashboard → Your App → Settings
2. Add your webhook URL: `https://your-vercel-app.vercel.app/api/inngest`
3. Inngest will verify and start sending events

---

### 4️⃣ Prepare for Vercel Deployment

#### Check Your Code
```bash
# Build locally to catch any errors
bun run build

# Fix any errors before deploying
```

#### Verify Files
- ✅ `.env` updated with production credentials
- ✅ `.env` is in `.gitignore`
- ✅ Prisma schema uses PostgreSQL
- ✅ Build completes successfully

---

### 5️⃣ Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: Production ready with Neon PostgreSQL and Cloud Inngest"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   
   In Vercel Dashboard, go to: **Settings → Environment Variables**
   
   Add all variables from your `.env` file:
   ```
   DATABASE_URL
   DIRECT_URL
   PUSHER_APP_ID
   PUSHER_KEY
   PUSHER_SECRET
   PUSHER_CLUSTER
   NEXT_PUBLIC_PUSHER_KEY
   NEXT_PUBLIC_PUSHER_CLUSTER
   INNGEST_EVENT_KEY
   INNGEST_SIGNING_KEY
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (will prompt for environment variables)
vercel --prod
```

---

### 6️⃣ Post-Deployment Steps

#### A. Run Database Migrations on Production

After first deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.production
bun prisma migrate deploy
```

Or trigger migration through Vercel's deployment:
- The migrations will run automatically if configured in `package.json`

#### B. Configure Inngest Webhook

1. Copy your Vercel app URL: `https://your-app-name.vercel.app`
2. Go to Inngest Dashboard
3. Add webhook: `https://your-app-name.vercel.app/api/inngest`
4. Save and verify

#### C. Test Everything

- ✅ Create a reminder
- ✅ Edit a reminder
- ✅ Delete a reminder
- ✅ Check real-time notifications work
- ✅ Wait for scheduled reminder to trigger
- ✅ Verify Inngest logs in dashboard

---

### 7️⃣ Optional: Add Build Script

Update `package.json` to run migrations on build:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## 🔍 Troubleshooting

### Database Connection Issues
- ✅ Verify connection string format includes `?sslmode=require`
- ✅ Check Neon database is not paused (it auto-pauses after inactivity)
- ✅ Ensure IP allowlist includes Vercel IPs (usually "Allow all" for Neon)

### Inngest Not Working
- ✅ Verify webhook URL is correct in Inngest dashboard
- ✅ Check signing key is correct
- ✅ Look at Inngest dashboard logs for errors
- ✅ Verify `/api/inngest` endpoint is accessible

### Build Failures
- ✅ Run `bun run build` locally first
- ✅ Check Vercel build logs
- ✅ Ensure all environment variables are set
- ✅ Verify `NEXT_PUBLIC_*` variables are present for client-side code

### Migrations Not Running
- ✅ Manually run `prisma migrate deploy` using Vercel CLI
- ✅ Check database connection from Vercel
- ✅ Verify `DATABASE_URL` is correctly set in Vercel

---

## 📊 Monitoring

### Check Logs

**Vercel Logs**:
- Go to Vercel Dashboard → Your Project → Deployments → View Logs

**Inngest Logs**:
- Go to Inngest Dashboard → Your App → Runs

**Database Logs**:
- Go to Neon Dashboard → Your Project → Monitoring

---

## 🎉 You're Done!

Your TimeBeacon app is now running in production with:
- ✅ Neon PostgreSQL database
- ✅ Cloud Inngest for background jobs
- ✅ Vercel hosting
- ✅ Real-time notifications via Pusher

Share your app URL: `https://your-app.vercel.app` 🚀
