import React from 'react';
import PropTypes from 'prop-types';
import CustomDatePicker from '../common/CustomDatePicker';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classnames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import TextFieldGroup from '../common/TextFieldGroup';


const EventForm = ({ onChange, formValues, isLoading, errors, onSubmit, onDateChange, groups, onGroupChange }) => {
  return (
    <div>
      <p>Event information:</p>
      <form onSubmit={ onSubmit }>
        <TextFieldGroup
          name="eventName"
          value={ formValues.eventName }
          label="Event name"
          error={ errors.eventName }
          onChange={ onChange }
        />

        <TextFieldGroup
          name="eventLogo"
          value={ formValues.eventLogo }
          label="Event logo"
          placeholder="http://example.com/image-url"
          error={ errors.eventLogo }
          onChange={ onChange }
        />

        <DatePicker
          customInput={ <CustomDatePicker label="Event date" /> }
          selected={ formValues.startDate }
          minDate={ moment() }
          onChange={ onDateChange }
        />

        <div className="form-group">
          <label className="control-label">Status</label>
          <select
            name="eventStatus"
            onChange={ onChange }
            className="form-control"
            disabled={ false }
            value={ formValues.eventStatus }
          >
            <option value="ordering">Ordering</option>
            <option value="ordered">Ordered</option>
            <option value="delivering">Delivering</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className={ classnames("form-group", {'has-error': errors.eventGroups}) }>
          <label className="control-label">
            Select user groups (use Ctrl or Shift key to select multiple):
          </label>
          <select
            name="eventGroups"
            className="form-control"
            multiple={ true }
            onChange={ onGroupChange }
          >
            {
              groups.map(group =>{
                return (
                  <option
                    key={ group._id }
                    value={ group._id }
                  >
                    { group.name }
                    </option>
                )
              })
            }
          </select>
          { errors.eventGroups && <span className="help-block">{ errors.eventGroups }</span> }
        </div>

        <div className="form-group">
          <button disabled={ isLoading } className="btn btn-primary btn-lg" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

EventForm.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  onGroupChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default EventForm;