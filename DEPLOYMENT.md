# Deploying the Advanced Calculator

This guide explains how to share your calculator with others or deploy it to a permanent web page.

## Option 1: Quick Sharing with ngrok (Temporary Public URL)

[ngrok](https://ngrok.com/) creates a secure tunnel to your local server, giving you a public URL to share.

### Steps:
1. **Install ngrok** (if not already installed):
   - Download from https://ngrok.com/download
   - Or install via npm: `npm install -g ngrok`

2. **Start your server**:
   ```bash
   npm start
   ```

3. **In a new terminal, run ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Share the URL**: ngrok will display a public URL (e.g., `https://abc123.ngrok.io`) that you can share with anyone.

---

## Option 2: Deploy to Render (Free Permanent Hosting)

[Render](https://render.com/) offers free hosting for Node.js applications.

### Steps:
1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a Render account** at https://render.com

3. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: advanced-calc (or your choice)
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. **Deploy**: Click "Create Web Service" and wait for deployment to complete.

5. **Access your app**: Render will provide a permanent URL (e.g., `https://advanced-calc.onrender.com`).

---

## Option 3: Deploy to Railway (Free Permanent Hosting)

[Railway](https://railway.app/) is another great option for deploying Node.js apps.

### Steps:
1. **Push your code to GitHub** (same as Option 2).

2. **Create a Railway account** at https://railway.app

3. **Deploy from GitHub**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect it's a Node.js app

4. **Configure**:
   - Add a start command if needed: `npm start`
   - Set environment variables if required

5. **Deploy**: Railway will build and deploy automatically, providing a public URL.

---

## Option 4: Deploy to Heroku (Free Alternative)

While Heroku no longer offers a free tier, it's still a popular deployment option.

### Steps:
1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create a new app**:
   ```bash
   heroku create advanced-calc
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **Open your app**:
   ```bash
   heroku open
   ```

---

## Option 5: Deploy to Vercel

[Vercel](https://vercel.com/) is excellent for frontend-heavy applications.

### Steps:
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment.

---

## Notes

- The server is now configured to listen on `0.0.0.0`, making it accessible from external networks when deployed.
- The `PORT` environment variable is already configured in `server.js` to work with cloud platforms.
- For production deployments, consider adding environment variables for security and configuration.

## Troubleshooting

- **Port conflicts**: If port 3000 is in use, the app will use the `PORT` environment variable provided by hosting platforms.
- **Dependencies**: Ensure all dependencies are listed in `package.json` (they already are).
- **Node version**: The app requires Node.js 14.0.0 or higher.
