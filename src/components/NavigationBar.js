import React from "react";
import {Link} from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-logo">
          <Link to="/">
            <span>Pizza</span>Day
          </Link>
        </div>
        <nav className="site-nav">
          <ul className="site-nav__list">
            <li className="site-nav__item">
              <Link to="/signup">Sign up</Link>
            </li>
            <li className="site-nav__item">
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;