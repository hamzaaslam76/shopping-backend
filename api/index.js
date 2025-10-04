const app = require('../app');
const connectDB = require('../utils/database');

// Ensure database connection before handling requests
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('✅ Database connected for serverless function');
    return;
  }
  
  try {
    await connectDB();
    isConnected = true;
    console.log('✅ Database connected for serverless function');
  } catch (error) {
    console.error('❌ Database connection failed in serverless function:', error);
    throw error;
  }
};

// Handle the request
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};
