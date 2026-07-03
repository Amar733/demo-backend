const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file (for local development)
// In production (Render), environment variables are set in the dashboard
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease set these environment variables:');
  console.error('- For local development: Add them to backend-node/.env file');
  console.error('- For production (Render): Set them in the Render dashboard under Environment tab');
  process.exit(1);
}

const app = require('./app');
const connectDB = require('./config/database');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 E-Commerce Backend Server                    ║
║                                                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
║   Port: ${PORT}                                      ║
║   Database: MongoDB                                ║
║                                                    ║
║   📝 API Documentation:                            ║
║   Health: http://localhost:${PORT}/health           ║
║   Auth: http://localhost:${PORT}/api/auth           ║
║   Products: http://localhost:${PORT}/api/products   ║
║   Cart: http://localhost:${PORT}/api/cart           ║
║   Orders: http://localhost:${PORT}/api/orders       ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
