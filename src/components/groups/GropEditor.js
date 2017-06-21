import React, {Component} from 'react';
import PropTypes from 'prop-types';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import { Redirect } from 'react-router-dom';
import {addFlashMessage} from '../../actions/flashMessages';
import {createGroupRequest} from '../../actions/groupActions';
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
    addFlashMessage: PropTypes.func.isRequired,
    createGroupRequest: PropTypes.func.isRequired,
    formValues: PropTypes.object.isRequired,
    groupId: PropTypes.string
  };

  state = {
    formValues: {
      groupName: '',
      groupLogo: '',
    },
    redirect: false,
    errors: {},
    isLoading: false
  };

  componentWillReceiveProps(nextProps) {
    if(!isEqual(nextProps.formValues, this.props.formValues)) {
      this.setState({
        formValues: nextProps.formValues
      });
    }
  }

  handleInputsChange = (event) => {
    const {formValues} = this.state;
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
    const {selectedUsers, groupId} = this.props;
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
      groupId,
      invitedUsers: selectedUsers.map(user => {
        return user._id;
      })
    };

    this.props.createGroupRequest(payload)
      .then(({data}) => {
        if (data.success) {
          this.props.addFlashMessage({
            type: 'success',
            text: 'Done!'
          });
          this.setState({
            isLoading: false,
            redirect: true
          });
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
    const {formValues, isLoading, errors, redirect} = this.state;
    return (
      <div>
        {
          redirect ? (
            <Redirect to="/groups" />
          ) : (
            <div>
              <div className="group-form-wrap">
                <GroupForm
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
          )
        }
      </div>
    );
  }
}

export default connect(
  null,
  {addFlashMessage, createGroupRequest}
)(GroupEditor);