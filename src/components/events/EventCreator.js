import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import Validator from 'validator';
import { Redirect } from 'react-router-dom';
import { fetchUserGroups } from '../../actions/groupActions';
import { addFlashMessage } from '../../actions/flashMessages';
import { createEventRequest } from '../../actions/eventActions';
import EventForm from './EventFrom';

const validateInput = (data) => {
  const errors = {};

  if (Validator.isEmpty(data.eventName)) {
    errors.eventName = 'The event name field is required';
  }

  if (Validator.isEmpty(data.eventLogo)) {
    errors.eventLogo = 'The event logo field is required';
  }

  if (!Validator.isURL(data.eventLogo)) {
    errors.groupLogo = 'The event logo field must be a correct url addres'
  }

  if(isEmpty(data.eventGroups)) {
    errors.eventGroups = 'Must be selected at least one of options'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

class EventCreator extends Component {
  static propTypes = {
    fetchUserGroups: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    createEventRequest: PropTypes.func.isRequired
  };

  state = {
    formValues: {
      eventGroups: [],
      eventName: '',
      eventLogo: '',
      eventStatus: 'ordering',
      startDate: moment()
    },
    groups: [],
    redirect: false,
    errors: {},
    isLoading: false
  };

  handleChange = (event) => {
    const { formValues } = this.state;
    this.setState({
      formValues: {
        ...formValues,
        [event.target.name]: event.target.value
      }
    });
  };

  handleDateChange = (date) => {
    const { formValues } = this.state;
    this.setState({
      formValues: {
        ...formValues,
        startDate: date
      }
    });
  };

  handleGroupChange = (event) => {
    const {formValues} = this.state;
    const selectedGroups = [...event.target.options]
      .filter(option => option.selected)
      .map(selected => selected.value);
    this.setState({
      formValues: {
        ...formValues,
        eventGroups: selectedGroups
      }
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { formValues } = this.state;
    const { errors, isValid } = validateInput(formValues);

    if(!isValid) {
      this.setState({
        errors,
      });
      return;
    }

    this.setState({
      errors: {},
      isLoading: true
    });

    this.props.createEventRequest(formValues)
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
      });

  };

  componentDidMount() {
    this.props.fetchUserGroups()
      .then(({ data }) => {
        this.setState({
          groups: data,
        });
      }).catch(() => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Failed to load data from server :('
      });
    });
  }

  render() {
    const { formValues, errors, isLoading, groups, redirect } = this.state;

    return (
      <div className="container">
        {
          redirect ? (
            <Redirect to="/events" />
          ) : (
            <div className="row">
              <div className="page-header">
                <h1>Pizza day event <small>create a new one</small></h1>
              </div>
              <div className="col-md-4 col-md-offset-4">
                {
                  groups.length ? (
                    <EventForm
                      groups={ groups }
                      onGroupChange={ this.handleGroupChange }
                      onDateChange={ this.handleDateChange }
                      onChange={ this.handleChange }
                      onSubmit={ this.handleSubmit }
                      formValues={ formValues }
                      errors={ errors }
                      isLoading={ isLoading }
                    />
                  ) : <p>Loading user groups...</p>
                }
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(null, {
  fetchUserGroups,
  addFlashMessage,
  createEventRequest
})(EventCreator);