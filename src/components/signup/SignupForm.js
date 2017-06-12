import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';

class SignupForm extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: {},
    isLoading: false
  };

  static propTypes = {
    userSignupRequest: PropTypes.func.isRequired
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  checkUserExists = (event) => {

  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { username, email, password, passwordConfirmation } = this.state;
    const payload = {
      username, email, password, passwordConfirmation
    };
    this.props.userSignupRequest(payload)
      .then(({ data }) => {
        console.log(data);
      })
      .catch(({ response }) => {
        console.log(response);
      })
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors
    } = this.state;

    return (
      <form onSubmit={ this.handleFormSubmit }>
        <h1>Join us to get moar pizza`s</h1>

        <TextFieldGroup
          value={ username }
          onChange={ this.handleInputChange }
          checkUserExists={ this.checkUserExists }
          name="username"
          label="Username"
          error={ errors.username }
        />

        <TextFieldGroup
          value={ email }
          checkUserExists={ this.checkUserExists }
          onChange={ this.handleInputChange }
          name="email"
          label="Email"
          error={ errors.email }
        />

        <TextFieldGroup
          value={ password }
          onChange={ this.handleInputChange }
          name="password"
          label="Password"
          type="password"
          error={ errors.password }
        />

        <TextFieldGroup
          value={ passwordConfirmation }
          onChange={ this.handleInputChange }
          name="passwordConfirmation"
          label="Password Confirmation"
          type="password"
          error={ errors.passwordConfirmation }
        />

        <div className="form-group">
          <button disabled={ this.state.isLoading } className="btn btn-primary btn-lg" type="submit">
            Sign up
          </button>
        </div>
        <p>Or:</p>
        <div className="form-group">
          <button disabled={ this.state.isLoading } className="btn btn-default btn-lg" type="button">
            Sign up with Google
          </button>
        </div>
      </form>
    );
  }
}

export default SignupForm;