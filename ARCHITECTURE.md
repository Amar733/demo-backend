# Backend Architecture

## System Overview

This is a production-level Node.js/Express backend following MVC architecture with clean separation of concerns, comprehensive security, and scalability features.

## Tech Stack

### Core
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

### Security
- **Helmet.js** - Security headers
- **bcryptjs** - Password hashing
- **express-rate-limit** - DDoS protection
- **express-mongo-sanitize** - NoSQL injection prevention
- **express-validator** - Input validation
- **CORS** - Cross-origin control

### Performance
- **compression** - Gzip response compression
- **MongoDB indexing** - Optimized queries
- **Pagination** - Efficient data loading

### Development
- **nodemon** - Auto-restart
- **morgan** - HTTP logging
- **ESLint** - Code quality

## Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│                   Client (Frontend)                  │
└─────────────────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────┐
│                  Express Middleware                  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Security (Helmet, CORS, Rate Limit)          │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Body Parser & Cookie Parser                   │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Request Validation (express-validator)        │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Authentication (JWT)                          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                      Routes                          │
│  ┌────────┬────────┬────────┬────────┐            │
│  │  Auth  │Product │  Cart  │ Orders │            │
│  └────────┴────────┴────────┴────────┘            │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Controllers                        │
│  ┌──────────────────────────────────────────────┐  │
│  │ Business Logic & Request Handling             │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                     Models                           │
│  ┌────────┬────────┬────────┬────────┐            │
│  │  User  │Product │  Cart  │ Order  │            │
│  └────────┴────────┴────────┴────────┘            │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                  MongoDB Database                    │
└─────────────────────────────────────────────────────┘
```

## Directory Structure

```
backend-node/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # MongoDB connection setup
│   │
│   ├── controllers/         # Route handlers (Business Logic)
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication & authorization
│   │   ├── errorHandler.js  # Global error handling
│   │   └── validators.js    # Request validation rules
│   │
│   ├── models/              # Database schemas
│   │   ├── User.js          # User model with auth methods
│   │   ├── Product.js       # Product model
│   │   ├── Cart.js          # Cart model
│   │   └── Order.js         # Order model
│   │
│   ├── routes/              # API route definitions
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   │
│   ├── scripts/             # Utility scripts
│   │   └── seedDatabase.js  # Database seeding
│   │
│   ├── utils/               # Helper functions
│   │   ├── apiFeatures.js   # Query building (search, filter, paginate)
│   │   ├── catchAsync.js    # Async error wrapper
│   │   └── errorResponse.js # Custom error class
│   │
│   ├── app.js               # Express app configuration
│   └── server.js            # Server startup & error handling
│
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── .gitignore
├── .eslintrc.json           # ESLint configuration
├── package.json
├── postman_collection.json  # API testing collection
├── README.md                # Main documentation
├── QUICKSTART.md            # Quick setup guide
└── ARCHITECTURE.md          # This file
```

## Data Flow

### 1. Authentication Flow
```
User → POST /api/auth/register
       ↓
    Validation (validators.js)
       ↓
    authController.register()
       ↓
    Hash password (bcrypt)
       ↓
    Save to MongoDB (User model)
       ↓
    Generate JWT token
       ↓
    Response with token
```

### 2. Protected Route Flow
```
User → GET /api/cart (with Bearer token)
       ↓
    protect middleware (auth.js)
       ↓
    Verify JWT token
       ↓
    Load user from database
       ↓
    Attach user to req.user
       ↓
    cartController.getCart()
       ↓
    Query Cart collection
       ↓
    Populate product details
       ↓
    Response with cart data
```

### 3. Order Creation Flow
```
User → POST /api/orders
       ↓
    protect middleware
       ↓
    createOrderValidation
       ↓
    orderController.createOrder()
       ↓
    Validate stock availability
       ↓
    Calculate pricing (items + shipping + tax)
       ↓
    Create order in MongoDB
       ↓
    Update product stock
       ↓
    Clear user cart
       ↓
    Response with order details
