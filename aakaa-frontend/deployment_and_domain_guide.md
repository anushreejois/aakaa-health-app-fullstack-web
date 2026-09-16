# Complete Domain & Deployment Guide

This guide walks you through:
1. Purchasing a custom domain name.
2. Setting up the production cloud database (MongoDB Atlas).
3. Deploying the Node.js backend to **Render**.
4. Deploying the React frontend to **Vercel**.
5. Linking your custom domain name to the website.

---

## Phase 1: Purchasing a Custom Domain

To get a domain name (e.g., `aakaa.com` or `aakaa.health`):
1. **Choose a Domain Registrar**: Go to a domain provider like **GoDaddy**, **Namecheap**, or **Hostinger**.
2. **Search and Buy**: Search for your desired name, select an extension (e.g., `.com`, `.in`, `.health`, `.app`), and complete the purchase.
3. **Keep the Dashboard Open**: Once purchased, keep the registrar's DNS Settings page open—you will need to update DNS records here in **Phase 4**.

---

## Phase 2: Deploying the Backend (Render)

We will deploy your Node.js Express server to **Render** because it is free, reliable, and integrates directly with GitHub.

### Step 1: Set up MongoDB Atlas (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new **Shared Cluster** (which is permanently free).
3. In **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`). *(This is necessary because Render's free server IPs rotate dynamically).*
4. In **Database Access**, create a database user with a username and password.
5. Click **Connect** -> **Connect your application** and copy the Connection String (URI). It will look like:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/aakaa?retryWrites=true&w=majority`

### Step 2: Push your Backend Code to GitHub
Ensure your code is uploaded to a private/public GitHub repository.

### Step 3: Create a Web Service on Render
1. Go to [Render.com](https://render.com) and create an account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your website's repository.
4. Set the following configuration:
   * **Root Directory**: `backend` (since your backend code is in the `/backend` subfolder).
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node index.js`
   * **Instance Type**: Select **Free**.
5. Go to the **Environment** tab on Render and add these environment variables:
   * `PORT` = `10000`
   * `MONGO_URI` = *(Paste your MongoDB Atlas Connection String from Step 1)*
   * `JWT_SECRET` = *(Generate a secure random string, e.g., `aakaa_secure_prod_jwt_key`)*
   * `NODE_ENV` = `production`
6. Click **Deploy Web Service**. 
7. Once deployed successfully, Render will provide you with a live URL, for example: `https://aakaa-backend-api.onrender.com`. **Copy this URL.**

---

## Phase 3: Deploying the Frontend (Vercel)

We will deploy your static React frontend to **Vercel** because it automatically serves your assets via a globally cached CDN.

### Step 1: Connect to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in using your GitHub account.
2. Click **Add New...** and select **Project**.
3. Select your GitHub repository.
4. Set the following configuration:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./` (or leave blank, since your react code is in the root directory).
5. Open the **Environment Variables** section on Vercel and add:
   * `VITE_API_URL` = `https://aakaa-backend-api.onrender.com` *(Paste your live Render Backend URL here)*
6. Click **Deploy**. Vercel will build your React application and provide you with a temporary domain, e.g., `https://aakaa-frontend.vercel.app`.

---

## Phase 4: Connecting Your Custom Domain Name

Now that both backend and frontend are running, you can point your custom domain name (from Phase 1) to your Vercel website.

### Step 1: Add the Domain in Vercel
1. On your Vercel project dashboard, go to **Settings** -> **Domains**.
2. Type in your domain (e.g., `aakaa.com` or `www.aakaa.com`) and click **Add**.
3. Vercel will show you the exact **DNS Records** you need to add to your registrar. It will look like this:
   * **Type**: `A` | **Name**: `@` | **Value**: `76.76.21.21` (Vercel's IP address)
   * **Type**: `CNAME` | **Name**: `www` | **Value**: `cname.vercel-dns.com`

### Step 2: Configure DNS in your Registrar (GoDaddy/Namecheap)
1. Go to your domain registrar's dashboard and open the **DNS Management** panel for your domain.
2. Add the records Vercel provided:
   * Add an **A Record** pointing `@` to `76.76.21.21`.
   * Add a **CNAME Record** pointing `www` to `cname.vercel-dns.com`.
3. Save the DNS changes.

### Step 3: Verification
* Wait about 10-30 minutes for the DNS settings to propagate across the internet.
* Vercel will automatically detect the changes, generate a secure SSL certificate, and show a green "Valid" badge.
* You can now visit your custom domain (`https://yourdomain.com`) in your browser to see your live, secured production website!
