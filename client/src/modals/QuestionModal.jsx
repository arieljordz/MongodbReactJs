import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SearchableSelect from "../customPages/SearchableSelect";
import { useTheme } from "../customPages/ThemeContext";

function QuestionModal({
  fetchQuestions,
  contents,
  selectedContent,
  setSelectedContent,
  showModal,
  setShowModal,
  mode,
  setMode,
  selectedRow,
  setSelectedRow,
  activeDropdown,
  setActiveDropdown,
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

    if (!selectedContent) {
      return toast.warning("Please select a title first.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    }

    if (
      !formData.answerACheck &&
      !formData.answerBCheck &&
      !formData.answerCCheck &&
      !formData.answerDCheck
    ) {
      return toast.warning("Please select at least one correct answer.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    }

    try {
      const sanitizedFormData = {
        question: formData.question || "",
        answerA: formData.answerA || "",
        answerACheck: !!formData.answerACheck,
        answerB: formData.answerB || "",
        answerBCheck: !!formData.answerBCheck,
        answerC: formData.answerC || "",
        answerCCheck: !!formData.answerCCheck,
        answerD: formData.answerD || "",
        answerDCheck: !!formData.answerDCheck,
        contentId: selectedContent?._id || formData.contentId || "",
      };

      const headers = { headers: { "Content-Type": "application/json" } };

      if (mode === "ADD") {
        console.log("Add payload:", sanitizedFormData);
        await axios.post(
          "http://localhost:3001/createQuestionByContent",
          sanitizedFormData,
          headers
        );
        toast.success("Question added successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      } else {
        const updatePayload = {
          ...sanitizedFormData,
          _id: formData._id,
          contentId: selectedContent.contentId._id,
        };
        console.log("Update payload:", updatePayload);
        await axios.put(
          `http://localhost:3001/updateQuestion/${formData._id}`,
          updatePayload,
          headers
        );
        toast.success("Question updated successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
        setShowModal(false);
      }

      fetchQuestions();
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add/update question. Please try again."
      );
    }

    setSelectedRow({});
    setActiveDropdown(null);
  };

  // **Reset fields when clicking Cancel**
  const handleCancel = () => {
    setFormData(initialFormState);
    setShowModal(false);
    setSelectedContent(null);
    setSelectedRow({});
    setActiveDropdown(null);
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
              {mode === "UPDATE" ? "Update Question" : "Add New Question"}
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
                fetchQuestions={fetchQuestions}
                contents={contents}
                selectedContent={selectedContent}
                setSelectedContent={setSelectedContent}
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
                  onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                  onClick={handleCancel}
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
