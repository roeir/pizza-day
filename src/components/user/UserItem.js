import React from 'react';
import PropTypes from 'prop-types';

const UserItem = (props) => {
  return (
    <div className="user-item">
      <span className="username">
        { props.user.username }
      </span>
    </div>
  );
};

UserItem.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserItem;