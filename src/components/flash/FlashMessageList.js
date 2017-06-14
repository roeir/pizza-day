import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {deleteFlashMessage} from '../../actions/flashMessages';
import FlashMessage from './FlashMessage';

const FlashMessagesList = (props) => {
  return (
    <div>
      {
        props.messages.map(message => {
          return (
            <FlashMessage
              key={ message.id }
              message={ message }
              deleteFlashMessage={ props.deleteFlashMessage }
            />
          );
        })
      }
    </div>
  )
};

FlashMessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    messages: state.flashMessages
  };
};

export default connect(
  mapStateToProps,
  {deleteFlashMessage}
)(FlashMessagesList);