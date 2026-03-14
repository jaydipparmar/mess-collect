# Deployment Guide for Mess Collect

This guide walks you through deploying the Mess Collect application to production using Vercel (Frontend), Render (Backend), and MongoDB Atlas.

---

## 1. Database Deployment (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. Click **Build a Database** and select the free **Shared** tier.
3. In **Database Access**, create a user (save the username and password).
4. In **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Go back to **Databases**, click **Connect**, select **Connect your application**, and copy the connection string. Replace `<password>` with your database user password.

---

## 2. Backend Deployment (Render)

1. Push your entire `mess-collect` code repository to GitHub.
2. Create an account on [Render](https://render.com/).
3. Click **New** -> **Web Service** and connect your GitHub repository.
4. Fill in the following settings:
   - **Name**: `mess-collect-api`
   - **Root Directory**: `backend` *(Important!)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Scroll down to **Advanced** and click **Add Environment Variable**. Add all the variables from your backend `.env` file:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your Atlas Connection String
   - `JWT_SECRET`: A long random string
   - `EMAIL_HOST`: `smtp.gmail.com`
   - `EMAIL_PORT`: `587`
   - `EMAIL_USER`: Your Gmail
   - `EMAIL_PASS`: Your Gmail App Password
   - `RAZORPAY_KEY_ID`: Your live/test Razorpay ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Secret
   - `CLIENT_URL`: *(Leave blank for now, you will update this in step 3 after Vercel generates a URL)*.
6. Click **Create Web Service**. Wait for it to finish building and deploying. Copy the generated URL (e.g., `https://mess-collect-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. Create an account on [Vercel](https://vercel.com) and log in with GitHub.
2. Click **Add New** -> **Project** and import your repository.
3. In the **Configure Project** section:
   - **Framework Preset**: Vite
   - **Root Directory**: Click Edit and select `frontend`
4. Expand the **Environment Variables** section and add:
   - `VITE_API_URL`: Your Render Backend URL + `/api` (e.g., `https://mess-collect-api.onrender.com/api`)
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID.
5. Click **Deploy**. Vercel will build and assign you a live URL (e.g., `https://mess-collect-front.vercel.app`).

---

## 4. Final Security Configuration (CORS)

1. Copy your new Vercel Frontend live URL.
2. Go back to your [Render Dashboard](https://dashboard.render.com).
3. Select your `mess-collect-api` Web Service.
4. Go to **Environment** tab.
5. Update the `CLIENT_URL` variable to your Vercel URL (e.g., `https://mess-collect-front.vercel.app`). Ensure there is **no trailing slash**.
6. Render will automatically restart your backend service to apply the new CORS policy.

Your application is now live and fully functional!
