require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists:');
      console.log(`  Mobile: ${existingAdmin.mobile}`);
      console.log(`  Name: ${existingAdmin.name}`);
      console.log('\nTo create a new admin, delete the existing one first or modify this script.');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Admin User',
      mobile: '9999999999',
      password: 'admin123',
      role: 'admin'
    };

    const admin = await User.create(adminData);
    console.log('✓ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`  Mobile: ${adminData.mobile}`);
    console.log(`  Password: ${adminData.password}`);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
