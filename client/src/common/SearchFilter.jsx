import React from "react";

const SearchFilter = ({ searchTerm, setSearchTerm, searchKey }) => {
  return (
    <>
      {/* ✅ Ensure search input updates the state correctly */}
      <div className="d-flex align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder={`Search by ${searchKey}...`}
          value={searchTerm}
          onChange={(e) => {
            console.log("Search Term Changed: ", e.target.value); // Debugging log
            setSearchTerm(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default SearchFilter;
