import React, { useState, useEffect } from "react";

const SearchableSelect = ({
  contents,
  selectedContent,
  setSelectedContent,
  selectedTitle,
  setSelectedTitle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedContent?.contentId?._id) {
      const selectedItem = contents.find(
        (content) => content._id === selectedContent.contentId._id
      );

      if (selectedItem) {
        setSearchTerm(selectedItem.title);
        // setSelectedContent(selectedItem);
        setSelectedTitle(selectedItem);
      }
    } else {
      setSearchTerm("");
      // setSelectedContent(null);
      setSelectedTitle(null);
    }
  }, [selectedContent, contents]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const selectedItem = contents.find(
      (content) => content.title.toLowerCase() === value.toLowerCase()
    );

    if (selectedItem) {
      // setSelectedContent(selectedItem);
      setSelectedTitle(selectedItem);
    }
  };

  return (
    <div>
      <label className="me-2 mt-1">
        {selectedTitle ? "Title:" : "Select Title:"}
      </label>
      <div>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by title..."
          value={selectedTitle ? selectedTitle.title : searchTerm}
          onChange={handleChange}
          list="titles"
          disabled={!!selectedTitle}
        />
        <datalist id="titles">
          {contents.map((content) => (
            <option key={content._id} value={content.title} />
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default SearchableSelect;
