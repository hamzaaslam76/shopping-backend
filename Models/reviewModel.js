const mongoose = require('mongoose');
const reviewshmeema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty ']
    },
    
        rating: {
            type: Number,
            min: 1,
            max:5
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required:[true, 'review must belong to a Tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:[true,'Review must belong to a User']
    }
    
},
    {
        toJSON: { virtuals: true },
        toObject:{virtuals:true}
    });


 reviewshmeema.index({ tour: 1, user: 1 }, { unique: true });

reviewshmeema.statics.calcAverageRating = async function (tourId)
{
    console.log("id",tourId)
    const stats = await this.aggregate([
        {
           $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg:'$rating' }
            }
        }
    ])
    console.log("hamza",stats)
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
            
        })
    } else {
        
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        
        })
    }
}
reviewshmeema.post('save', function () {
    // this points to the current document 
    this.constructor.calcAverageRating(this.tour);
});
reviewshmeema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});
reviewshmeema.post(/^findOneAnd/, async function () {
   
    //  this.findOne(); dies not work here, query has already executed
   await this.r.constructor.calcAverageRating(this.r.tour)
});
reviewshmeema.pre(/^find/, function (next) {
  
    // this.populate({
    //     path: 'tour',
    //     select:'name'
    // }).populate({
    //     path: 'user',
    //     select:'name photo'
    // })
    this.populate({
        path: 'user',
        select:'name photo'
    })
    next();

})
const Review = mongoose.model('Review', reviewshmeema);
module.exports = Review;