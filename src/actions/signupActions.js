import axios from 'axios';

export const userSignupRequest = (signupData) => {
  return (dispatch) => {
    return axios.post('/api/users', signupData);
  };
};