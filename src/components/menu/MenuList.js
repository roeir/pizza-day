import React  from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

const MenuList = ({ list, handleItemEdit }) => {
  return (
    <ul className="menu-list">
      {
        list.map(item => {
          return (
            <MenuItem
              onEdit={ handleItemEdit }
              key={ item._id }
              { ...item }
            />
          )
        })
      }
    </ul>
  );
};

MenuList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleItemEdit: PropTypes.func.isRequired
};

export default MenuList;
