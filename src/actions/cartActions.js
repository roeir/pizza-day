import axios from 'axios';
import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, CLEAR_CART } from './types';

export const addItem = id => ({
  type: ADD_ITEM_TO_CART,
  id
});

export const removeItem = id => ({
  type: REMOVE_ITEM_FROM_CART,
  id
});

export const clearCart = () => ({
  type: CLEAR_CART
});

export const orderRequest = (eventId, order) => {
  return (dispatch) => {
    return axios.post(`/api/events/${ eventId }/order`, order);
  }
};