import React, { useState, useEffect } from "react";
import ContentModal from "../modals/ContentModal";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useTheme } from "../customPages/ThemeContext";

function ContentPage() {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [mode, setMode] = useState("ADD");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  console.log("Content User Data:", studentData);
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

  // Open modal for adding a new item
  const handleAddNew = () => {
    setShowModal(true);
    setMode("ADD");
    setSelectedRow(null);
    setSelectedContent(null);
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
          `http://localhost:3001/deleteContent/${id}`
        );

        if (response.status === 200) {
          toast.success("Content successfully deleted.", {
            autoClose: 2000,
            position: "top-right",
            closeButton: true,
          });
          fetchContents();
        }
      }
    } catch (error) {
      console.error("Error deleting content:", error);

      toast.error(
        error.response?.data?.message || "Error while deleting content.",
        {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        }
      );
    }
    setSelectedRow(null);
    setSelectedContent(null);
    setActiveDropdown(null);
  };

  const handleRowClick = (rowIndex, event, item) => {
    if (event.target.closest(".dropdown")) {
      return;
    }

    setSelectedRow((prevSelectedRow) => {
      const isSameRow = prevSelectedRow === rowIndex;
      setActiveDropdown(null);
      setSelectedContent(isSameRow ? null : item);
      return isSameRow ? null : rowIndex;
    });
  };

  const handleClickBurger = (e, rowIndex) => {
    e.stopPropagation();

    if (selectedRow !== rowIndex) {
      e.preventDefault();
      toast.warning("Select this record first.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
      return;
    }
    setActiveDropdown((prev) => (prev === rowIndex ? null : rowIndex));
  };

  useEffect(() => {
    fetchContents();
  }, []);

  return (
    <div className={`container mt-6 ${theme}`}>
      <div className="content-header">
        <div className="d-flex justify-content-start">
          <nav aria-label="breadcrumb mt-5">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a children="text-blue">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a children="text-blue">Contents</a>
              </li>
              {/* <li className="breadcrumb-item active" aria-current="page">
                Content
              </li> */}
            </ol>
          </nav>
        </div>
      </div>

      <div
        className={`card card-${theme} shadow-lg rounded-lg text-center mx-auto`}
      >
        {/* Card Header */}
        <div
          className={`card-header ${
            theme === "dark"
              ? "bg-success-dark-mode text-white"
              : "bg-success text-white"
          } py-3 d-flex justify-content-center`}
        >
          <h2 className="card-title font-weight-bold m-0">📝 Contents</h2>
        </div>
        {/* /.card-header */}
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          {/* Search Bar and Add New Button in One Row */}
          <div className="mb-3 row g-2 align-items-center">
            {/* Add New Button (col-1 on desktop, full-width on mobile) */}
            <div className="col-12 col-md-1">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleAddNew}
              >
                Add New
              </button>
            </div>

            {/* Search Bar (remaining width) */}
            <div className="col-12 col-md-4 ms-md-auto">
              <div className="d-flex align-items-center">
                <label className="me-2">Search:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead
                className={theme === "dark" ? "table-dark" : "table-light"}
              >
                <tr>
                  <th>Count</th>
                  <th
                    onClick={() => handleSort("title")}
                    className="cursor-pointer"
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
                    className="cursor-pointer"
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
                    className="cursor-pointer"
                  >
                    Category{" "}
                    {sortConfig.key === "category"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.length > 0 ? (
                  displayItems.map((item, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={
                        selectedRow === rowIndex
                          ? "table-primary cursor-pointer"
                          : "cursor-pointer"
                      }
                      onClick={(event) => handleRowClick(rowIndex, event, item)}
                    >
                      <td className="text-center">{rowIndex + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.link}</td>
                      <td>{item.category}</td>
                      <td className="text-center">
                        <div className="dropdown">
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            aria-expanded={activeDropdown === rowIndex}
                            onClick={(e) => handleClickBurger(e, rowIndex)}
                          >
                            ☰
                          </button>
                          <ul
                            className={`dropdown-menu ${
                              activeDropdown === rowIndex ? "show" : ""
                            }`}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleUpdate(item, rowIndex)}
                              >
                                <i className="fa fa-edit me-2"></i>Update
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(item._id, rowIndex)}
                              >
                                <i className="fa fa-trash me-2"></i>Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No contents available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls & Items Per Page in One Row */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
            {/* Items Per Page Dropdown */}
            <div className="d-flex align-items-center mb-2 mb-md-0">
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
                {displayItems.length > 1 ? "rows" : "row"} of {contents.length}{" "}
                {displayItems.length > 1 ? "entries" : "entry"}
              </label>
            </div>

            {/* Pagination */}
            {totalPages > 1 && itemsPerPage !== "All" && (
              <nav className="d-flex justify-content-center">
                <ul className="pagination mb-0 flex-wrap">
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

      <ContentModal
        fetchContents={fetchContents}
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

export default ContentPage;
