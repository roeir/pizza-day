import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Provider} from "react-redux";
import decodeToken from 'jwt-decode';
import {configureStore} from "./configureStore";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./components/HomePage";
import SignupPage from "./components/signup/SignupPage";
import LoginPage from "./components/login/LoginPage";
import GroupsPage from './components/groups/GroupsPage';
import FlashMessagesList from './components/flash/FlashMessageList';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';
import requireAuth from './utils/requireAuth';

const store = configureStore();

try {
  if(localStorage['loginToken']) {
    const token = localStorage.getItem('loginToken');
    setAuthToken(token);
    store.dispatch(setCurrentUser(decodeToken(token)));
  }
} catch (err) {
  console.log(err);
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="page-wrap">
            <NavigationBar />
            <div className="container">
              <FlashMessagesList />
              <Route exact path="/" component={ HomePage }/>
              <Route path="/signup" component={ SignupPage }/>
              <Route path="/login" component={ LoginPage }/>
              <Route path="/groups" component={ requireAuth(GroupsPage) }/>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
