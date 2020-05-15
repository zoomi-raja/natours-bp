import * as actionTypes from './actionTypes';
import axios from '../../../utils/Axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authFail = (msg) => {
  return {
    type: actionTypes.AUTH_FAIL,
    message: msg,
  };
};

export const clearError = () => {
  return {
    type: actionTypes.CLEAR_ERROR,
  };
};
export const auth = (email, password) => {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await axios.post('/users/login', {
        email: email,
        password: password,
      });
    } catch (err) {
      let msg = err.message;
      if (err && err.response && err.response.data) {
        msg = err.response.data.message;
      }
      dispatch(authFail(msg));
      setTimeout(() => {
        dispatch(clearError());
      }, 2000);
    }
  };
};
