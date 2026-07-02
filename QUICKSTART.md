# Quick Start Guide

Get the backend running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Environment

Copy the example environment file:
```bash
cp .env.example .env
```

**For quick testing, use these values in `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=my-super-secret-jwt-key-for-development-only
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:3000
```

## Step 3: Start MongoDB

### Option A: Local MongoDB
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

## Step 4: Seed Database (Optional but Recommended)

```bash
npm run seed
```

This creates:
- ✅ 20+ sample products
- ✅ Admin user (Mobile: `9999999999`, Password: `admin123`)
- ✅ Test user (Mobile: `8888888888`, Password: `test123`)

## Step 5: Start Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 E-Commerce Backend Server
   Environment: development
   Port: 5000
```

## Step 6: Test the API

### Quick Test with cURL

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"mobile\":\"8888888888\",\"password\":\"test123\"}"
```

### Using Postman
1. Import `postman_collection.json`
2. Run the requests in order
3. Token will be saved automatically

## Common Commands

```bash
# Start development server (auto-restart on changes)
npm run dev

# Start production server
npm start

# Seed database
npm run seed

# Run tests
npm test

# Lint code
npm run lint
```

## Troubleshooting

### MongoDB Connection Error
- ✅ Make sure MongoDB is running
- ✅ Check `MONGODB_URI` in `.env`

### Port Already in Use
```bash
# Change PORT in .env to different number
PORT=5001
```

### JWT Errors
- ✅ Make sure `JWT_SECRET` is set in `.env`

## Next Steps

1. ✅ Test all API endpoints using Postman
2. ✅ Connect frontend to backend
3. ✅ Customize product data
4. ✅ Deploy to production

## Important Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `POST /api/auth/register` | Register user |
| `POST /api/auth/login` | Login user |
| `GET /api/products` | Get all products |
| `GET /api/cart` | Get user cart |
| `POST /api/orders` | Create order |

## Default Credentials

After running `npm run seed`:

**Admin:**
- Mobile: `9999999999`
- Password: `admin123`

**Test User:**
- Mobile: `8888888888`
- Password: `test123`

---

**Need help?** Check `README.md` for detailed documentation!
