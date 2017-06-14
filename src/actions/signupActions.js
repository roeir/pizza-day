import axios from 'axios';

export const userSignupRequest = (signupData) => {
  return (dispatch) => {
    return axios.post('/api/users', signupData);
  };
};

export const isUserExist = (ident) => {
  return (dispatch) => {
    return axios.get(`/api/users/${ ident }`);
  };
};