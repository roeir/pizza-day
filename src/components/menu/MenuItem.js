import React from 'react';
import PropTypes from 'prop-types';
import './MenuItem.css';


const MenuItem = ({ _id, name, logo, price, onEdit, addItem }) => {
  return (
    <li className="menu-item">
      <div
        className="menu-item__logo"
        style={{ backgroundImage: `url(${ logo })`}}
      >
      </div>
      <div className="menu-item__info">
        <div className="menu-item__name">
          <span>Name:</span> { name }
        </div>
        <div className="menu-item__price">
          <span>Price:</span> { price }
        </div>
        <div className="menu-item__controls">
          <button
            className="btn btn-primary btn-xs"
            type="button"
            onClick={ () => { addItem(_id) } }
          >
            Order
          </button>
          <button
            onClick={ () => { onEdit({ _id, name, logo, price }) } }
            className="btn btn-default btn-xs" type="button"
          >
            Edit
          </button>
        </div>
      </div>
    </li>
  )
};

MenuItem.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired
};

export default MenuItem