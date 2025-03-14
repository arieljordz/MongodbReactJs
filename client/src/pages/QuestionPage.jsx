import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import QuestionModal from "../modals/QuestionModal";
import { useTheme } from "../customPages/ThemeContext";

function QuestionPage() {
  const [contents, setContents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { theme } = useTheme();
  const [mode, setMode] = useState("ADD");
  const [selectedContent, setSelectedContent] = useState(null);
  const [expandedTitles, setExpandedTitles] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    fetchContents();
    fetchQuestions();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getContents/all");
      setContents(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/getQuestions/all"
      );
      setQuestions(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.contentId?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedQuestions = filteredQuestions.reduce((acc, question) => {
    const title = question.contentId?.title || "Untitled";
    if (!acc[title]) acc[title] = [];
    acc[title].push(question);
    return acc;
  }, {});

  const titles = Object.keys(groupedQuestions);
  const totalPages = Math.ceil(titles.length / itemsPerPage);
  const paginatedTitles = titles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpand = (title) => {
    setExpandedTitles((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Handle Update
  const handleUpdate = (item, rowIndex) => {
    setShowModal(true);
    setMode("UPDATE");
  };

  // Handle Delete
  const handleDelete = async (id, rowIndex) => {
    try {
      const isYesNo = await Swal.fire({
        title: "Confirmation",
        text: "Are you sure you want to delete this record?",
        icon: "question",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "Yes, Delete it",
        cancelButtonText: "No",
      });
      // console.log(isYesNo.isConfirmed);
      if (isYesNo.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:3001/deleteQuestion/${id}`
        );
        setMode("DELETE");
        if (response.status === 200) {
          toast.success("Question successfully deleted.", {
            autoClose: 2000,
            position: "top-right",
            closeButton: true,
          });

          fetchQuestions();
        }
      }
    } catch (error) {
      console.error("Error deleting question:", error);

      toast.error(
        error.response?.data?.message || "Error while deleting question.",
        {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        }
      );
    }
    setSelectedRow({});
    setActiveDropdown(null);
  };

  const handleRowClick = (title, rowIndex, event, item) => {
    if (event.target.closest(".dropdown")) {
      return;
    }

    setSelectedRow((prevSelectedRow) => {
      const isSameRow = prevSelectedRow[title] === rowIndex;
      setActiveDropdown(null);
      setSelectedContent(prevSelectedRow[title] === rowIndex ? null : item);
      return isSameRow
        ? {} // Clear all selections when clicking the same row
        : { [title]: rowIndex }; // Reset and only select the new row
    });
  };

  // Open modal for adding a new item
  const handleAddNew = () => {
    setShowModal(true);
    setSelectedContent(null);
    setSelectedRow({});
    setMode("ADD");
    // console.log(selectedContent);
  };

  const handleClickBurger = (e, title, rowIndex) => {
    e.stopPropagation();

    const uniqueRow = `${title}-${rowIndex}`;

    if (selectedRow[title] !== rowIndex) {
      e.preventDefault();
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Select this record first.",
      });
    } else {
      setActiveDropdown((prev) => (prev === uniqueRow ? null : uniqueRow));
    }
  };

  return (
    <div className={`container mt-6 ${theme}`}>
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

      <div className={`card card-${theme}`}>
        <div className="card-header">
          <h3 className="card-title">Questions</h3>
        </div>
        {/* /.card-header */}
        <div className="card-body">
          {/* Search Bar and Add New Button in One Row */}
          <div className="mb-3 d-flex align-items-center justify-content-between">
            {/* Add New Button */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddNew}
            >
              Add New
            </button>

            {/* Search Bar */}
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

          <table className="table table-bordered">
            <thead className={theme === "dark" ? "table-dark" : "table-light"}>
              <tr>
                <th>Title</th>
                <th>Question</th>
                <th>Answer A</th>
                <th>Answer B</th>
                <th>Answer C</th>
                <th>Answer D</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTitles.length > 0 ? (
                paginatedTitles.map((title) => (
                  <React.Fragment key={title}>
                    <tr className="table-info">
                      <td colSpan="7">
                        <button
                          onClick={() => toggleExpand(title)}
                          className="text-lg font-bold me-4"
                        >
                          <FontAwesomeIcon
                            icon={expandedTitles[title] ? faMinus : faPlus}
                          />
                        </button>
                        <strong>{title.toUpperCase()}</strong>
                      </td>
                    </tr>

                    {expandedTitles[title] &&
                      groupedQuestions[title].map((q, rowIndex) => (
                        // <tr key={q._id}>
                        <tr
                          key={rowIndex}
                          className={
                            selectedRow[title] === rowIndex
                              ? "table-primary"
                              : ""
                          }
                          onClick={(event) =>
                            handleRowClick(title, rowIndex, event, q)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td className="text-center">{rowIndex + 1}</td>
                          <td>{q.question}</td>
                          <td>{q.answerA}</td>
                          <td>{q.answerB}</td>
                          <td>{q.answerC}</td>
                          <td>{q.answerD}</td>
                          <td className="text-center">
                            <div className="dropdown">
                              <button
                                className={`btn btn-primary btn-sm ${
                                  activeDropdown === `${title}-${rowIndex}`
                                    ? "show"
                                    : ""
                                }`}
                                type="button"
                                onClick={(e) =>
                                  handleClickBurger(e, title, rowIndex)
                                }
                              >
                                ☰
                              </button>
                              <ul
                                className={`dropdown-menu ${
                                  activeDropdown === `${title}-${rowIndex}`
                                    ? "show"
                                    : ""
                                }`}
                              >
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleUpdate(q, rowIndex)}
                                  >
                                    <i className="fa fa-edit me-2"></i>Update
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() =>
                                      handleDelete(q._id, rowIndex)
                                    }
                                  >
                                    <i className="fa fa-trash me-2"></i>Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No questions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
            <div className="d-flex align-items-center">
              <label className="me-2">Show:</label>
              <select
                className="form-select w-auto"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value, 10));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 15, 20, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <label className="ms-2">
                {" "}
                {paginatedTitles.length > 1 ? "rows" : "row"} of {titles.length}{" "}
                {paginatedTitles.length > 1 ? "entries" : "entry"}
              </label>
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
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
          </div>
        </div>
      </div>

      <QuestionModal
        fetchQuestions={fetchQuestions}
        contents={contents}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
        showModal={showModal}
        setShowModal={setShowModal}
        mode={mode}
        setMode={setMode}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
      />
    </div>
  );
}

export default QuestionPage;
