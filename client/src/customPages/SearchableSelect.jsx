import React, { useState, useEffect } from "react";

const SearchableSelect = ({
  fetchQuestions,
  contents,
  selectedQuestion,
  setSelectedQuestion,
  formData,
  setFormData,
  mode,
  setMode,
}) => {
  const [searchTitle, setSearchTitle] = useState("");
  const [filteredTitles, setFilteredTitles] = useState(contents);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (!selectedQuestion) {
      setSearchTitle("");
    }
  }, [selectedQuestion]);

  useEffect(() => {
    setFilteredTitles(contents);
  }, [contents]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTitle(value);

    const filtered = contents.filter((content) =>
      content.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTitles(filtered);
  };

  const handleSelect = (title) => {
    setSearchTitle(title);
    setSelectedQuestion(contents.find((content) => content.title === title));
    setDropdownVisible(false);
  };

  return (
    <div>
      {mode === "ADD" && (
        <div>
          <label className="me-2 mt-1 mb-2">Select Title:</label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by title..."
              value={searchTitle}
              onChange={handleChange}
              onFocus={() => setDropdownVisible(true)}
              onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
            />
            {dropdownVisible && (
              <ul className="list-group dropdown-list">
                {filteredTitles.length > 0 ? (
                  filteredTitles.map((content) => (
                    <li
                      key={content._id}
                      className="list-group-item"
                      style={{ cursor: "pointer", padding: "10px" }}
                      onMouseDown={() => handleSelect(content.title)}
                    >
                      {content.title}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">
                    No titles found
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
