import React from "react";
import "./SearchHeader.css";

const SearchHeader = ({
  inputVal,
  onTextChange,
  onButtonClick,
  onhandleKeyDown,
}) => {
  return (
    <div className="search-header">
      <input
        aria-label="pokemon-filter"
        type="text"
        value={inputVal}
        onChange={onTextChange}
        onKeyDown={onhandleKeyDown}
      />
      <button aria-label="search-button" onClick={onButtonClick}>
        Search
      </button>
    </div>
  );
};

export default SearchHeader;
