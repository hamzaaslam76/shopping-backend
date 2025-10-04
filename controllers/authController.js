const User = require('../Models/userModel');
const crypto = require('crypto');
const { promisify} = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
   return  jwt.sign({ id }, process.env.JWT_SECRET, {
     expiresIn:process.env.JWT_EXPIRES_IN
    });
    
};
const createSendToken = (user, statuscode, res) => {
    const Token = signToken(user._id);
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOption.secure = true
    res.cookie('jwt', Token, cookieOption)
    // remove password from output
    user.password = undefined
    res.status(statuscode).json({
        status: 'success',
        Token,
        data: {
            user
        }
    });
}
exports.signup = catchAsync(async (req, res, next) => {
    const newuser = await User.create(req.body);
    createSendToken(newuser, 201, res);
    
});
exports.Login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1 check if email and password is exist
    if (!email || !password)
    {
        next(new appError('email and password not be a null'), 400);     
    }
    // 2 check if user exist and password correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || ! await user.correctPassword(password, user.password))
    {
        return next(new appError('Incorrect email or Password',401));
        }
   // 3 if every thing is ok, send token to client 
    const token =signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
        data: {
              user        
        }
    });
    
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // Getting Token and check of it ,s there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; 
    }
    if (!token) {
        return next(new appError('you are not logged in! Please log into get access',401));
    }
    // varification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new appError('Ther user beloning to this token does no longer exist',401));
    }
    // check if user changed the password after the tokrn was issued
    if (currentUser.changedPasswordAfter(decoded.iat))
    {
        return next(new appError('user resently changed password!please log in again',401));
    }
    // GRANT access  to  ptoruct route
    req.user = currentUser;
    next();   
});

exports.restrictTo = (...roles) => {
    return (req, re, next) => {
        console.log(req.user)
        if (!roles.includes(req.user.roule)) {
            return next(new appError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

exports.forgetpassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user)
    {
        return next(new appError('There is no user with emailaddress', 404));
    }
   // console.log(user._conditions.email);
    //Genrate the random reset token
    const resettoken = user.createPasswordresetToken();
    await user.save({ validateBeforeSave: false });
    //Send it to the user email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetpassword/${resettoken}`;
    const message = `Forget your password?Submit a patch request with your new password and password confirmed to: ${resetUrl}
    .\n if you did not get your password Plesae ignore this email`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'user password reset token (valid for 10 mint)',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token send to email'
        });
    }
    catch (err)
    {
        user.passwordresettoken = undefined;
        user.passwordresetExpire = undefined;
        await user.save({ validateBeforeSave: false });
       return next(new appError('There was an error sending the email.Try again later ',500));
    }
});
exports.resetpassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    // Get User based on the token
    const user = await User.findOne({ passwordresettoken: hashedToken, passwordresetExpire: { $gt: Date.now() } });
    // if token has not expired and there is user , set the new password
    if (!user){
        return next(new appError('Token is invalid or has expired ', 400));
    }
    user.password = req.body.password;
    user.confiramPassword = req.body.confiramPassword;
    user.passwordresettoken = undefined;
    user.passwordresetExpire = undefined;
    await user.save();
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // get user from collaction
    const user = await User.findOne( req.body.id).select('+password');
    // check posted password is correct
    if (! await user.correctPassword(req.body.passwordCurrent, user.password)){
        return next(new appError("Your current password is wrong.", 401));
    }
    // if so update password
  
    user.password = req.body.password;
    user.confiramPassword = req.body.confiramPassword;
   await user.save();


    //log user in send jwt
    createSendToken(user, 200, res);
    
});
