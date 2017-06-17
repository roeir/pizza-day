import axios from "axios";

export const loadUserRequest = () => {
  return (dispatch) => {
    return axios.get('/api/users');
  };
};