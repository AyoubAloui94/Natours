const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.use(viewsController.alerts);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/account', authController.protect, viewsController.getUserAccount);
router.get(
  '/my-bookings',
  authController.protect,
  viewsController.getUserBookings
);
router.get(
  '/my-reviews',
  authController.protect,
  viewsController.getUserReviews
);

router.get(
  '/my-reviews/:id',
  authController.protect,
  viewsController.getReview
);

router.get('/forgot-password', viewsController.getForgotPassword);

router.get('/reset-password/:token', viewsController.getResetPassword);
module.exports = router;
