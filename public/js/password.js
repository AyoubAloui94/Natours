import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async (email, form) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/forgot-password`,
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        `A password reset token has been sent to your email.`,
        3
      );
      window.setTimeout(() => {
        form.innerHTML = `<p class="email__sent">Please follow the instructions sent to you via email in order to reset your password.</p><div  class="email__icon"><img src="/img/email-part-2-svgrepo-com.svg"></div>`;
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const resetPassword = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/reset-password/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', `Password changed successfully! Logging in...`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
