const { getAllReview, createReview ,deleteReview, updateReview ,setTourUserId, getReview } = require('../controllers/reviewController'); 
const {protect,restrictTo} =require('../controllers/authController')
const express = require('express');
const route = require('./userroutes');
// {mergeParams:true} use when access id another route
const router = express.Router({ mergeParams: true });

// // POST /tour/343443gf/reviews
// // Get /tour/122323ds/reviews
// // Get /tour/3222222d/reviews/2332ds
route.use(protect);
router
    .route('/')
    .get(getAllReview)
    .post(restrictTo('user'), setTourUserId, createReview);
router
    .route('/:id')
    .get(getReview)
    .patch(restrictTo('user','admin'), updateReview)
    .delete(restrictTo('user','admin') , deleteReview);

module.exports = router;