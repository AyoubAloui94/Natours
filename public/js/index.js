/* eslint-disable */
import { displayMap } from './mapbox';
import { login, logout } from './login.js';
import { signup } from './signup';
import { updateData, updateReview, deleteReview } from './update';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { forgotPassword, resetPassword } from './password';

// DOM elements
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const updateUserForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');
const updateReviewForm = document.querySelector('.form-update-review');
const forgetPasswordForm = document.querySelector('.form--forget-password');
const resetPasswordForm = document.querySelector('.form--reset-password');
const mapBox = document.querySelector('#map');
const logoutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.querySelector('#book-tour');
const accReviews = document.querySelector('.account__reviews');
const deleteReviewBtn = document.querySelector('.btn--red');

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (updateUserForm) {
  updateUserForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);

    updateData(form, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    document.querySelector('.btn--save-password').innerHTML = 'Saving...';

    const passwordCurrent = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    await updateData(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';

    document.querySelector('.btn--save-password').innerHTML = 'Save password';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (evt) => {
    evt.target.textContent = 'Processing...';
    const { tourId } = evt.target.dataset;
    bookTour(tourId);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) {
  showAlert('success', alertMessage, 20);
}

if (accReviews) {
  accReviews.addEventListener('click', (evt) => {
    const updateBtn = evt.target.closest('.btn__update');
    if (!updateBtn) return;
  });
}

if (updateReviewForm) {
  updateReviewForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    document.querySelector('.btn--update').textContent = 'Saving...';
    const rating = document.querySelector('#user-rating').value;
    const review = document.querySelector('#user-review').value;
    const { id } = document.querySelector('.btn--update').dataset;
    // const id = window.location.href.split('/my-reviews/')[1];
    await updateReview(rating, review, id);
  });
}

if (deleteReviewBtn) {
  deleteReviewBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    evt.target.textContent = 'Deleting...';
    // const id = window.location.href.split('/my-reviews/')[1];
    const { id } = document.querySelector('.btn--update').dataset;
    await deleteReview(id);
  });
}

if (forgetPasswordForm) {
  forgetPasswordForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const email = document.querySelector('#email').value;
    await forgotPassword(email, forgetPasswordForm);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    // const token = window.location.href.split('/reset-password/')[1];
    const { token } = document.querySelector('.btn--green').dataset;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;
    await resetPassword(token, password, passwordConfirm);
  });
}
