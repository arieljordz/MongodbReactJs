import React from "react";

const FMCategory = ({ fmCategory, setFMCategory }) => {
  return (
    <div className="mb-2 text-left">
      <label className="form-label d-block text-start">Add New Category:</label>
      <input
        type="text"
        className="form-control"
        value={fmCategory}
        onChange={(e) => setFMCategory(e.target.value)}
        placeholder="Enter category"
      />
    </div>
  );
};

export default FMCategory;
