import React, { useState } from "react";
import useContents from "../hooks/useContents";
import ContentTable from "../tables/ContentTable";
import SearchFilter from "../common/SearchFilter";
import Pagination from "../common/Pagination";
import Header from "../customPages/Header";
import ContentModal from "../modals/ContentModal";

const ContentPage = () => {
  const {
    theme,
    contents,
    categories,
    fetchContents,
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
    selectedContent,
    setSelectedContent,
    showModal,
    setShowModal,
    mode,
    setMode,
    cardBgColor,
    btnBgColor,
  } = useContents();

  return (
    <>
      <div className={`container mt-6 ${theme}`}>
        <Header levelOne="Home" levelTwo="Contents" />

        <div
          className={`card shadow-lg rounded-lg text-center mx-auto card-${theme}`}
        >
          <div
            className={`card-header ${cardBgColor} py-3 d-flex justify-content-between`}
          >
            <h2 className="card-title font-weight-bold m-0">📚 Contents</h2>
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
                  className={`btn ${btnBgColor} w-100`}
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
                  searchKey="title or category"
                />
              </div>
            </div>

            {/* Contents Table */}
            <ContentTable
              contents={displayItems}
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
              totalCount={contents}
              handlePreviousClick={handlePreviousClick}
              handleNextClick={handleNextClick}
            />
          </div>
        </div>
      </div>

      {/* Content Modal */}
      <ContentModal
        theme={theme}
        categories={categories}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={handleClose}
        formData={formData}
        showModal={showModal}
        mode={mode}
        setMode={setMode}
        btnBgColor={btnBgColor}
      />
    </>
  );
};

export default ContentPage;
