import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  handlePreviousClick,
  handleNextClick,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  displayItems,
  totalCount,
}) => {
  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <label className="me-2">Show:</label>
          <select
            className="form-select w-auto"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(
                e.target.value === "All" ? "All" : parseInt(e.target.value, 10)
              );
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="All">All</option>
          </select>
          <label className="ms-2">
            {displayItems.length > 1 ? "rows" : "row"} of {totalCount.length}{" "}
            {displayItems.length > 1 ? "entries" : "entry"}
          </label>
        </div>

        {totalPages > 1 && itemsPerPage !== "All" && (
          <nav className="d-flex justify-content-center">
            <ul className="pagination mb-0 flex-wrap">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={handlePreviousClick}>
                  Previous
                </button>
              </li>
              {totalPages > 0 &&
                Array.from({ length: totalPages }, (_, i) => {
                  return (
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
                  );
                })}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button className="page-link" onClick={handleNextClick}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
};

export default Pagination;
