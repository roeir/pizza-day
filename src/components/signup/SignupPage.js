import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {userSignupRequest, isUserExist} from '../../actions/signupActions';
import {addFlashMessage} from '../../actions/flashMessages';
import SignupForm from './SignupForm';

const SignupPage = (props) => {
  const {userSignupRequest, isUserExist, addFlashMessage} = props;

  return (
    <div className="signup-page">
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <SignupForm
            userSignupRequest={ userSignupRequest }
            checkUserExist={ isUserExist }
            addFlashMessage={ addFlashMessage }
          />
        </div>
      </div>
    </div>
  );
};

SignupPage.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  isUserExist: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
};

export default connect(null,
  {
    userSignupRequest,
    isUserExist,
    addFlashMessage
  }
)(SignupPage);