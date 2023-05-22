const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from db
  const tours = await Tour.find();
  // build template
  // render template using tour data from db
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  let booked = false;
  if (res.locals.user) {
    const booking = await Booking.findOne({
      user: res.locals.user.id,
      tour: tour.id,
    });

    if (booking) booked = true;
  }

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

  res.status(200).render('tour', {
    title: tour.name,
    tour: tour,
    booked,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create An Account',
  });
};

exports.getUserAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My account',
  });
};

exports.getUserBookings = catchAsync(async (req, res, next) => {
  // find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // find tours
  const tourIDs = bookings.map((booking) => booking.tour);
  const tours = await Promise.all(
    tourIDs.map((tourId) => Tour.findById(tourId))
  );

  res.status(200).render('overview', {
    title: 'My Bookings',
    tours,
  });
});

exports.getUserReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
  });
  if (!reviews)
    return next(new AppError('You have not reviewed ant yours', 404));
  const reviewsArr = new Array(reviews);

  res.status(200).render('_userReviews', {
    title: 'My Reviews',
    reviews: reviewsArr[0],
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'tour',
  });

  res.status(200).render('_updateReview', {
    title: 'Review',
    review,
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;

  if (alert === 'booking') {
    res.locals.alert =
      'Your booking was successful! Please check your email for a confirmation. If your booking does not show up here immediately, please come back later.';
  }
  next();
};

exports.getForgotPassword = (req, res) => {
  res.status(200).render('forgetPassword', {
    title: 'Forgot your password?',
  });
};

exports.getResetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset password',
    token: req.params.token,
  });
};
