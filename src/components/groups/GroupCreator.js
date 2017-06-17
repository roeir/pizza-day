import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadUserRequest } from '../../actions/userActions';
import { addFlashMessage } from '../../actions/flashMessages';
import { findById, toggleUser, updateUser } from '../../utils/userHelpers';
import UserList from '../user/UserList';
import Search from '../common/SimpleSearch';

class GroupCreator extends Component {
  state = {
    users: [],
    usersLoaded: false,
    searchQuery: ''
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

  handleToggle = (id) => {
    const { users } = this.state;
    const user = findById(id, users);
    const toggledUser = toggleUser(user);
    const updatedUsers = updateUser(users, toggledUser);
    this.setState({
      users: updatedUsers,
      searchQuery: ''
    });
  };

  handleSearch = (event) => {
    const searchQuery = event.target.value;
    this.setState({
      searchQuery
    });
  };

  getVisibleUsers(list, query) {
    return list.filter(user => {
      const searchValue = user.username.toLowerCase();
      return searchValue.indexOf(query) !== -1;
    });
  };

  render() {
    const { users, usersLoaded, searchQuery } = this.state;
    const visibleUsers = this.getVisibleUsers(users, searchQuery);
    return (
      <div className="container">
        <div className="row">
          <div className="page-header">
            <h1>User group <small>create a new one</small></h1>
          </div>
          <div className="col-md-4">
            <Search value={ searchQuery } onChange={ this.handleSearch } />
            { usersLoaded ? <UserList
              users={ visibleUsers }
              handleToggle={ this.handleToggle }
            /> : <p>Loading user list...</p> }
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
