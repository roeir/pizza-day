import { ADD_ITEM_TO_CART, REMOVE_ITEM_FROM_CART, CLEAR_CART } from '../actions/types';

const cart = (state = {}, action) => {
  switch (action.type) {
    case ADD_ITEM_TO_CART:
      const newState = { ...state };
      if(newState[action.id]) {
        newState[action.id] += 1;
      } else {
        newState[action.id] = 1;
      }
      return newState;
    case REMOVE_ITEM_FROM_CART:
      const oldState = { ...state };
      delete oldState[action.id];
      return oldState;
    case CLEAR_CART:
      return {};
    default:
      return state;
  }
};

export default cart;
