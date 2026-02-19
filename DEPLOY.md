# Deploying the app (including Netlify demo)

Your app has a **frontend** (Vite/React) and a **backend** (Node in `server/`) that handles image uploads. Netlify only runs the frontend; it does **not** run the Node server.

## Option A: Demo on Netlify + backend on Render (recommended for “one demo link”)

Use **Netlify** for the site (your demo link) and **Render** (or similar) for the backend so uploads work.

### 1. Deploy the backend to Render

1. Go to [render.com](https://render.com) and sign up (free).
2. **New → Web Service**.
3. Connect your repo. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Add `NODE_ENV` = `production`
4. Deploy. Note the URL, e.g. `https://your-app-name.onrender.com`.

### 2. Deploy the frontend to Netlify

1. Build the app with your backend URL (use your real Render URL):

   ```bash
   # Windows (PowerShell)
   $env:VITE_API_URL="https://your-app-name.onrender.com"; npm run build

   # Mac/Linux
   VITE_API_URL=https://your-app-name.onrender.com npm run build
   ```

2. In [Netlify](https://app.netlify.com): **Add site → Deploy manually** (or connect the same repo).
3. **Drag and drop** the `dist` folder, or set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. In **Site settings → Environment variables**, add:
   - **Key:** `VITE_API_URL`  
   - **Value:** `https://your-app-name.onrender.com` (no trailing slash)
5. Trigger a new deploy so the build uses this variable.

Your **demo link** is the Netlify URL. The site will call the Render backend for uploads; product images will use full URLs to Render, so they work from Netlify.

**Note:** On Render’s free tier the backend may “spin down” after inactivity; the first request after that can take 30–60 seconds. After that it’s fast until it sleeps again.

---

## Option B: One service runs everything (e.g. Render)

No Netlify; both frontend and backend run on Render.

1. In the **project root** (not in `server`), build the frontend:

   ```bash
   npm run build
   ```

2. On Render: **New → Web Service**, connect your repo.
   - **Root Directory:** leave empty (repo root).
   - **Build Command:** `npm run build && cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment:** `NODE_ENV` = `production`
3. So that the server can serve the built app, the server must have the built files. Easiest: in **Build Command** run the build from the repo root, then install server deps:

   ```bash
   npm run build
   cd server && npm install
   ```

   And ensure the server’s `index.js` serves `../dist` when `NODE_ENV=production` (it already does). Your **demo link** is the Render URL (e.g. `https://your-app.onrender.com`).

---

## Summary

| Where frontend runs | Where backend runs | Demo link   | Uploads |
|--------------------|--------------------|------------|--------|
| Netlify            | Render (or similar)| Netlify URL| Yes (set `VITE_API_URL`) |
| Render             | Same Render app    | Render URL | Yes (same origin) |
| Netlify only       | —                  | Netlify URL| No (no backend) |

For a **Netlify demo link with uploads**, use **Option A** and set `VITE_API_URL` to your Render backend URL.
