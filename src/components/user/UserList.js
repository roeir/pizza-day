import React from 'react';
import PropTypes from 'prop-types';
import UserItemSelectable from './UserItemSelectable'
import './User.css';

const UserList = (props) => {
  const users = props.users;
  return (
    <ul className="user-list">
      {
        users.map(user => {
          return (
            <li className="user-list__item" key={ user._id }>
              <UserItemSelectable onChange={ props.handleToggle } user={ user } />
            </li>
          )
        })
      }
    </ul>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleToggle: PropTypes.func.isRequired
};

export default UserList;