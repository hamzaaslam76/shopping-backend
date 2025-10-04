const fs = require('fs');
const path= require('path')
const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const Userroute = require('./Routers/userroutes');
const reviewRoute = require('./Routers/reviewRouter');
const categoryRoutes = require('./Routers/categoryRoutes');
const productRoutes = require('./Routers/productRoutes');
const cartRoutes = require('./Routers/cartRoutes');
const orderRoutes = require('./Routers/orderRoutes');
const couponRoutes = require('./Routers/couponRoutes');
const addressRoutes = require('./Routers/addressRoutes');
const customerRoutes = require('./Routers/customerRoutes');
const emailRoutes = require('./Routers/emailRoutes');
const AppError = require('./utils/appError');
const app = express();
const globalErrorHandal = require('./controllers/erroeController');

app.use(express.static('./public'));
// CORS for Next.js dashboard and Customer app
const corsOptions = {
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
};
app.use(cors());
app.options('*', cors(corsOptions));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './public/uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// set security HTTP headers
app.use(helmet())
//middle ware use
 // development logging
if (process.env.Node_ENV === 'development') {
    
    console.log("development");
}

// global middleware use 
//const limiter = rateLimit({
    //max: 100,
   // windowMs: 60 * 60 * 1000,
 //   message:'To many request from this api , please try again in an hour,'
//})
 // limit request for same api
//app.use('/api', limiter);
// Body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSql injection
app.use(mongoSanitize());

// data sanitization against NoSql injection
app.use(xss());
// prevent  parameter pollution
app.use(hpp({
    whitelist:['duration']
}));

// serving static file
app.use(express.static('./public'));

app.use((req, res, next) => {
    console.log("midalware is call");
    next();
});
// test middleware
app.use((req, res, next) => { 
    res.requestTime = new Date().toISOString();
    next();
});  

// view routes
app.get('/', (req, res) => {
    res.status(200).render('base');
})



// end route
app.use('/api/v1/user', Userroute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/customer', customerRoutes);
app.use('/api/v1/emails', emailRoutes);
// middeware error handle not matching route
app.all('*', (req, res, next) => {
    next(new AppError(`can not find ${req.originalUrl} on this server `,400));
});
// Global error handle middaware
app.use(globalErrorHandal);

//app.get('/api/v1/tours',getalltours );
//app.get('/api/v1/tours/:id',gettours );
//app.post('/api/v1/tours',createtours);
//app.delete('/api/v1/tours/:id',deletetours);

// server
module.exports = app;
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });