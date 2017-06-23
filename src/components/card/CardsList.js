import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import { lensPath, lensProp, set, view } from 'ramda';

class CardsList extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    joinRequest: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
  };

  state = {
    list: [],
    listLoaded: false
  };

  confirmInvite(groupId) {
    const listLens = lensProp('list');
    const group = view(listLens, this.state).findIndex(item => {
      return item._id === groupId;
    });

    const usersLens = lensPath(['list', group, 'users']);
    const user = view(usersLens, this.state).findIndex(user => {
      return user.user === this.props.currentUser.id;
    });

    const confirmedLens = lensPath(['list', group, 'users', user, 'confirmed']);

    this.setState(set(confirmedLens, true, this.state));
  }

  handleUserJoin = (groupId) => {

    this.props.joinRequest(groupId, this.props.currentUser)
      .then(({ data }) => {
        if(data.success) {
          this.confirmInvite(groupId);
          this.props.addFlashMessage({
            type: 'success',
            text: 'Joined!'
          });
        }
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Failed to load data from server :('
        });
      });
  };

  componentDidMount() {
    this.props.fetchData().then(({ data }) => {
      this.setState({
        list: data,
        listLoaded: true
      });
    }).catch(() => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Failed to load data from server :('
      });
    });
  }

  render() {
    const { list, listLoaded } = this.state;
    return (
      <div>
        {
          listLoaded ? (
            list.map(item => {
              return (
                <Card
                  handleUserJoin={ this.handleUserJoin }
                  key={ item._id }
                  currentUser={ this.props.currentUser }
                  item={ item }
                />
              )
            })
          ) : (
            <p>Loading data from server...</p>
          )
        }
      </div>
    );
  }
}

export default CardsList;