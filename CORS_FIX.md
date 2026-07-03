# CORS 500 Error Fix

## Problem
The backend was throwing a 500 Internal Server Error on OPTIONS (preflight) requests because the CORS middleware was throwing an error for unauthorized origins.

## Solution Applied

### 1. Fixed CORS Configuration (`src/app.js`)
- **Before**: Threw an error for non-allowed origins → caused 500 errors
- **After**: Returns `false` for unauthorized origins → proper CORS rejection (no crash)
- Added explicit CORS options:
  - `methods`: All HTTP methods including OPTIONS
  - `allowedHeaders`: Standard headers including Authorization
  - `maxAge`: Cache preflight responses for 10 minutes
  - Better logging for unauthorized origins in production

### 2. Updated Environment Variables

#### Required Settings in Render Dashboard

Go to your Render dashboard → Your service → Environment tab and set these variables:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://amar:Password18@ac-o0lwq10-shard-00-00.ngkkhhy.mongodb.net:27017,ac-o0lwq10-shard-00-01.ngkkhhy.mongodb.net:27017,ac-o0lwq10-shard-00-02.ngkkhhy.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=e-commerce-backend-jwt-secret-key-change-in-production-2026
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=https://demo-frontend-neon.vercel.app,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Update `CLIENT_URL` to include ALL your frontend URLs:
- Production Vercel URL(s)
- Localhost for testing
- Any preview/staging URLs

Example:
```bash
CLIENT_URL=https://demo-frontend-neon.vercel.app,https://e-commerce-amar.vercel.app,http://localhost:3000
```

## Deployment Steps

### Option 1: Automatic Deploy (Recommended)
If you have auto-deploy enabled on Render:

1. **Commit and push changes**:
   ```bash
   cd backend-node
   git add src/app.js .env
   git commit -m "Fix CORS 500 error on OPTIONS requests"
   git push origin main
   ```

2. **Update environment variables** in Render dashboard
3. Wait for automatic deployment to complete

### Option 2: Manual Deploy
If auto-deploy is disabled:

1. **Update environment variables** in Render dashboard first
2. Go to Render dashboard → Your service → Manual Deploy → Deploy latest commit
3. Or commit/push changes and trigger manual deploy

## Verification

After deployment, test the endpoints:

### 1. Health Check
```bash
curl https://demo-backend-1-uc12.onrender.com/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-07-04T..."
}
```

### 2. Test CORS Preflight
```bash
curl -X OPTIONS https://demo-backend-1-uc12.onrender.com/api/auth/login \
  -H "Origin: https://demo-frontend-neon.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

Should return **200 OK** with CORS headers:
```
Access-Control-Allow-Origin: https://demo-frontend-neon.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Credentials: true
```

### 3. Test Login from Frontend
Open your frontend at https://demo-frontend-neon.vercel.app and try to log in.

## Common Issues

### Issue 1: Still getting 500 errors
**Solution**: Make sure you updated the environment variables in Render AND redeployed

### Issue 2: CORS error (not 500, but blocked by CORS)
**Solution**: Check that your frontend URL is in the `CLIENT_URL` environment variable

### Issue 3: Frontend URL not matching
**Solution**: Frontend URLs must match EXACTLY (including https/http and no trailing slash)
- ✅ Correct: `https://demo-frontend-neon.vercel.app`
- ❌ Wrong: `https://demo-frontend-neon.vercel.app/`
- ❌ Wrong: `http://demo-frontend-neon.vercel.app` (missing https)

## Environment Variable Best Practices

1. **Never commit sensitive data** to git (passwords, API keys)
2. **Use Render's environment variables** for production secrets
3. **Keep `.env` file** for local development only
4. **Add `.env` to `.gitignore`** (already done)

## Next Steps

1. Update Render environment variables
2. Push changes to trigger deploy
3. Test the login flow from your frontend
4. Monitor Render logs for any issues

## Support

If issues persist, check Render logs:
- Go to Render dashboard → Your service → Logs tab
- Look for any error messages or warnings
