# Render Deployment Guide

## Environment Variables Setup

Your backend is deployed on Render but failing because environment variables are not configured. Follow these steps:

### 1. Access Your Render Dashboard
Go to: https://dashboard.render.com/web/srv-d93a0qm7r5hc73bphk70

### 2. Navigate to Environment Variables
- Click on **"Environment"** in the left sidebar
- Or click on **"Environment"** tab at the top

### 3. Add Required Environment Variables

Add the following environment variables (click "Add Environment Variable" for each):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | `mongodb://amar:Password18@ac-o0lwq10-shard-00-00.ngkkhhy.mongodb.net:27017,ac-o0lwq10-shard-00-01.ngkkhhy.mongodb.net:27017,ac-o0lwq10-shard-00-02.ngkkhhy.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority` |
| `JWT_SECRET` | `e-commerce-backend-jwt-secret-key-change-in-production-2026` |
| `JWT_EXPIRE` | `7d` |
| `JWT_COOKIE_EXPIRE` | `7` |
| `CLIENT_URL` | Your frontend URL (e.g., `https://your-frontend.vercel.app`) |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |

### 4. Save and Deploy
- Click **"Save Changes"**
- Render will automatically trigger a new deployment
- Wait for the deployment to complete (usually 2-3 minutes)

### 5. Verify Deployment
Once deployed, check:
- Health endpoint: `https://your-app.onrender.com/health`
- The logs should show: `✅ MongoDB Connected: ac-o0lwq10-shard-00-00.ngkkhhy.mongodb.net`

## Important Notes

⚠️ **Security Considerations:**
1. The MongoDB password is currently visible in plain text
2. Consider using MongoDB Atlas environment variables for better security
3. Change the JWT_SECRET to a strong, unique value in production

⚠️ **MongoDB Connection:**
- Make sure your MongoDB Atlas cluster allows connections from Render's IP addresses
- In MongoDB Atlas: Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
- Or add Render's specific IP ranges for better security

## Troubleshooting

### Error: "MONGODB_URI is undefined"
- You haven't set the environment variables in Render dashboard
- Follow steps 1-4 above

### Error: "Connection timeout"
- Check MongoDB Atlas Network Access settings
- Ensure 0.0.0.0/0 is allowed or add Render's IP ranges

### Error: "Authentication failed"
- Verify the MongoDB connection string is correct
- Check username and password in MongoDB Atlas

## Local Development

For local development, environment variables are loaded from `.env` file:

```bash
cd backend-node
node src/server.js
```

## Testing Environment Variables

Run this script to verify environment variables are loaded:

```bash
node verify-env.js
```
