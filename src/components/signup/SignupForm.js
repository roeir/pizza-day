import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import {withRouter} from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';


const validateInput = (data) => {
  const errors = {};

  forEach(data, (value, key) => {
    if (Validator.isEmpty(value)) {
      errors[key] = `The ${ key } field is required`;
    }
  });

  if (!Validator.isEmail(data.email)) {
    errors.email = 'The email field is invalid';
  }

  if (!Validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};

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
    userSignupRequest: PropTypes.func.isRequired,
    checkUserExist: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  checkUserExists = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    const errors = {...this.state.errors};
    if (!value.trim().length) {
      return;
    }
    this.props.checkUserExist(value).then(({data}) => {
      if (data) {
        errors[field] = 'There is a user with such ' + field;
        this.setState({
          errors
        });
      } else {
        errors[field] = '';
        this.setState({
          errors
        })
      }
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const {username, email, password, passwordConfirmation} = this.state;
    const payload = {
      username, email, password, passwordConfirmation
    };
    const {errors, isValid} = validateInput(payload);
    if (!isValid) {
      this.setState({
        errors
      });
      return;
    }
    this.setState({
      errors: {},
      isLoading: true
    });
    this.props.userSignupRequest(payload)
      .then(({data}) => {
        if (data.success) {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You have sign up successfully. Welcome!'
          });
          this.props.history.push('/');
        }
      })
      .catch(({response}) => {
        this.setState({
          errors: response.data,
          isLoading: false
        });
      });
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
          checkDataExists={ this.checkUserExists }
          name="username"
          label="Username"
          error={ errors.username }
        />

        <TextFieldGroup
          value={ email }
          checkDataExists={ this.checkUserExists }
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
      </form>
    );
  }
}

export default withRouter(SignupForm);