import axios from 'axios';
import decodeToken from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { SET_CURRENT_USER } from './types';

export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    user
  };
};

export const login = (payload) => {
  return (dispatch) => {
    return axios.post('/api/auth', payload)
      .then(({ data: { token } }) => {
        try {
          localStorage.setItem('loginToken', token);
        } catch (err) {
          console.log(err);
        }

        setAuthToken(token);
        dispatch(setCurrentUser(decodeToken(token)));
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    try {
      localStorage.removeItem('loginToken');
    } catch (err) {
      console.log(err);
    }
    setAuthToken(null);
    dispatch(setCurrentUser(null));
  }
};