const connectDB = require('./utils/database');
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...');
  
  try {
    await connectDB();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const User = mongoose.model('User', new mongoose.Schema({ name: String }));
    const count = await User.countDocuments();
    console.log(`📊 Found ${count} users in database`);
    
    console.log('🎉 Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
