/* eslint-disable */
import { displayMap } from './mapbox';
import { login, logout } from './login.js';
import { signup } from './signup';
import { updateData } from './update';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM elements
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const updateUserForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');
const mapBox = document.querySelector('#map');
const logoutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.querySelector('#book-tour');
const { alertMessage } = document.querySelector('body').dataset;

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

if (alertMessage) {
  showAlert('success', alertMessage, 20);
}
