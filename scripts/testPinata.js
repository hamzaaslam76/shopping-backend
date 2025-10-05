// Load environment variables
require('dotenv').config({ path: './config.env' });

const pinataService = require('../utils/pinataService');
const path = require('path');

async function testPinataConnection() {
  console.log('🔍 Testing Pinata connection...');
  
  try {
    // Test authentication
    const isAuthenticated = await pinataService.testConnection();
    
    if (isAuthenticated) {
      console.log('✅ Pinata authentication successful!');
      
      // Get account info
      const accountInfo = await pinataService.getAccountInfo();
      console.log('📊 Account Information:');
      console.log(`   - Pinned Items: ${accountInfo.pin_count}`);
      console.log(`   - Total Size: ${(accountInfo.pin_size / 1024 / 1024).toFixed(2)} MB`);
      
    } else {
      console.log('❌ Pinata authentication failed!');
      console.log('Please check your PINATA_API_KEY and PINATA_SECRET_API_KEY in config.env');
    }
    
  } catch (error) {
    console.error('❌ Error testing Pinata connection:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure you have a Pinata account at https://pinata.cloud');
    console.log('2. Get your API keys from the Pinata dashboard');
    console.log('3. Update config.env with your actual API keys');
    console.log('4. Ensure your Pinata account has sufficient credits');
  }
}

// Run the test
testPinataConnection().then(() => {
  console.log('\n🎉 Pinata test completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
