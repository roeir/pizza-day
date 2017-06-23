import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import { fetchUserEvents, joinUserRequest } from '../../actions/eventActions';
import CardsList from '../card/CardsList';

const EventList = ({ currentUser, fetchUserEvents, joinUserRequest, addFlashMessage }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="page-header">
          <h1>User events <small><Link to="/events/create">create new</Link></small></h1>
        </div>
        <CardsList
          currentUser={ currentUser }
          fetchData={ fetchUserEvents }
          joinRequest={ joinUserRequest }
          addFlashMessage={ addFlashMessage }
        />
      </div>
    </div>
  )
};

EventList.propTypes = {
  currentUser: PropTypes.object.isRequired,
  fetchUserEvents: PropTypes.func.isRequired,
  joinUserRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.user
  };
};


export default connect(mapStateToProps, {
  addFlashMessage,
  joinUserRequest,
  fetchUserEvents
})(EventList);