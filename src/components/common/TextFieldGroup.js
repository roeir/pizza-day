import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextFieldGroup = (props) => {
  const { name, value, label, type, onChange, error, checkUserExists } = props;

  return (
    <div className={classnames("form-group", {'has-error': error})}>
      <label className="control-label">
        { label }
      </label>
      <input
        value={ value }
        onChange={ onChange }
        onBlur={ checkUserExists }
        type={ type }
        name={ name }
        className="form-control"
      />
      { error && <span className="help-block">{ error }</span> }
    </div>
  )
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func,
  error: PropTypes.string,
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;