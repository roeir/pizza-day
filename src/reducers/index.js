import {combineReducers} from "redux";
import flashMessages from "./flashMessages";
import auth from './auth';
import cart from './cart';

const rootReducer = combineReducers({
  auth,
  flashMessages,
  cart
});

export default rootReducer;