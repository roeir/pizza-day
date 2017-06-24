import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

const validateInput = (data) => {
  const errors = {};

  if (Validator.isEmpty(data.name)) {
    errors.name = 'The name field is required';
  }

  if (!Validator.isURL(data.logo)) {
    errors.logo = 'The logo field must be a correct url address';
  }

  if (!Validator.isCurrency(data.price)) {
    errors.price = 'The price field must be a currency value';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

class MenuEditor extends Component {
  static propTypes = {
    formValues: PropTypes.object.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    createMenuItem: PropTypes.func.isRequired,
    handleItemAdd: PropTypes.func.isRequired
  };

  state = {
    formValues: {
      _id: null,
      name: '',
      logo: '',
      price: ''
    },
    isLoading: false,
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if(!isEqual(nextProps.formValues, this.state.formValues)) {
      this.setState({
        formValues: {
          ...nextProps.formValues
        }
      });
    }
  }

  handleInputChange = (event) => {
    const { formValues } = this.state;
    this.setState({
      formValues: {
        ...formValues,
        [event.target.name]: event.target.value
      }
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    const {formValues} = this.state;
    const {errors, isValid} = validateInput(formValues);

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

    this.props.createMenuItem(formValues)
      .then(({data}) => {
        if (data.success) {
          this.props.addFlashMessage({
            type: 'success',
            text: 'Done!'
          });
          this.props.handleItemAdd(formValues);
          this.setState({
            formValues: {
              _id: null,
              name: '',
              logo: '',
              price: ''
            },
            isLoading: false,
          });
        }
      })
      .catch(({response: {data}}) => {
        this.setState({
          errors: data.errors,
          isLoading: false
        });
      });

  };

  render() {
    const { formValues, errors, isLoading } = this.state;

    return (
      <div className="menu-form">
        <p>Create a new menu item or edit existing ones: </p>
        <form onSubmit={ this.handleFormSubmit }>
          <TextFieldGroup
            name="name"
            value={ formValues.name }
            label="Name"
            error={ errors.name }
            onChange={ this.handleInputChange }
          />

          <TextFieldGroup
            name="logo"
            placeholder="http://example.com/image-url"
            value={ formValues.logo }
            label="Logo"
            error={ errors.logo }
            onChange={ this.handleInputChange }
          />

          <TextFieldGroup
            placeholder="3 or $3"
            name="price"
            value={ formValues.price }
            label="Price"
            error={ errors.price }
            onChange={ this.handleInputChange }
          />

          <div className="form-group">
            <button disabled={ isLoading } className="btn btn-primary btn-lg" type="submit">
              Save
            </button>
          </div>

        </form>
      </div>
    )
  }
}

export default MenuEditor;