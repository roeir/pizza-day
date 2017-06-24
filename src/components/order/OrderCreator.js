import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createMenuItem, fetchMenuList } from '../../actions/menuActions';
import { addFlashMessage } from '../../actions/flashMessages';
import MenuEditor from '../menu/MenuEditor';
import MenuList from "../menu/MenuList";

class OrderCreator extends Component {
  static propTypes = {
    addFlashMessage: PropTypes.func.isRequired,
    createMenuItem: PropTypes.func.isRequired,
    fetchMenuList: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  };

  state = {
    list: [],
    editingItem: {
      _id: null,
      name: '',
      logo: '',
      price: ''
    }
  };

  componentDidMount() {
    this.props.fetchMenuList()
      .then(({ data }) => {
        this.setState({
          list: data,
        });
      }).catch(() => {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Failed to load data from server :('
      });
    });
  }

  handleItemEdit = (item) => {
    this.setState({
      editingItem: item
    });
  };

  handleItemAdd = (item) => {
    const { list } = this.state;
    const index = list.findIndex(food => {
      return food._id === item._id;
    });

    if(index >= 0) {
      this.setState({
        list: [
          ...list.slice(0, index),
          item,
          ...list.slice(index + 1)
        ]
      });

      return;
    }

    this.setState({
      list: [
        ...list,
        item
      ]
    });
  };

  render() {
    const { addFlashMessage, createMenuItem } = this.props;
    const { list, editingItem } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <MenuList
              handleItemEdit={ this.handleItemEdit }
              list={ list }
            />
          </div>
          <div className="col-md-4">
            <h3>You Order</h3>
          </div>
          <div className="col-md-4">
            <MenuEditor
              handleItemAdd={ this.handleItemAdd }
              formValues={ editingItem }
              addFlashMessage={ addFlashMessage }
              createMenuItem={ createMenuItem }
            />
          </div>
        </div>
      </div>
    );
  }
}


export default connect(null, {
  addFlashMessage,
  createMenuItem,
  fetchMenuList
})(OrderCreator);