import React from "react";
import SearchableSelect from "../customPages/SearchableSelect";

function QuestionModal({
  theme,
  fetchQuestions,
  contents,
  selectedQuestion,
  setSelectedQuestion,
  formData,
  setFormData,
  showModal,
  onChange,
  onSubmit,
  onClose,
  mode,
  setMode,
}) {
  return (
    <div
      className={`modal fade ${showModal ? "show d-block" : ""} ${theme}`}
      tabIndex={-1}
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "EDIT" ? "Update Question" : "Add New Question"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => onClose()}
            />
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              <SearchableSelect
                fetchQuestions={fetchQuestions}
                contents={contents}
                selectedQuestion={selectedQuestion}
                setSelectedQuestion={setSelectedQuestion}
                formData={formData}
                setFormData={setFormData}
                mode={mode}
                setMode={setMode}
              />
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
                  onChange={onChange}
                  required
                  placeholder="Enter your question here"
                />
              </div>

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
                      onChange={onChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`answer${letter}Check`}
                    >{`${letter}: `}</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`answer${letter}`}
                      name={`answer${letter}`}
                      value={formData[`answer${letter}`] || ""}
                      onChange={onChange}
                      required
                      placeholder={`Enter answer ${letter}`}
                    />
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {mode === "ADD" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionModal;
