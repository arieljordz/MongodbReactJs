import React from "react";

const Category = ({ category, setCategory }) => {
  return (
    <div className="mb-2">
      <label className="form-label">Category:</label>
      <input
        type="text"
        className="form-control"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter Category"
      />
    </div>
  );
};

export default Category;
