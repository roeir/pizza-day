import {combineReducers} from "redux";
import flashMessages from "./flashMessages";
import auth from './auth';

const rootReducer = combineReducers({
  auth,
  flashMessages
});

export default rootReducer;