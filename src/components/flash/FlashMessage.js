import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const FlashMessage = (props) => {
  const {id, type, text} = props.message;
  const {deleteFlashMessage} = props;
  return (
    <div className={ classnames('alert', {
      'alert-success': type === 'success',
      'alert-danger': type === 'error'
    }) }>
      <button className="close" onClick={ () => deleteFlashMessage(id) }>
        <span>&times;</span>
      </button>
      { text }
    </div>
  );
};

FlashMessage.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
};

export default FlashMessage;

