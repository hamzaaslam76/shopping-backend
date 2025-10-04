const catchAsync = require('../utils/catchAsync');
const User = require('../Models/userModel');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');
const filterObj = (obj,...allowedField) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedField.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
}
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.getUser = factory.getOne(User);
exports.getAlluser = catchAsync(async (req, res, next) => {
     
    const user = await User.find();
    res.status(200).json({
        status: "success",
        user
        
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1  Create error if user post password data
    if (req.body.password || req.body.confiramPassword){
        return next(new AppError("This route  is not for update password ", 401));
        }
    // Filtered out unwanted fields name that are not be allowed to update
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 2 Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators:true
    })
    res.status(201).json({
        status: "success",
        updatedUser
        
    });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
    const deleteUser = await User.findByIdAndUpdate(req.user.id, { active : false });
    res.status(200).json({
        status: 'success',
        message:"delete data",
        deleteUser
    });
});
