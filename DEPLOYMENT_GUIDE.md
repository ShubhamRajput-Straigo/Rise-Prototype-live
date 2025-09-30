# CPG Dashboard Deployment Guide

## 🚀 **Option 1: Deploy to Render (Recommended)**

### **Prerequisites:**
1. GitHub account
2. MongoDB Atlas account (free tier available)
3. Render account (free tier available)

### **Step 1: Prepare MongoDB Atlas**

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (choose the free M0 tier)

2. **Configure Database:**
   - Create a database named `cpg_dashboard`
   - Create collections: `fact_execution_alerts`, `fact_retail_execution_priority`, `fact_event_promotion_performance`, `fact_order_fulfillment_summary`, `fact_po_fulfillment_summary`
   - Add your data to these collections

3. **Get Connection String:**
   - Go to "Database Access" → "Connect" → "Connect your application"
   - Copy the connection string (replace `<password>` with your password)

### **Step 2: Deploy Backend to Render**

1. **Create Render Account:**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Choose the `project` folder
   - Configure:
     - **Name:** `cpg-dashboard-api`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Environment Variables:**
       - `NODE_ENV` = `production`
       - `MONGODB_URI` = `your_mongodb_connection_string`
       - `PORT` = `3001`

3. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://cpg-dashboard-api.onrender.com`)

### **Step 3: Deploy Frontend to Render**

1. **Deploy Frontend Service:**
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Choose the `project` folder
   - Configure:
     - **Name:** `cpg-dashboard-frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`
     - **Environment Variables:**
       - `VITE_API_URL` = `https://cpg-dashboard-api.onrender.com`

2. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://cpg-dashboard-frontend.onrender.com`)

---

## 🌐 **Option 2: Deploy to Vercel (Frontend Only)**

### **Step 1: Deploy Frontend to Vercel**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd project
   vercel
   ```

4. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com`

### **Step 2: Deploy Backend Separately**

For the backend, you'll need to use a different service like:
- **Railway** (recommended)
- **Heroku**
- **DigitalOcean App Platform**

---

## 🔧 **Option 3: Deploy to Railway (Full-Stack)**

### **Step 1: Prepare for Railway**

1. **Create railway.json:**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/api/health"
     }
   }
   ```

2. **Deploy to Railway:**
   - Go to [Railway](https://railway.app)
   - Connect GitHub repository
   - Add environment variables:
     - `MONGODB_URI`
     - `NODE_ENV=production`
   - Deploy

---

## 📋 **Environment Variables Setup**

### **Required Environment Variables:**

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cpg_dashboard

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend Configuration
VITE_API_URL=https://your-backend-url.com
```

### **MongoDB Atlas Setup:**

1. **Create Collections:**
   ```javascript
   // Collections to create in MongoDB Atlas
   db.createCollection("fact_execution_alerts")
   db.createCollection("fact_retail_execution_priority")
   db.createCollection("fact_event_promotion_performance")
   db.createCollection("fact_order_fulfillment_summary")
   db.createCollection("fact_po_fulfillment_summary")
   ```

2. **Import Your Data:**
   - Use MongoDB Compass or Atlas Data Explorer
   - Import your CSV/JSON data files
   - Ensure field names match the API expectations

---

## 🚀 **Quick Deploy Commands**

### **For Render:**
```bash
# 1. Push to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Go to Render.com and create services as described above
```

### **For Vercel:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy frontend
cd project
vercel

# 3. Deploy backend separately (Railway/Heroku)
```

### **For Railway:**
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway up
```

---

## 🔍 **Testing Your Deployment**

### **1. Test Backend API:**
```bash
# Health check
curl https://your-backend-url.com/api/health

# Test KPIs
curl https://your-backend-url.com/api/kpis

# Test schema
curl https://your-backend-url.com/api/schema
```

### **2. Test Frontend:**
- Visit your frontend URL
- Check if data loads properly
- Test filters and navigation

### **3. Debug Issues:**
- Check Render/Railway/Vercel logs
- Verify MongoDB connection
- Check environment variables
- Test API endpoints individually

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **MongoDB Connection Failed:**
   - Check connection string format
   - Verify IP whitelist in MongoDB Atlas
   - Ensure database and collections exist

2. **CORS Errors:**
   - Backend already configured for CORS
   - Check if frontend URL is allowed

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable names and values
   - Restart services after changes

### **Performance Optimization:**

1. **Enable MongoDB Indexing:**
   ```javascript
   // Create indexes for better performance
   db.fact_execution_alerts.createIndex({ "Rgn Nm": 1 })
   db.fact_retail_execution_priority.createIndex({ "Catg Nm": 1 })
   ```

2. **Enable Caching:**
   - Add Redis for API caching
   - Implement response caching headers

---

## 📞 **Support**

If you encounter issues:
1. Check the deployment platform logs
2. Verify MongoDB Atlas connection
3. Test API endpoints individually
4. Check environment variables
5. Review the troubleshooting section above

Your CPG Dashboard should now be live and accessible worldwide! 🌍
