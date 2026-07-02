# E-Commerce Backend API

Production-level Node.js backend for the e-commerce application with Express, MongoDB, JWT authentication, and comprehensive security features.

## 🚀 Features

### Core Functionality
- ✅ **User Authentication** - JWT-based auth with bcrypt password hashing
- ✅ **Product Management** - CRUD operations with advanced filtering
- ✅ **Shopping Cart** - Persistent cart with stock validation
- ✅ **Order Management** - Complete order lifecycle tracking
- ✅ **Role-Based Access Control** - User and Admin roles
- ✅ **Advanced Search & Filtering** - Search, filter, sort, pagination
- ✅ **Stock Management** - Real-time inventory tracking

### Security Features
- 🔒 **JWT Authentication** - Secure token-based authentication
- 🔒 **Password Hashing** - bcryptjs for secure password storage
- 🔒 **Rate Limiting** - Prevent brute force attacks
- 🔒 **Helmet.js** - Security headers
- 🔒 **CORS** - Cross-origin resource sharing
- 🔒 **Data Sanitization** - MongoDB injection prevention
- 🔒 **Input Validation** - express-validator for request validation

### Performance & Reliability
- ⚡ **Response Compression** - Gzip compression
- ⚡ **Database Indexing** - Optimized queries
- ⚡ **Error Handling** - Centralized error management
- ⚡ **Logging** - Morgan HTTP request logger
- ⚡ **Graceful Shutdown** - Proper process termination

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to directory**
```bash
cd backend-node
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:3000
```

4. **Start MongoDB** (if using local)
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

5. **Seed database** (optional - loads sample data)
```bash
npm run seed
```

This creates:
- Sample products (perfumes, tea, coffee, etc.)
- Admin user: Mobile: `9999999999`, Password: `admin123`
- Test user: Mobile: `8888888888`, Password: `test123`

6. **Start server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "mobile": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "mobile": "9876543210",
    "role": "user"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "mobile": "9876543210",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/auth/updateprofile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith"
}
```

#### Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Product Routes

#### Get All Products
```http
GET /api/products?page=1&limit=20&keyword=perfume&sort=-price&productType=perfume
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `keyword` - Search in name/description
- `sort` - Sort by field (prefix with `-` for descending)
- `productType` - Filter by type: perfume, tea, coffee, etc.
- `category` - Filter by category
- `price[gte]` - Min price
- `price[lte]` - Max price

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 90,
  "pagination": {
    "page": 1,
    "limit": 20
  },
  "data": [...]
}
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Get Products by Type
```http
GET /api/products/type/perfume
```

#### Get Products by Collection
```http
GET /api/products/collection/summer
```

#### Get New Arrivals
```http
GET /api/products/filter/new-arrivals
```

#### Get Special Pricing Products
```http
GET /api/products/filter/special-pricing
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 1999,
  "specialPrice": 1499,
  "image": "image_url",
  "category": "Category Name",
  "productType": "perfume",
  "stock": 100,
  "gender": "unisex",
  "isNewArrival": true
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": 2499,
  "stock": 50
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer {admin_token}
```

### Cart Routes (All require authentication)

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer {token}
```

#### Add Item to Cart
```http
POST /api/cart
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2
}
```

#### Update Cart Item Quantity
```http
PUT /api/cart/:productId
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /api/cart/:productId
Authorization: Bearer {token}
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer {token}
```

### Order Routes (All require authentication)

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "product": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "mobile": "9876543210"
  },
  "paymentInfo": {
    "method": "cod"
  }
}
```

**Payment Methods:** `cod`, `card`, `upi`, `netbanking`

**Response:**
```json
{
  "success": true,
  "data": {
    "orderNumber": "ORD123456789",
    "items": [...],
    "pricing": {
      "itemsTotal": 5000,
      "shippingCharges": 0,
      "tax": 900,
      "totalAmount": 5900
    },
    "orderStatus": "pending"
  }
}
```

#### Get My Orders
```http
GET /api/orders
Authorization: Bearer {token}
```

#### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

#### Cancel Order
```http
PUT /api/orders/:id/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

#### Get All Orders (Admin Only)
```http
GET /api/orders/admin/all
Authorization: Bearer {admin_token}
```

#### Update Order Status (Admin Only)
```http
PUT /api/orders/:id/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "shipped",
  "note": "Shipped via FedEx"
}
```

**Order Statuses:** `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`

#### Get Order Statistics (Admin Only)
```http
GET /api/orders/admin/stats
Authorization: Bearer {admin_token}
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-06-28T10:30:00.000Z"
}
```

## 📁 Project Structure

```
backend-node/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product operations
│   │   ├── cartController.js    # Cart management
│   │   └── orderController.js   # Order processing
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── validators.js        # Request validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Cart.js              # Cart schema
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── products.js          # Product routes
│   │   ├── cart.js              # Cart routes
│   │   └── orders.js            # Order routes
│   ├── scripts/
│   │   └── seedDatabase.js      # Database seeding
│   ├── utils/
│   │   ├── apiFeatures.js       # Query helpers
│   │   ├── catchAsync.js        # Async error wrapper
│   │   └── errorResponse.js     # Custom error class
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🧪 Testing

Run tests:
```bash
npm test
```

## 🔒 Security Best Practices

1. **Environment Variables** - Never commit `.env` to version control
2. **JWT Secret** - Use strong, random secret in production
3. **HTTPS** - Use HTTPS in production
4. **Rate Limiting** - Configure appropriate limits
5. **CORS** - Restrict to trusted domains
6. **Input Validation** - All inputs are validated
7. **Password Requirements** - Minimum 6 characters

## 🚀 Deployment

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in production `.env`

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your-production-secret-key-make-it-very-long-and-random
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=https://your-frontend-domain.com
```

### Deploy Options
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Use App Platform
- **AWS**: EC2 or Elastic Beanstalk
- **Vercel/Netlify**: For serverless (requires adaptation)

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🐛 Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string
- Verify network access in Atlas

### JWT Error
- Check JWT_SECRET is set
- Verify token format: `Bearer {token}`
- Token might be expired

### Port Already in Use
```bash
# Find and kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 📞 Support

For issues or questions:
- Check existing API documentation
- Review error messages in console
- Verify environment variables
- Check MongoDB connection

## 📄 License

This project is private and not licensed for public use.

---

**Built with ❤️ using Node.js, Express, and MongoDB**
