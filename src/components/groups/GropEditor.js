import React, {Component} from 'react';
import PropTypes from 'prop-types';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
import {connect} from 'react-redux';
import {addFlashMessage} from '../../actions/flashMessages';
import {createGroupRequest, isGroupExist} from '../../actions/groupActions';
import UserList from '../user/UserList';
import GroupForm from './GroupForm';


const validateInput = (data) => {
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

class GroupEditor extends Component {
  static propTypes = {
    selectedUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleToggle: PropTypes.func.isRequired,
    handleSelectedReset: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    createGroupRequest: PropTypes.func.isRequired
  };

  state = {
    formValues: {
      groupName: '',
      groupLogo: '',
    },
    errors: {},
    isLoading: false
  };

  handleInputsChange = (event) => {
    const {formValues} = this.state;
    this.setState({
      formValues: {
        ...formValues,
        [event.target.name]: event.target.value
      }
    });
  };

  checkGroupExist = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    const errors = { ...this.state.errors };

    if(!value.trim().length) {
      return;
    }

    this.props.isGroupExist(value)
      .then(({ data }) => {
        if (data) {
          errors[field] = 'There is a group with such ' + field;
          this.setState({
            errors
          });
        } else {
          errors[field] = '';
          this.setState({
            errors
          })
        }
      })
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    const {formValues} = this.state;
    const {selectedUsers} = this.props;
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

    const payload = {
      ...formValues,
      invitedUsers: selectedUsers.map(user => {
        return user._id;
      })
    };

    this.props.createGroupRequest(payload)
      .then(({data}) => {
        if (data.success) {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You have created a new group successfully!'
          });
          this.setState({
            isLoading: false,
            formValues: {
              groupName: '',
              groupLogo: '',
            }
          });
          this.props.handleSelectedReset();
        }
      })
      .catch(({response: {data}}) => {
        this.setState({
          errors: data.errors,
          isLoading: false
        });
      })

  };

  render() {
    const {handleToggle, selectedUsers} = this.props;
    const {formValues, isLoading, errors} = this.state;
    return (
      <div>
        <div className="group-form-wrap">
          <GroupForm
            checkGroupExist={ this.checkGroupExist }
            onSubmit={ this.handleFormSubmit }
            onChange={ this.handleInputsChange }
            formValues={ formValues }
            isLoading={ isLoading }
            errors={ errors }
          />
        </div>
        <p>Selected user:</p>
        <UserList
          users={ selectedUsers }
          handleToggle={ handleToggle }
        />
      </div>
    );
  }
}

export default connect(
  null,
  {addFlashMessage, createGroupRequest, isGroupExist}
)(GroupEditor);