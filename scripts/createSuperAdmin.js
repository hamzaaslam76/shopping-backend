const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../Models/userModel');

// Load environment variables
dotenv.config({ path: './config.env' });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  try {
    await connectDB();
    
    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: 'super@admin.com' });
    
    if (existingAdmin) {
      console.log('✅ Super Admin already exists!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`🔑 Role: ${existingAdmin.roule}`);
      console.log(`📱 Phone: ${existingAdmin.phone}`);
      console.log(`🟢 Active: ${existingAdmin.active}`);
      
      // Update password if needed
      console.log('\n🔄 Updating password...');
      existingAdmin.password = '12345678';
      existingAdmin.confiramPassword = '12345678';
      await existingAdmin.save();
      console.log('✅ Password updated successfully!');
    } else {
      // Create new super admin
      console.log('🔄 Creating Super Admin...');
      
      const superAdmin = await User.create({
        name: 'Super Admin',
        email: 'super@admin.com',
        phone: 1234567890,
        password: '12345678',
        confiramPassword: '12345678',
        roule: 'admin',
        active: true
      });
      
      console.log('✅ Super Admin created successfully!');
      console.log(`📧 Email: ${superAdmin.email}`);
      console.log(`👤 Name: ${superAdmin.name}`);
      console.log(`🔑 Role: ${superAdmin.roule}`);
      console.log(`📱 Phone: ${superAdmin.phone}`);
      console.log(`🟢 Active: ${superAdmin.active}`);
    }
    
    // Verify the admin exists and can login
    console.log('\n🔍 Verifying admin credentials...');
    const admin = await User.findOne({ email: 'super@admin.com' }).select('+password');
    
    if (admin && await admin.correctPassword('12345678', admin.password)) {
      console.log('✅ Login verification successful!');
      console.log('🎉 Super Admin is ready to use!');
    } else {
      console.log('❌ Login verification failed!');
    }
    
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the script
createSuperAdmin();
