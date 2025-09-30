# 🚀 Quick Deploy Guide

## **Fastest Way to Go Live (5 minutes):**

### **1. Prepare MongoDB Atlas**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a free cluster
- Get your connection string
- Create database: `cpg_dashboard`

### **2. Deploy to Render (Recommended)**

**Backend:**
1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub → Select this repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `MONGODB_URI` = your MongoDB connection string
     - `NODE_ENV` = `production`
5. Click "Create Web Service"

**Frontend:**
1. Click "New" → "Static Site"
2. Connect GitHub → Select this repo
3. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL` = your backend URL from step above
4. Click "Create Static Site"

### **3. Alternative: Deploy to Railway (Full-Stack)**

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Add environment variables:
   - `MONGODB_URI` = your MongoDB connection string
   - `NODE_ENV` = `production`
5. Deploy!

### **4. Test Your Deployment**

Visit your deployed URL and check:
- ✅ Dashboard loads
- ✅ Data displays in charts
- ✅ Filters work
- ✅ Navigation works

---

## **Need Help?**

- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Check platform logs for errors
- Verify MongoDB connection
- Test API endpoints: `/api/health`, `/api/kpis`

**Your app will be live at:** `https://your-app-name.onrender.com` or `https://your-app-name.railway.app`
