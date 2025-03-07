import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Modal } from "bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Question from "../pages/Question";

function ContentTable({ data, setSelectedContent, fetchContents }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering data based on search term
  const filteredData = data.filter((item) =>
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

  // Handle Edit
  const handleEdit = (item) => {
    // console.log("Editing:", item);
    setSelectedContent(item);
    const modalElement = document.getElementById("modalContent");
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  };

  // Handle Question
  const handleQuestion = (item) => {
    setSelectedContent(item);
    const modalElement = document.getElementById("modalQuestion");
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
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

          setTimeout(fetchContents, 1000);
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
  };

  return (
    <div className="container mt-3 p-0">
      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort("_id")} style={{ cursor: "pointer" }}>
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
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td className="text-center">
                  <div className="dropdown">
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {/* SVG Burger Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-list"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.5 4.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5m0 3.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5m0 3.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5"
                        />
                      </svg>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="fa fa-edit me-2"></i>Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleQuestion(item)}
                        >
                          <i className="fa fa-question me-2"></i>Question
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(item._id)}
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
              <td colSpan="4" className="text-center">
                No contents available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls & Items Per Page in One Row */}
      <div className="d-flex justify-content-between align-items-center">
        {/* Items Per Page Dropdown */}
        <div className="d-flex align-items-center">
          <label className="me-2">Show:</label>
          <select
            className="form-select w-auto"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(
                e.target.value === "All" ? "All" : parseInt(e.target.value, 10)
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
            {displayItems.length > 1 ? "rows" : "row"} of {data.length}{" "}
            {displayItems.length > 1 ? "entries" : "entry"}
          </label>
        </div>

        {/* Pagination */}
        {totalPages > 1 && itemsPerPage !== "All" && (
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
        )}
      </div>
    </div>
  );
}

export default ContentTable;
