/* eslint-disable */

import axios from 'axios';
import catchAsync from '../../utilities/catchAsync';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51N8FwqBfgvbBIkoXt7c7KvA5CGQwT1AJTdEFJnvwx8OdowUFDCBZsbz0RwiKFvDibwwgfEleuNoq1ybnHjUhpE0Z00qhZM7mGj'
);

export const bookTour = async (tourId) => {
  try {
    // get checkout session from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // create checkout form + charge credit card}
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', err.message);
  }
};
