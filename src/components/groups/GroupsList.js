import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CardsList from '../card/CardsList';
import { fetchUserGroups, joinUserRequest } from '../../actions/groupActions';
import { addFlashMessage } from '../../actions/flashMessages';

const GroupList = ({ joinUserRequest, fetchUserGroups, addFlashMessage, currentUser }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="page-header">
          <h1>User groups <small><Link to="/groups/create">create new</Link></small></h1>
        </div>
        <CardsList
          currentUser={ currentUser }
          fetchData={ fetchUserGroups }
          joinRequest={ joinUserRequest }
          addFlashMessage={ addFlashMessage }
        />
      </div>
    </div>
  )
};

GroupList.propTypes = {
  currentUser: PropTypes.object.isRequired,
  fetchUserGroups: PropTypes.func.isRequired,
  joinUserRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.user
  };
};

export default connect(mapStateToProps, {
  joinUserRequest,
  fetchUserGroups,
  addFlashMessage
})(GroupList);

