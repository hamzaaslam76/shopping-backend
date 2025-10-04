const Review = require('../Models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const catchASYNC = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');



// exports.getAllReview = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if (req.params.tourId) filter = { tour: req.params.tourId }
//     const reviews = await Review.find(filter);
//     res.status(200).json({
//         status: 'success',
//         result: reviews.length,
//         data: {
//             reviews
//         }
//     })
// });

exports.setTourUserId = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next()
}

// exports.createReview = catchAsync(async (req, res, next) => {
//     // allow nested route
    
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     })
// });
exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.create(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);