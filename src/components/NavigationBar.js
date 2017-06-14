import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import "./NavigationBar.css";
import { logout } from '../actions/authActions';

const NavigationBar = (props) => {
  const { isAuthenticated } = props.auth;

  const guestLinks = (
    <ul className="site-nav__list">
      <li className="site-nav__item">
        <Link to="/signup">Sign up</Link>
      </li>
      <li className="site-nav__item">
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  const userLinks = (
    <ul className="site-nav__list">
      <li className="site-nav__item">
        <Link to="/" onClick={ event => { event.preventDefault(); props.logout(); } }>Logout</Link>
      </li>
    </ul>
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-logo">
          <Link to="/">
            <span>Pizza</span>Day
          </Link>
        </div>
        <nav className="site-nav">
          { isAuthenticated ? userLinks : guestLinks }
        </nav>
      </div>
    </header>
  );
};

NavigationBar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  {
    logout
  }
)(NavigationBar);