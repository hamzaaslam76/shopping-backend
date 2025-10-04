const express = require('express');

const { getAlluser,updateMe,deleteMe , getMe,getUser} = require('../controllers/userController');
const { signup,Login,forgetpassword,resetpassword,updatePassword,protect } = require('../controllers/authController');
const route = express.Router();


route.post('/signup', signup);
route.post('/login', Login);
route.post('/forgetpassword',forgetpassword);
route.patch('/resetpassword/:token', resetpassword);

// protect all routes after this middleware

route.use(protect)

route.get('/me', getMe, getUser)
route.patch('/updateMyPassword', updatePassword);
route.patch('/updateMe',  updateMe);
route.delete('/deleteMe', deleteMe);

route
    .route('/')
    .get(getAlluser);
module.exports = route;