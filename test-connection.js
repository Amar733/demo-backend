require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('\n✅ SUCCESS! Connected to MongoDB Atlas');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
  
  // List collections
  return mongoose.connection.db.listCollections().toArray();
})
.then((collections) => {
  console.log('\n📦 Collections found:');
  collections.forEach(col => {
    console.log(`   - ${col.name}`);
  });
  
  // Count documents
  return Promise.all([
    mongoose.connection.db.collection('products').countDocuments(),
    mongoose.connection.db.collection('users').countDocuments(),
    mongoose.connection.db.collection('carts').countDocuments(),
    mongoose.connection.db.collection('orders').countDocuments(),
  ]);
})
.then(([products, users, carts, orders]) => {
  console.log('\n📊 Document counts:');
  console.log(`   Products: ${products}`);
  console.log(`   Users: ${users}`);
  console.log(`   Carts: ${carts}`);
  console.log(`   Orders: ${orders}`);
  
  console.log('\n✨ All tests passed!\n');
  process.exit(0);
})
.catch((error) => {
  console.error('\n❌ Connection Failed:', error.message);
  console.error('\n📋 Common Solutions:');
  console.error('   1. Whitelist your IP in MongoDB Atlas Network Access');
  console.error('   2. Verify username and password are correct');
  console.error('   3. Check if cluster is active (not paused)');
  console.error('   4. Ensure stable internet connection\n');
  process.exit(1);
});
