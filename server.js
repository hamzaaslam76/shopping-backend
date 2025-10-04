const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

// Prefer local DB when available (useful for development), otherwise fall back to Atlas
const isDevelopment = (process.env.NODE_ENV || '').toLowerCase() === 'development';
let DB = process.env.LOCAL_DATABASE && isDevelopment ? process.env.LOCAL_DATABASE : process.env.DATABASE;
// If the DATABASE string contains the <PASSWORD> placeholder and we have a password, replace it; otherwise use as-is
if (DB && DB.includes('<PASSWORD>') && process.env.DATABASE_PASSWORD) {
    DB = DB.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
}
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log(`catch unhandle expection`);
    process.exit(1); 
});
mongoose.connect(DB).then(con => {
    console.log("connaction is successfuly");
}).catch((err) => console.error("❌ MongoDB connection error:", err));;
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