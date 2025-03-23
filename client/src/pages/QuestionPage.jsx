import React from "react";
import useQuestions from "../hooks/useQuestions";
import QuestionModal from "../modals/QuestionModal";
import Header from "../customPages/Header";
import QuestionTable from "../tables/QuestionTable";

const QuestionPage = () => {
  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const {
    theme,
    contents,
    questions,
    fetchQuestions,
    toggleExpand,
    expanded,
    setExpanded,
    handleDelete,
    handleRowClick,
    handleChange,
    handleSubmit,
    handleClose,
    formData,
    setFormData,
    selectedRow,
    setSelectedRow,
    handleOpenModal,
    selectedQuestion,
    setSelectedQuestion,
    showModal,
    setShowModal,
    mode,
    setMode,
    cardBgColor,
    btnBgColor,
  } = useQuestions();
  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="Questions" />
      <div
        className={`card shadow-lg rounded-lg text-center mx-auto card-${theme}`}
      >
        <div
          className={`card-header ${cardBgColor} py-3 d-flex justify-content-between`}
        >
          <h2 className="card-title font-weight-bold m-0">📝 Questions</h2>
        </div>
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <div className="mb-3 row g-2 align-items-center">
            <div className="col-12 col-md-1">
              <button
                type="button"
                className={`btn ${btnBgColor} w-100`}
                onClick={() => handleOpenModal()}
              >
                Add New
              </button>
            </div>
          </div>
          <QuestionTable
            questionsData={questions}
            theme={theme}
            toggleExpand={toggleExpand}
            expanded={expanded}
            setExpanded={setExpanded}
            onRowClick={handleRowClick}
            onUpdate={handleOpenModal}
            onDelete={handleDelete}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        </div>
      </div>
      <QuestionModal
        theme={theme}
        fetchQuestions={fetchQuestions}
        contents={contents}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        formData={formData}
        setFormData={setFormData}
        showModal={showModal}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={handleClose}
        mode={mode}
        setMode={setMode}
        btnBgColor={btnBgColor}
      />
    </div>
  );
};

export default QuestionPage;
