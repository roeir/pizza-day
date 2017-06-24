import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import { orderRequest, removeItem, clearCart } from '../../actions/cartActions';
import CartItem from './CartItem';
import './Cart.css';

class Cart extends Component {

  static propTypes = {
    itemIds: PropTypes.object.isRequired,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    orderRequest: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  };

  state = {
    isLoading: false,
    redirect: false
  };

  handleOrder = () => {
    const { itemIds } = this.props;
    if(isEmpty(itemIds)) {
      this.props.addFlashMessage({
        type: 'error',
        text: 'Add some items to cart before order'
      });
      return;
    }
    this.setState({
      isLoading: true
    });
    this.props.orderRequest(this.props.id, itemIds)
      .then(({data}) => {
        if (data.success) {
          this.props.addFlashMessage({
            type: 'success',
            text: 'Done!'
          });
          this.props.clearCart();
          this.setState({
            redirect: true,
            isLoading: false,
          });
        }
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Failed to send data to server:('
        });
        this.setState({
          isLoading: false
        });
      });
  };

  getTotalPrice(list, ids) {
    return reduce(ids, (total, qty, id) => {
      const item = list.find(item => {
        return item._id === id;
      });
      const priceStr = item.price.replace(/\$/g, '');
      return total + Math.floor((parseFloat(priceStr) * qty) * 100) / 100;
    }, 0);
  }

  render() {
    const { itemIds, list, removeItem } = this.props;
    const { redirect, isLoading } = this.state;
    return (
      <div className="cart">
        {
          redirect ? (
            <Redirect to="/" />
          ) : (
            <div>
              <p>Your order:</p>
              <ul className="cart-list">
                <li className="cart-list__header">
                  <div className="cart-list__qty">Quantity</div>
                  <div className="cart-list__name">Name</div>
                  <div className="cart-list__price">Price</div>
                  <div className="cat-list__remove">Remove</div>
                </li>
                {
                  map(itemIds, (qty, id) => {
                    const item = list.find(unit => {
                      return unit._id === id;
                    });
                    return (
                      <CartItem removeItem={ removeItem } key={ id } { ...item } qty={ qty }/>
                    )
                  })
                }
                <li className="cart-list__footer">
                  <div className="cart-list__total">
                    Total Price:
                  </div>
                  <span>${ this.getTotalPrice(list, itemIds) }</span>
                </li>
              </ul>
              <div className="form-group order-btn">
                <button onClick={ this.handleOrder } disabled={ isLoading } className="btn btn-primary btn-md" type="button">
                  Order
                </button>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    itemIds: state.cart
  }
};

export default connect(mapStateToProps, {
  addFlashMessage,
  orderRequest,
  removeItem,
  clearCart
})(Cart);