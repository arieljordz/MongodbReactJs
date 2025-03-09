import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SearchableSelect from "../customPages/SearchableSelect";

function QuestionPage() {
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const initialFormState = {
    question: "",
    answerA: "",
    answerACheck: false,
    answerB: "",
    answerBCheck: false,
    answerC: "",
    answerCCheck: false,
    answerD: "",
    answerDCheck: false,
    contentId: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // Function to Fetch Contents
  const fetchContents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getContents/all");
      setContents(response.data);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  // Filtering data based on search term
  const filteredData = contents.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting function
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle "All" option
  const displayItems =
    itemsPerPage === "All"
      ? sortedData
      : sortedData.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  // Handle sorting when clicking column headers
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle page change
  const totalPages =
    itemsPerPage === "All" ? 1 : Math.ceil(filteredData.length / itemsPerPage);

  const handleRowClick = (rowIndex, item) => {
    setSelectedRow((prevSelectedRow) => {
      const isSameRow = prevSelectedRow === rowIndex;

      setSelectedContent(isSameRow ? null : item);
      return isSameRow ? null : rowIndex;
    });
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the selected row's _id
    const selectedContentId =
      selectedRow !== null ? contents[selectedRow]._id : "";

    const payload = {
      ...formData,
      contentId: selectedContentId, // Assign _id to contentId
    };

    try {
      console.log("Submitting Payload:", payload);

      await axios.post(
        "http://localhost:3001/createQuestionByContent",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Question added successfully!");
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add question. Please try again."
      );
    }
  };

  // **Reset fields when clicking Cancel**
  const handleCancel = () => {
    setFormData(initialFormState);
  };

  // Fetch contents on page load
  useEffect(() => {
    fetchContents();
    console.log("Selected Content Updated:", selectedContent);
  }, [selectedContent]);

  return (
    <div className="container mt-3">
      <div className="content-header">
        <div className="d-flex justify-content-start">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="">Question</a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* <div className="d-flex align-items-center mb-3">
        <div className="col-1">
          <label className="me-2 mt-1">Select Title:</label>
        </div>
        <div className="col-3">
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
            {contents.map((content) => (
              <option key={content._id} value={content._id}>
                {content.title}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      <SearchableSelect
        contents={contents}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
      />
      <div className="accordion mb-3" id="accordionQuestion">
        {/* Accordion Item 1 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button bg-dark text-white py-2 px-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              style={{ color: "white" }}
            >
              Add Question
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionQuestion"
          >
            <div className="accordion-body p-3">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="question" className="form-label">
                    Question
                  </label>
                  <textarea
                    className="form-control"
                    id="question"
                    name="question"
                    rows={3}
                    value={formData.question}
                    onChange={handleChange}
                    required
                    placeholder="Enter your question here"
                  />
                </div>

                {/* Answer Choices with Checkboxes & Text Inputs */}
                <label htmlFor="question" className="form-label">
                  Check the correct answer(s)
                </label>
                <div className="mb-3">
                  {["A", "B", "C", "D"].map((letter) => (
                    <div
                      key={letter}
                      className="d-flex align-items-center gap-2 mb-3"
                    >
                      <input
                        className="form-check-input mb-1"
                        type="checkbox"
                        id={`answer${letter}Check`}
                        name={`answer${letter}Check`}
                        checked={formData[`answer${letter}Check`] || false}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`answer${letter}Check`}
                      >
                        {`${letter}: `}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`answer${letter}`}
                        name={`answer${letter}`}
                        value={formData[`answer${letter}`] || ""}
                        onChange={handleChange}
                        required
                        placeholder={`Enter answer ${letter}`}
                      />
                    </div>
                  ))}
                </div>
                {/* Action Buttons */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    data-bs-dismiss="modal"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-dark">
        <div className="card-header">
          <h3 className="card-title">Content Questions</h3>
        </div>
        {/* /.card-header */}
        <div className="card-body">
          {/* Search Bar */}
          <div className="mb-3 d-flex justify-content-end">
            <div className="d-flex align-items-center">
              <label className="me-2 mt-1">Search:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th
                  onClick={() => handleSort("_id")}
                  style={{ cursor: "pointer" }}
                >
                  ID{" "}
                  {sortConfig.key === "_id"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  onClick={() => handleSort("title")}
                  style={{ cursor: "pointer" }}
                >
                  Title{" "}
                  {sortConfig.key === "title"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th>Description</th>
                <th
                  onClick={() => handleSort("link")}
                  style={{ cursor: "pointer" }}
                >
                  Link{" "}
                  {sortConfig.key === "link"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  onClick={() => handleSort("category")}
                  style={{ cursor: "pointer" }}
                >
                  Category{" "}
                  {sortConfig.key === "category"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {displayItems.length > 0 ? (
                displayItems.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={selectedRow === rowIndex ? "table-primary" : ""}
                    onClick={() => handleRowClick(rowIndex, item)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item._id}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.link}</td>
                    <td>{item.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No contents available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls & Items Per Page in One Row */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Items Per Page Dropdown */}
            <div className="d-flex align-items-center">
              <label className="me-2">Show:</label>
              <select
                className="form-select w-auto"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(
                    e.target.value === "All"
                      ? "All"
                      : parseInt(e.target.value, 10)
                  );
                  setCurrentPage(1); // Reset to first page
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="All">All</option>
              </select>
              <label className="ms-2">
                {" "}
                {displayItems.length > 1 ? "rows" : "row"} of {contents.length}{" "}
                {displayItems.length > 1 ? "entries" : "entry"}
              </label>
            </div>

            {/* Pagination */}
            {totalPages > 1 && itemsPerPage !== "All" && (
              <nav>
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionPage;
