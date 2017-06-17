import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadUserRequest } from '../../actions/userActions';
import { addFlashMessage } from '../../actions/flashMessages';
import UserList from '../user/UserList';
import Search from '../common/SimpleSearch';

class GroupCreator extends Component {
  state = {
    users: [],
    usersLoaded: false
  };

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    loadUserRequest: PropTypes.func.isRequired
  };

  makeSelectable = (users) => {
    return users.map(user => {
      user.selected = this.props.currentUser.id === user._id;
      return user;
    });
  };

  componentDidMount() {
    this.props.loadUserRequest().then(({ data }) => {
      const users = this.makeSelectable(data);
      this.setState({
        users,
        usersLoaded: true
      });
    }).catch(() => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Failed to load list of users :('
      });
    });
  }

  render() {
    const { users, usersLoaded } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="page-header">
            <h1>User group <small>create a new one</small></h1>
          </div>
          <div className="col-md-4">
            <Search />
            { usersLoaded ? <UserList users={ users } /> : <p>Loading user list...</p> }
          </div>
          <div className="col-md-6 col-md-offset-1">
            groupeditor
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { loadUserRequest, addFlashMessage }
)(GroupCreator);
