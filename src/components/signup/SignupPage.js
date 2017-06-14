import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userSignupRequest } from '../../actions/signupActions';
import SignupForm from './SignupForm';

const SignupPage = (props) => {
  const { userSignupRequest } = props;

  return (
    <div className="signup-page">
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <SignupForm
            userSignupRequest={ userSignupRequest }
          />
        </div>
      </div>
    </div>
  );
};

SignupPage.propTypes = {
  userSignupRequest: PropTypes.func.isRequired
};

export default connect(null,
  {
    userSignupRequest
  }
)(SignupPage);