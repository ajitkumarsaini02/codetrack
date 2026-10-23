# CodeTrack Deployment Guide 🚀

Deploy CodeTrack in 3 simple steps:
1. **GitHub Setup** (Push code to GitHub)
2. **Backend Deployment on Render**
3. **Frontend Deployment on Vercel**

---

## Step 1: Push Code to GitHub

Open terminal in the project root (`codetrack`):

```bash
git init
git add .
git commit -m "Deploy CodeTrack initial commit"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

## Step 2: Deploy Backend on Render (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository (`codetrack`).
3. Fill in the settings:
   - **Name:** `codetrack-backend` (or your choice)
   - **Language:** `Node`
   - **Root Directory:** `backend`  *(⚠️ Important!)*
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (or `node src/server.js`)
   - **Instance Type:** `Free`

4. Add **Environment Variables** in Render (under Environment tab):

   | Key | Value / Example |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/codetrack?retryWrites=true&w=majority` |
   | `JWT_SECRET` | Any strong random string (e.g. `c0d3tr4ck_s3cur3_jwt_k3y_9876`) |
   | `JWT_EXPIRES_IN` | `never` *(token never expires)* |
   | `CLIENT_URL` | Your Vercel frontend URL (e.g. `https://codetrack.vercel.app`) |

5. Click **Create Web Service**.
6. Once deployed, copy your Render backend URL (e.g., `https://codetrack-backend.onrender.com`).
   - You can test it by visiting: `https://codetrack-backend.onrender.com/api/health`

---

## Step 3: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** > **Project**.
2. Import your GitHub repository (`codetrack`).
3. In the project configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit and select `frontend` *(⚠️ Important!)*
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Add **Environment Variables** in Vercel:

   | Name | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://your-backend.onrender.com/api` *(Make sure to add `/api` at the end)* |

5. Click **Deploy**.

---

## Step 4: Final Link Check (CORS)

After Vercel finishes deploying, copy your live frontend URL (e.g., `https://codetrack.vercel.app`):
1. Go back to **Render** > Your backend service > **Environment**.
2. Update `CLIENT_URL` to your exact Vercel URL: `https://codetrack.vercel.app`.
3. Save changes (Render will automatically redeploy).

Done! 🎉 Your fullstack application is live!
