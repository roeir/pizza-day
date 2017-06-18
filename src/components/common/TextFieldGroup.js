import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextFieldGroup = (props) => {
  const {
    name,
    value,
    label,
    type,
    placeholder,
    onChange,
    error,
    checkDataExists} = props;

  return (
    <div className={classnames("form-group", {'has-error': error})}>
      <label className="control-label">
        { label }
      </label>
      <input
        placeholder={ placeholder }
        value={ value }
        onChange={ onChange }
        onBlur={ checkDataExists }
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
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  checkDataExists: PropTypes.func,
  error: PropTypes.string,
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;