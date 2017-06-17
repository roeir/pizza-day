import React from 'react';
import './SimpleSearch.css';

const Search = () => {
  return (
    <div className="simple-search">
      <input
        type="text"
        placeholder="Type username..."
      />
    </div>
  );
};

export default Search;