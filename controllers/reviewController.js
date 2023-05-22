const Review = require('../models/reviewModel');
const catchAsync = require('../utilities/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = handlerFactory.getAll(Review);
exports.getSingleReview = handlerFactory.getOne(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);

// New
exports.getAllReviewsFromUser = catchAsync(async (req, res, next) => {
  const userReviews = await Review.find({ user: req.params.userId });

  res.status(200).json({
    status: 'success',
    results: userReviews.length,
    data: {
      userReviews,
    },
  });
});
