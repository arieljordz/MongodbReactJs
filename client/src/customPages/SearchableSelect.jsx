import { useState } from "react";

const SearchableSelect = ({ contents, selectedContent, setSelectedContent }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter contents based on search term
  const filteredContents = contents.filter((content) =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex align-items-center mb-3">
      <div className="col-1">
        <label className="me-2 mt-1">Select Title:</label>
      </div>
      <div className="col-3 position-relative">
        {/* Search Input */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Select Dropdown */}
        <select
          className="form-select"
          value={selectedContent?._id || ""}
          onChange={(e) => {
            const selectedItem = contents.find(
              (item) => item._id === e.target.value
            );
            setSelectedContent(selectedItem);
          }}
        >
          <option value="">-- Select a Title --</option>
          {filteredContents.length > 0 ? (
            filteredContents.map((content) => (
              <option key={content._id} value={content._id}>
                {content.title}
              </option>
            ))
          ) : (
            <option value="" disabled>No results found</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default SearchableSelect;
