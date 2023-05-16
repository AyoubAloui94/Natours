const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get the booked tour
  const bookedTour = await Tour.findById(req.params.tourId);

  const transformedItems = [
    {
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: bookedTour.price * 100,
        product_data: {
          name: `${bookedTour.name} Tour`,
          description: bookedTour.summary,
          images: [
            `https://www.natours.dev/img/tours/${bookedTour.imageCover}`,
          ],
        },
      },
    },
  ];
  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${bookedTour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${bookedTour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: transformedItems,
    mode: 'payment',
  });
  // create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // temporary
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();

  await Booking.create({
    tour,
    user,
    price,
  });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.deleteBooking = handlerFactory.deleteOne(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);
exports.createBooking = handlerFactory.createOne(Booking);
exports.getAllBookings = handlerFactory.getAll(Booking);
exports.getSingleBooking = handlerFactory.getOne(Booking);
