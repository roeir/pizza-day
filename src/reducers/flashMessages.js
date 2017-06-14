import {v4} from "uuid";
import {ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE} from "../actions/types";

const flashMessages = (state = [], action) => {
  switch (action.type) {
    case ADD_FLASH_MESSAGE:
      return [
        ...state,
        {
          id: v4(),
          type: action.message.type,
          text: action.message.text
        }
      ];
    case DELETE_FLASH_MESSAGE:
      const index = state.findIndex(msg => msg.id === action.id);
      return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ];
    default:
      return state;
  }
};

export default flashMessages;