import React from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';

const GroupForm = ({ onChange, formValues, isLoading, errors, onSubmit, checkGroupExist }) => {
  return (
    <div>
      <p>Group information:</p>
      <form onSubmit={ onSubmit }>
        <TextFieldGroup
          checkDataExists={ checkGroupExist }
          name="groupName"
          value={ formValues.groupName }
          label="Group name"
          error={ errors.groupName }
          onChange={ onChange }
        />

        <TextFieldGroup
          name="groupLogo"
          value={ formValues.groupLogo }
          label="Group logo"
          placeholder="http://example.com/image-url"
          error={ errors.groupLogo }
          onChange={ onChange }
        />

        <div className="form-group">
          <button disabled={ isLoading } className="btn btn-primary btn-lg" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

GroupForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  checkGroupExist: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default GroupForm;