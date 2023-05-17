const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const handlerFactory = require('./handlerFactory');
const User = require('../models/userModel');

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
            `${req.protocol}://${req.get('host')}/img/tours/${
              bookedTour.imageCover
            }`,
          ],
        },
      },
    },
  ];
  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${bookedTour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-bookings`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${bookedTour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: bookedTour.price * 100,
          product_data: {
            name: `${bookedTour.name} Tour`,
            description: bookedTour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                bookedTour.imageCover
              }`,
            ],
          },
        },
      },
    ],
    mode: 'payment',
  });
  // create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // temporary
//   const { tour, user, price } = req.query;
//   if (!tour || !user || !price) return next();

//   await Booking.create({
//     tour,
//     user,
//     price,
//   });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = catchAsync(async (session) => {
  try {
    console.log(session);
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email }))._id;
    const price = session.line_items[0].price_data.unit_amount / 100;

    await Booking.create({
      tour,
      user,
      price,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);
  res.status(200).json({ received: true });
};

exports.deleteBooking = handlerFactory.deleteOne(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);
exports.createBooking = handlerFactory.createOne(Booking);
exports.getAllBookings = handlerFactory.getAll(Booking);
exports.getSingleBooking = handlerFactory.getOne(Booking);
