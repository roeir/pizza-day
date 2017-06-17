import React from 'react';
import PropTypes from 'prop-types';
import './SimpleSearch.css';

const Search = ({ value, onChange }) => {
  return (
    <div className="simple-search">
      <input
        type="text"
        value={ value }
        onChange={ onChange }
        placeholder="Type username..."
      />
    </div>
  );
};

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Search;