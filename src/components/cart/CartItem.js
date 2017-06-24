import React from 'react';
import PropTypes from 'prop-types';
import './CartItem.css';

const getItemPrice = (price, qty) => {
  const priceStr = price.replace(/\$/g, '');
  return Math.floor((parseFloat(priceStr) * qty) * 100) / 100;
};

const CartItem = ({ _id, name, price, qty, removeItem }) => {
  return (
    <li className="cart-item">
      <div className="cart-item__qty">
        { qty } <span>x</span>
      </div>
      <div className="cart-item__name">
        { name }
      </div>
      <div className="cart-item__price">
        <span>$</span>{ getItemPrice(price, qty) }
      </div>
      <div onClick={() => { removeItem(_id) }} className="cart-item__remove">✖</div>
    </li>
  );
};

CartItem.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  qty: PropTypes.number.isRequired,
  removeItem: PropTypes.func.isRequired
};

export default CartItem;