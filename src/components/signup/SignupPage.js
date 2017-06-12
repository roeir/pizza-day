import React from 'react';
import SignupForm from './SignupForm';

const SignupPage = () => {
  return (
    <div className="signup-page container">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <SignupForm/>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;