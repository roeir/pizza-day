import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './Card.css';

const Card = ({ item, handleUserJoin, currentUser }) => {
  const { _id, createdBy, name, logo, users, status, date } = item;
  const joinedStatus = users.find(item => {
    return currentUser.id === item.user
  });

  const joinedHtml = (
    <div>
      <p>Joined!</p>
      {
        (createdBy === currentUser.id) && (
          <p>
            <Link
              className="btn btn-primary"
              to={{ pathname: `/groups/create/${_id}`, state: { users, name, logo} }}>
              Edit
            </Link>
          </p>
        )
      }
    </div>
  );

  const invitedHtml = (
    <div>
      <p>
        <button
          onClick={() => { handleUserJoin(_id) }}
          type="button"
          className="btn btn-primary">Join
        </button>
      </p>
    </div>
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
            {
              status && (
                <p className="status">
                  { status }
                </p>
              )
            }
            {
              date && (
                <p className="date">
                  { moment(date).format('LL') }
                </p>
              )
            }
          </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  handleUserJoin: PropTypes.func.isRequired
};

export default Card;

