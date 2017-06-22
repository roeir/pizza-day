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
          name="name"
          value={ formValues.name }
          label="Event name"
          error={ errors.name }
          onChange={ onChange }
        />

        <TextFieldGroup
          name="logo"
          value={ formValues.logo }
          label="Event logo"
          placeholder="http://example.com/image-url"
          error={ errors.logo }
          onChange={ onChange }
        />

        <DatePicker
          customInput={ <CustomDatePicker label="Event date" /> }
          selected={ formValues.date }
          minDate={ moment() }
          onChange={ onDateChange }
        />

        <div className="form-group">
          <label className="control-label">Status</label>
          <select
            name="status"
            onChange={ onChange }
            className="form-control"
            disabled={ false }
            value={ formValues.status }
          >
            <option value="ordering">Ordering</option>
            <option value="ordered">Ordered</option>
            <option value="delivering">Delivering</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className={ classnames("form-group", {'has-error': errors.groups}) }>
          <label className="control-label">
            Select user groups (use Ctrl or Shift key to select multiple):
          </label>
          <select
            name="groups"
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
          { errors.groups && <span className="help-block">{ errors.groups }</span> }
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