import React, { Component } from 'react';
import PropTypes from 'prop-types';


class CustomDatePicker extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string,
    label: PropTypes.string
  };

  render() {
    const { onClick, value, label } = this.props;
    return (
      <div className="form-group">
        <label className="control-label">
          { label }
        </label>
        <div className="form-group">
          <button onClick={ onClick }  className="btn btn-default btn-lg" type="button">
            { value }
          </button>
        </div>
      </div>
    );
  }
}

export default CustomDatePicker;