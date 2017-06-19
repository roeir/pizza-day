const Validator = require('validator');
const isEmpty = require('lodash/isEmpty');
const forEach = require('lodash/forEach');

const commonValidations = (data) => {
  const errors = {};

  forEach(data, (value, key) => {
    if (Validator.isEmpty(value)) {
      errors[key] = `The ${ key } field is required`;
    }
  });

  if (!Validator.isURL(data.groupLogo)) {
    errors.groupLogo = 'The group logo field must be a correct url addres'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = commonValidations;