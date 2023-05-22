import axios from 'axios';
import { showAlert } from './alerts';

// type is either data or password
export const updateData = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? '/api/v1/users/update-me'
        : '/api/v1/users/update-my-password';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      // window.setTimeout(() => {
      //   location.assign('/account');
      // }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const updateReview = async (rating, review, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${id}`,
      data: {
        rating,
        review,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', `Review updated successfully!`);
      window.setTimeout(() => {
        location.assign('/my-reviews');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const deleteReview = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${id}`,
    });

    showAlert('success', `Review deleted successfully!`);
    window.setTimeout(() => {
      location.assign('/my-reviews');
    }, 1500);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
