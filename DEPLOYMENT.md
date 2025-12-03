# Deployment Guide - Collaboros

## Overview
- **Frontend:** Vercel (Free)
- **Backend:** Render.com (Free tier, can switch to Railway later)
- **Database:** MongoDB Atlas (Free forever)

---

## Step 1: Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a **Free M0 Cluster**
4. Go to **Database Access** → Add User
   - Username: `collaboros_user`
   - Password: Generate secure password (save it!)
   - Role: Read & Write to any database
5. Go to **Network Access** → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for development)
6. Get connection string:
   - Click **Connect** → **Drivers**
   - Copy connection string
   - Replace `<password>` with your password
   - Should look like: `mongodb+srv://collaboros_user:PASSWORD@cluster.mongodb.net/collaboros?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend to Render

### Prerequisites
- Push your code to GitHub
- Have your MongoDB Atlas connection string ready

### Steps

1. **Go to [Render.com](https://render.com)** and sign up/login

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the service:**
   - **Name:** `collaboros-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables:**
   Click "Advanced" → Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://collaboros_user:PASSWORD@cluster.mongodb.net/collaboros?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_change_this
   PORT=10000
   FRONTEND_URL=https://your-app.vercel.app
   ```
   
   **Note:** You'll update `FRONTEND_URL` after deploying frontend

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes first time)
   - Copy your backend URL (e.g., `https://collaboros-backend.onrender.com`)

**Important:** Free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Step 3: Deploy Frontend to Vercel

### Prerequisites
- Backend deployed and URL copied
- Code pushed to GitHub

### Steps

1. **Go to [Vercel.com](https://vercel.com)** and sign up/login with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as root)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://collaboros-backend.onrender.com/api
     ```
   - Replace with your actual Render backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your Vercel URL (e.g., `https://collaboros.vercel.app`)

6. **Update Backend FRONTEND_URL**
   - Go back to Render dashboard
   - Open your backend service
   - Go to "Environment" tab
   - Update `FRONTEND_URL` to your Vercel URL
   - Save changes (will redeploy automatically)

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click "Sign In" → "Create Account"
3. Register a new user
4. Check that everything works!

**Test messaging:**
- Create two accounts (use incognito for second)
- Exchange usernames
- Send messages between accounts

---

## Step 5: Setup Custom Domain (Optional)

### Vercel (Frontend)
1. Go to your project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render (Backend)
1. Go to your service → Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## Switching to Railway Later

When ready to move backend to Railway:

1. **Create Railway account** at [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub
3. **Add MongoDB** (Railway plugin) or keep Atlas
4. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   FRONTEND_URL=https://your-app.vercel.app
   PORT=3000
   ```
5. **Update Vercel env variable:**
   - Change `NEXT_PUBLIC_API_URL` to new Railway URL
   - Redeploy frontend

---

## Troubleshooting

### Backend not responding
- **Free tier sleep:** Render free tier sleeps after 15 min inactivity
- **First request:** Takes 30-60 seconds to wake up
- **Solution:** Keep service active or upgrade to paid tier

### CORS errors
- Check `FRONTEND_URL` in backend matches your Vercel URL exactly
- Ensure no trailing slash

### Database connection failed
- Verify MongoDB Atlas connection string
- Check Network Access allows `0.0.0.0/0`
- Verify username/password are correct

### Can't login/register
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Test backend directly: `https://your-backend.onrender.com/api/health`

---

## Costs

- **MongoDB Atlas:** Free forever (512MB)
- **Render Backend:** Free (sleeps after inactivity)
- **Vercel Frontend:** Free (unlimited bandwidth for personal projects)

**Total: $0/month** 🎉

Upgrade when needed:
- **Render:** $7/month (no sleep, better performance)
- **Railway:** $5 credit/month, pay-as-you-go after
- **MongoDB Atlas:** $9/month for 2GB shared cluster

---

## Environment Variables Checklist

### Backend (Render/Railway)
- ✅ `NODE_ENV=production`
- ✅ `MONGODB_URI` (from Atlas)
- ✅ `JWT_SECRET` (long random string)
- ✅ `PORT` (10000 for Render, 3000 for Railway)
- ✅ `FRONTEND_URL` (your Vercel URL)

### Frontend (Vercel)
- ✅ `NEXT_PUBLIC_API_URL` (your backend URL + /api)

---

## Auto-Deploy on Git Push

Both Vercel and Render auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel and Render will automatically rebuild and deploy! 🚀
