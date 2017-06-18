import React from 'react';
import PropTypes from 'prop-types';

const UserItem = (props) => {
  return (
    <div className="user-item">
      <span className="username">
        Username: { props.user.username }
      </span>
      <span className="usermail">
        Email: { props.user.email }
      </span>
    </div>
  );
};

UserItem.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserItem;