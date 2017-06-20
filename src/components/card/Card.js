import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ _id, name, logo, users, currentUser, handleUserJoin }) => {
  const joinedStatus = users.find(item => {
    return currentUser.id === item.user
  });

  const joinedHtml = (
    <p>Joined!</p>
  );

  const invitedHtml = (
    <p>
      <button
        onClick={() => { handleUserJoin(_id) }}
        type="button"
        className="btn btn-primary">Join</button>
    </p>
  );

  return (
    <div className="col-sm-6 col-md-4">
      <div className="thumbnail">
        <img src={ logo } alt="logo" width={242} height={200} />
          <div className="caption">
            <h3>{ name }</h3>
            {
              joinedStatus.confirmed ?
                joinedHtml : invitedHtml
            }
          </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleUserJoin: PropTypes.func.isRequired
};

export default Card;

