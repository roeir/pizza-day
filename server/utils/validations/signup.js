const Validator = require('validator');
const isEmpty = require('lodash/isEmpty');
const forEach = require('lodash/forEach');

const commonValidations = (data) => {
  const errors = {};

  forEach(data, (value, key) => {
    if(Validator.isEmpty(value)) {
      errors[key] = `The ${ key } field is required`;
    }
  });

  if(!Validator.isEmail(data.email)) {
    errors.email = 'The email field is invalid';
  }

  if(!Validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};

module.exports = commonValidations;