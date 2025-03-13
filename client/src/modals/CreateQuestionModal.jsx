import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SearchableSelect from "../customPages/SearchableSelect";
import { useTheme } from "../customPages/ThemeContext";

function CreateQuestionModal({
  fetchQuestions,
  contents,
  selectedContent,
  setSelectedContent,
  showModal,
  setShowModal,
  selectedTitle,
  setSelectedTitle,
}) {
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
  const { theme } = useTheme();

  useEffect(() => {
    if (selectedContent) {
      setFormData(selectedContent);
    } else {
      setFormData(initialFormState);
    }
  }, [selectedContent]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure at least one checkbox is checked
    if (
      !formData.answerACheck &&
      !formData.answerBCheck &&
      !formData.answerCCheck &&
      !formData.answerDCheck
    ) {
      toast.warning("Please select at least one correct answer.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
      return;
    }
    try {
      // console.log(selectedContent);
      if (selectedContent !== null && formData._id) {
        await axios.put(
          `http://localhost:3001/updateQuestion/${formData._id}`,
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success("Question updated successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
        setShowModal(false);
      } else {
        if (selectedTitle) {
          const payload = {
            ...formData,
            contentId: selectedTitle?._id || "",
          };

          console.log(payload);

          await axios.post(
            "http://localhost:3001/createQuestionByContent",
            payload,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          toast.success("Question added successfully!", {
            autoClose: 2000,
            position: "top-right",
            closeButton: true,
          });
          // Close modal
          // setShowModal(false);
        } else {
          toast.warning("Please select title first.", {
            autoClose: 2000,
            position: "top-right",
            closeButton: true,
          });
        }
      }
      fetchQuestions();
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
    setShowModal(false);
    setSelectedContent(null);
    setSelectedTitle(null);
  };

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
              {selectedContent ? "Edit Question" : "Add New Question"}
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
              <SearchableSelect
                contents={contents}
                selectedContent={selectedContent}
                setSelectedContent={setSelectedContent}
                selectedTitle={selectedTitle}
                setSelectedTitle={setSelectedTitle}
              />
              {/* Question Input */}
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
                  {selectedContent ? "Update" : "Submit"}
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
