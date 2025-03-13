import { useState } from "react";

const SearchableSelect = ({
  contents,
  selectedContent,
  setSelectedContent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle input change and selection
  const handleChange = (e) => {
    setSearchTerm(e.target.value);

    const selectedItem = contents.find(
      (content) => content.title.toLowerCase() === e.target.value.toLowerCase()
    );

    if (selectedItem) {
      setSelectedContent(selectedItem);
    }
    // console.log(selectedItem);
  };

  return (
    <div>
      <label className="me-2 mt-1">Select Title:</label>
      <div>
        {/* Searchable Input with Datalist */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleChange}
          list="titles"
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
