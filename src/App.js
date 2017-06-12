import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './configureStore';
import NavigationBar from './components/NavifationBar';
import HomePage from './components/pages/HomePage';
import SignupPage from './components/signup/SignupPage';
import LoginPage from './components/login/LoginPage';
import './styles/App.css';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="page-wrap">
            <NavigationBar />
            <div className="page-content">
              <Route exact path="/" component={ HomePage }/>
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
