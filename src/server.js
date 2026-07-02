require('dotenv').config();
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
