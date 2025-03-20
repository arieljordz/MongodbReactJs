import React, { useState } from "react";
import useStudents from "../hooks/useStudents";
import StudentTable from "../tables/StudentTable";
import SearchFilter from "../common/SearchFilter";
import Pagination from "../common/Pagination";
import Header from "../customPages/Header";
import StudentModal from "../modals/StudentModal";

const AccountPage = () => {
  const {
    theme,
    students,
    fetchStudents,
    searchTerm,
    setSearchTerm,
    sortConfig,
    handleSort,
    pagination,
    setCurrentPage,
    setItemsPerPage,
    handleDelete,
    handleRowClick,
    handleChange,
    handleSubmit,
    handleClose,
    formData,
    selectedRow,
    totalPages,
    displayItems,
    handlePreviousClick,
    handleNextClick,
    handleOpenModal,
    selectedStudent,
    setSelectedStudent,
    showModal,
    setShowModal,
    mode,
    setMode,
  } = useStudents();

  return (
    <>
      <div className={`container mt-6 ${theme}`}>
        <Header levelOne="Home" levelTwo="Students" />

        <div
          className={`card shadow-lg rounded-lg text-center mx-auto card-${theme}`}
        >
          <div
            className={`card-header ${
              theme === "dark"
                ? "bg-success-dark-mode text-white"
                : "bg-success text-white"
            } py-3 d-flex justify-content-between`}
          >
            <h2 className="card-title font-weight-bold m-0">🎯 Students</h2>
          </div>

          <div
            className={`card-body ${
              theme === "dark" ? "dark-mode text-white" : ""
            }`}
          >
            <div className="mb-3 row g-2 align-items-center">
              {/* Button Container */}
              <div className="col-12 col-md-1">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => handleOpenModal()}
                >
                  Add New
                </button>
              </div>

              {/* Search Filter */}
              <div className="col-12 col-md-4 ms-md-auto">
                <SearchFilter
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchKey="name"
                />
              </div>
            </div>

            {/* Students Table */}
            <StudentTable
              students={displayItems}
              theme={theme}
              onDelete={handleDelete}
              onUpdate={handleOpenModal}
              onSort={handleSort}
              sortConfig={sortConfig}
              selectedRow={selectedRow}
              onRowClick={handleRowClick}
            />

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              itemsPerPage={pagination.itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              displayItems={displayItems}
              totalCount={students}
              handlePreviousClick={handlePreviousClick}
              handleNextClick={handleNextClick}
            />
          </div>
        </div>
      </div>

      {/* Student Modal */}
      <StudentModal
        theme={theme}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={handleClose}
        formData={formData}
        showModal={showModal}
        mode={mode}
        setMode={setMode}
      />
    </>
  );
};

export default AccountPage;
