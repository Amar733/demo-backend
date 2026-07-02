# Deployment Guide

Complete guide to deploy your backend to production.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] Security audit completed
- [ ] API documentation updated
- [ ] Error logging configured
- [ ] Monitoring set up

## MongoDB Setup (Production)

### Using MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to your server
   - Click "Create Cluster"

3. **Configure Security**
   - Database Access → Add Database User
   - Username: `ecommerce_user`
   - Password: Generate secure password
   - User Privileges: "Atlas admin"

4. **Network Access**
   - Click "Add IP Address"
   - For development: "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   
   Example:
   ```
   mongodb+srv://ecommerce_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

## Environment Variables

### Production .env
```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT (IMPORTANT: Use strong secret)
JWT_SECRET=your-super-long-random-secret-key-minimum-32-characters-recommended
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# CORS
CLIENT_URL=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Generate Secure JWT Secret
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

## Deployment Options

### Option 1: Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend-node
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set CLIENT_URL="your_frontend_url"
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **Seed Database** (Optional)
   ```bash
   heroku run npm run seed
   ```

7. **View Logs**
   ```bash
   heroku logs --tail
   ```

8. **Open App**
   ```bash
   heroku open
   ```

### Option 2: Railway

#### Steps

1. **Sign Up**
   - Go to https://railway.app
   - Sign in with GitHub

2. **New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Add environment variables in Railway dashboard
   - Railway will auto-deploy on git push

4. **Custom Domain** (Optional)
   - Settings → Domains → Add Custom Domain

### Option 3: DigitalOcean App Platform

#### Steps

1. **Create Account**
   - Go to https://cloud.digitalocean.com

2. **Create App**
   - Apps → Create App
   - Connect GitHub repository
   - Select branch

3. **Configure Build**
   - Build Command: `npm install`
   - Run Command: `npm start`

4. **Environment Variables**
   - Add all variables from .env

5. **Deploy**
   - Click "Create Resources"

### Option 4: AWS EC2

#### Steps

1. **Launch EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro (free tier)
   - Configure security group (ports 22, 80, 443, 5000)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd backend-node
   npm install
   ```

6. **Create .env**
   ```bash
   nano .env
   # Paste production environment variables
   ```

7. **Start with PM2**
   ```bash
   pm2 start src/server.js --name ecommerce-api
   pm2 startup
   pm2 save
   ```

8. **Configure Nginx** (Optional)
   ```bash
   sudo apt install nginx
   ```

   Create nginx config:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **SSL Certificate** (Let's Encrypt)
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 5: Render

#### Steps

1. **Sign Up**
   - Go to https://render.com
   - Sign in with GitHub

2. **New Web Service**
   - Dashboard → New → Web Service
   - Connect repository

3. **Configure**
   - Name: ecommerce-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

4. **Deploy**
   - Click "Create Web Service"

## Post-Deployment

### 1. Test API
```bash
# Health check
curl https://your-api-url.com/health

# Test endpoints
curl https://your-api-url.com/api/products
```

### 2. Seed Production Database
```bash
# SSH into server or use platform CLI
npm run seed
```

### 3. Monitor Logs

**Heroku:**
```bash
heroku logs --tail
```

**Railway:**
- View in dashboard

**EC2 with PM2:**
```bash
pm2 logs ecommerce-api
pm2 monit
```

### 4. Set Up Monitoring

**PM2 Plus** (EC2):
```bash
pm2 link <secret> <public>
```

**Sentry** (Error Tracking):
```bash
npm install @sentry/node
```

Add to server.js:
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});
```

### 5. Configure CORS

Update CLIENT_URL in production:
```env
CLIENT_URL=https://your-frontend-domain.com
```

Or allow multiple origins in `src/app.js`:
```javascript
const allowedOrigins = [
  'https://your-frontend.com',
  'https://www.your-frontend.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
```

## Database Backup

### Automated Backups (MongoDB Atlas)
- Already included in Atlas
- Continuous backups
- Point-in-time recovery

### Manual Backup
```bash
# Export database
mongodump --uri="your_mongodb_uri" --out=./backup

# Restore database
mongorestore --uri="your_mongodb_uri" ./backup
```

## SSL Certificate

### Using Let's Encrypt (Free)

**For Nginx:**
```bash
sudo certbot --nginx -d api.your-domain.com
```

**For Apache:**
```bash
sudo certbot --apache -d api.your-domain.com
```

### Certificate Auto-Renewal
```bash
sudo certbot renew --dry-run
```

## Performance Optimization

### 1. Enable Compression
Already included via `compression` middleware

### 2. Database Indexing
Already configured in models

### 3. Caching (Optional)

**Install Redis:**
```bash
npm install redis
```

**Add Redis Caching:**
```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache middleware
const cache = (req, res, next) => {
  const key = req.originalUrl;
  client.get(key, (err, data) => {
    if (data) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

// Use in routes
router.get('/products', cache, getProducts);
```

### 4. CDN for Static Assets
- Use Cloudflare
- Use AWS CloudFront
- Use Vercel Edge Network

## Security Hardening

### 1. Environment Variables
- Never commit .env
- Use platform secret managers
- Rotate secrets regularly

### 2. Rate Limiting
```javascript
// Adjust in production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Adjust based on needs
  message: 'Too many requests'
});
```

### 3. HTTPS Only
```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

### 4. Security Headers
Already included via Helmet.js

### 5. Database Security
- Use strong passwords
- Limit database user permissions
- Enable IP whitelisting
- Regular backups

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## Monitoring & Alerts

### 1. Uptime Monitoring
- UptimeRobot (free)
- Pingdom
- StatusCake

### 2. Application Monitoring
- New Relic
- DataDog
- PM2 Plus

### 3. Log Management
- Loggly
- Papertrail
- CloudWatch (AWS)

### 4. Error Tracking
- Sentry
- Rollbar
- Bugsnag

## Scaling Strategies

### Vertical Scaling
- Upgrade server resources
- Increase RAM/CPU

### Horizontal Scaling
- Multiple server instances
- Load balancer
- Session management (Redis)

### Database Scaling
- MongoDB sharding
- Read replicas
- Database optimization

## Troubleshooting

### App Won't Start
```bash
# Check logs
heroku logs --tail  # Heroku
pm2 logs           # PM2

# Common issues:
# - Missing environment variables
# - MongoDB connection failure
# - Port already in use
```

### Database Connection Issues
```bash
# Test connection
mongo "your_mongodb_uri"

# Check:
# - Correct credentials
# - IP whitelist (Atlas)
# - Network access
```

### API Not Accessible
```bash
# Check if server is running
curl http://localhost:5000/health

# Check firewall
sudo ufw status

# Check nginx
sudo systemctl status nginx
```

## Rollback Strategy

### Heroku
```bash
heroku releases
heroku rollback v123
```

### Git-based Platforms
```bash
git revert HEAD
git push origin main
```

### PM2
```bash
# Keep previous version
pm2 start old-version.js --name ecommerce-api-backup
```

## Cost Optimization

### Free Tiers Available
- **MongoDB Atlas**: 512MB free
- **Heroku**: 1 dyno free (with credit card)
- **Railway**: $5 free credit/month
- **Render**: Free tier available

### Paid Recommendations
- Start small, scale as needed
- Monitor resource usage
- Use reserved instances for predictable load

## Support & Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Check database performance monthly
- [ ] Update dependencies quarterly
- [ ] Security audit quarterly
- [ ] Backup verification monthly

### Emergency Contacts
- Database: MongoDB Atlas support
- Hosting: Platform support
- DNS: Domain registrar support

---

**Ready to deploy! Choose your platform and follow the steps above.**
