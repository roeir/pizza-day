import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './configureStore';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import SignupPage from './components/signup/SignupPage';
import LoginPage from './components/login/LoginPage';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="page-wrap">
            <NavigationBar />
            <div className="container">
                <Route exact path="/" component={ HomePage } />
                <Route path="/signup" component={ SignupPage } />
                <Route path="/login" component={ LoginPage } />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
