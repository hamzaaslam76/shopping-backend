const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const connectDB = require('./utils/database');

// Prefer local DB when available (useful for development), otherwise fall back to Atlas
const isDevelopment = (process.env.NODE_ENV || '').toLowerCase() === 'development';
let DB = process.env.LOCAL_DATABASE && isDevelopment ? process.env.LOCAL_DATABASE : process.env.DATABASE;
// If the DATABASE string contains the <PASSWORD> placeholder and we have a password, replace it; otherwise use as-is
if (DB && DB.includes('<PASSWORD>') && process.env.DATABASE_PASSWORD) {
    DB = DB.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
}

// Set the DATABASE environment variable for the connection handler
process.env.DATABASE = DB;

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log(`catch unhandle expection`);
    process.exit(1); 
});

// Connect to database
connectDB().catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
});
//console.log(process.env);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandal rejection');
    server.close(() => {
        process.exit(1); 
    });
});