import React from 'react';
import PropTypes from 'prop-types';
import UserItem from './UserItem';

const UserItemSelectable = (props) => {
  return (
    <label className={ props.user.selected && 'selected' }>
      <input type="checkbox" checked={ props.user.selected } />
      <UserItem user={ props.user } />
    </label>
  );
};

UserItemSelectable.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserItemSelectable;