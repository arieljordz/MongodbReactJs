import React, { useState } from "react";
import axios from "axios";

function CreateQuestionModal(selectedContent, setSelectedContent) {
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // console.log(selectedContent.selectedContent.title);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        contentId: selectedContent?.selectedContent?._id || "",
      };

      console.log(payload);

      await axios.post(
        "http://localhost:3001/createQuestionByContent",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Question added successfully!");
      setFormData(initialFormState);

      // Close modal
      document.querySelector("#modalQuestion .btn-close").click();
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

  return (
    <div
      className="modal fade"
      id="modalQuestion"
      tabIndex={-1}
      aria-labelledby="modalQuestionLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalQuestionLabel">
              Add Question
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleCancel}
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Question Input */}
              <div className="mb-1">
                <label htmlFor="title" className="form-label fw-bold">
                  {`Title: ${
                    selectedContent?.selectedContent?.title ||
                    "No Title Available"
                  }`}
                </label>
              </div>
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
  );
}

export default CreateQuestionModal;
