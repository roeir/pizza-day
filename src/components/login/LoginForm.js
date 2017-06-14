import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import { login } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';


const validateInput = (data) => {
  const errors = {};

  forEach(data, (value, key) => {
    if(Validator.isEmpty(value)) {
      errors[key] = `The ${ key } field is required`;
    }
  });

  return {
    errors,
    isValid: isEmpty(errors)
  }
};

class LoginForm extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    ident: '',
    password: '',
    errors: {},
    isLoading: false
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  isValid = () => {

  };

  onSubmit = (event) => {
    event.preventDefault();

    const { ident, password } = this.state;
    const payload = { ident, password };
    const { errors, isValid } = validateInput(payload);

    if(!isValid) {
      this.setState({
        errors
      });
      return;
    }

    this.setState({
      errors: {},
      isLoading: true
    });

    this.props.login(payload).then(() => {
      this.props.history.push('/');
    }).catch(({ response: { data } }) => {
      this.setState({
        errors: data.errors,
        isLoading: false
      });
    });

  };

  render() {
    const {ident, password, errors, isLoading} = this.state;

    return (
      <form onSubmit={ this.onSubmit }>
        <h1>Login</h1>
        { errors.form && <div className="alert alert-danger">{ errors.form }</div> }
        <TextFieldGroup
          name="ident"
          value={ ident }
          label="Username / Email"
          error={ errors.ident }
          onChange={ this.onChange }
        />

        <TextFieldGroup
          name="password"
          value={ password }
          label="Password"
          error={ errors.password }
          onChange={ this.onChange }
          type="password"
        />

        <div className="form-group">
          <button disabled={ isLoading } className="btn btn-primary btn-lg" type="submit">
            Login
          </button>
        </div>
        <p>Or:</p>
        <div className="form-group">
          <button disabled={ isLoading } className="btn btn-default btn-lg" type="button">
            Login with Google
          </button>
        </div>
      </form>
    );
  }
}

export default withRouter(connect(null,
  {
    login
  }
)(LoginForm));