import axios from 'axios';

export const createMenuItem = (item) => {
  return (dispatch) => {
    return axios.post('/api/menu', item);
  }
};

export const fetchMenuList = () => {
  return (dispatch) => {
    return axios.get('/api/menu');
  };
};