```

## Database Schema

### User Schema
```javascript
{
  name: String,
  mobile: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  addresses: [AddressSchema],
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  specialPrice: Number,
  image: String,
  images: [String],
  category: String,
  productType: String (enum),
  stock: Number,
  collection: String,
  isNewArrival: Boolean,
  gender: String,
  isActive: Boolean,
  ratings: { average: Number, count: Number },
  views: Number,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- text index on (name, description)
- compound index on (productType, category)
- index on isNewArrival
- index on collection
```

### Cart Schema
```javascript
{
  user: ObjectId (ref: User, unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  total: Number,
  lastModified: Date,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- index on user
```

### Order Schema
```javascript
{
  user: ObjectId (ref: User),
  orderNumber: String (unique, auto-generated),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    street, city, state, pincode, mobile
  },
  paymentInfo: {
    method, status, transactionId, paidAt
  },
  pricing: {
    itemsTotal, shippingCharges, tax, discount, totalAmount
  },
  orderStatus: String (enum),
  statusHistory: [{ status, timestamp, note }],
  deliveryDate: Date,
  cancelReason: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- compound index on (user, createdAt)
- index on orderNumber
- index on orderStatus
```

## Security Features

### 1. Authentication
- JWT-based stateless authentication
- Tokens stored in httpOnly cookies (XSS protection)
- Token expiration (configurable)
- Password hashing with bcrypt (10 salt rounds)

### 2. Authorization
- Role-based access control (RBAC)
- Middleware to restrict routes by role
- Owner verification for sensitive operations

### 3. Input Validation
- express-validator for all inputs
- Mongoose schema validation
- MongoDB injection prevention
- XSS protection via sanitization

### 4. Rate Limiting
- Configurable request limits
- Per-IP tracking
- Prevents brute force attacks

### 5. Security Headers
- Helmet.js for security headers
- CORS configuration
- Content Security Policy

## Error Handling

### Strategy
1. **Async Error Wrapper**: `catchAsync()` catches all async errors
2. **Centralized Handler**: All errors go through `errorHandler` middleware
3. **Error Types**:
   - Operational errors (400-499): Expected errors
   - Programming errors (500): Unexpected errors

### Error Response Format
```javascript
{
  success: false,
  error: "Error message",
  stack: "..." // Only in development
}
```

### Handled Error Types
- Mongoose CastError → 404 Not Found
- Mongoose ValidationError → 400 Bad Request
- Duplicate Key Error → 400 Already Exists
- JWT Error → 401 Unauthorized
- Custom ErrorResponse → Custom status code

## Performance Optimizations

### 1. Database
- **Indexes**: On frequently queried fields
- **Lean Queries**: Return plain objects when virtuals not needed
- **Select Fields**: Only fetch needed fields
- **Pagination**: Limit data transfer

### 2. API
- **Compression**: Gzip response bodies
- **Caching Headers**: Browser caching where appropriate
- **Connection Pooling**: MongoDB connection reuse

### 3. Code
- **Async/Await**: Non-blocking operations
- **Error Handling**: Graceful degradation
- **Logging**: Structured logging with Morgan

## API Features

### 1. Search & Filter
```javascript
// Search
GET /api/products?keyword=perfume

// Filter
GET /api/products?productType=coffee&category=Light%20Roast

// Price range
GET /api/products?price[gte]=1000&price[lte]=5000
```

### 2. Sorting
```javascript
// Sort by price ascending
GET /api/products?sort=price

// Sort by price descending
GET /api/products?sort=-price

// Multiple sorts
GET /api/products?sort=-isNewArrival,price
```

### 3. Pagination
```javascript
GET /api/products?page=2&limit=20
```

### 4. Field Selection
```javascript
GET /api/products?fields=name,price,image
```

## Scalability Considerations

### Horizontal Scaling
- Stateless JWT authentication (no session store)
- MongoDB supports sharding
- Load balancer ready

### Vertical Scaling
- Efficient queries with indexes
- Connection pooling
- Compression

### Future Enhancements
- Redis for caching
- Message queue (RabbitMQ/Redis)
- Microservices architecture
- CDN for images
- Search engine (Elasticsearch)

## Environment Variables

### Required
- `NODE_ENV` - development/production
- `PORT` - Server port
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - JWT signing key

### Optional
- `JWT_EXPIRE` - Token expiration (default: 7d)
- `CLIENT_URL` - CORS origin
- `RATE_LIMIT_*` - Rate limiting config

## Testing Strategy

### Unit Tests
- Model methods
- Utility functions
- Middleware logic

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### Load Testing
- Concurrent users
- Response times
- Database performance

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production MongoDB (Atlas)
- [ ] Enable HTTPS
- [ ] Set up monitoring (PM2/New Relic)
- [ ] Configure logging (Winston/Sentry)
- [ ] Set up backups
- [ ] Configure CI/CD
- [ ] Load testing
- [ ] Security audit

## Monitoring & Logging

### Recommended Tools
- **PM2**: Process management & monitoring
- **Winston**: Advanced logging
- **Sentry**: Error tracking
- **New Relic/DataDog**: APM
- **MongoDB Atlas**: Database monitoring

### Key Metrics
- Response times
- Error rates
- Database query performance
- Memory usage
- CPU usage
- Active connections

---

**Architecture designed for production readiness, scalability, and maintainability.**
