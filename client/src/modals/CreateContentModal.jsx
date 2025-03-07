import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";

function CreateContentModal({
  fetchContents,
  selectedContent,
  show,
}) {
  const initialFormState = {
    title: "",
    description: "",
    link: "",
    category: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const { theme } = useTheme();

  // Populate form when selectedContent changes
  useEffect(() => {
    if (selectedContent) {
      setFormData(selectedContent);
    } else {
      setFormData(initialFormState);
    }
  }, [selectedContent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedContent !== null && formData._id) {
        // console.log("Updating content:", formData._id);
        // Update existing content
        await axios.put(
          `http://localhost:3001/updateContent/${formData._id}`,
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success("Content updated successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });

        // Close modal properly
        const modalElement = document.getElementById("modalContent");
        if (modalElement) {
          const closeButton = modalElement.querySelector(
            '[data-bs-dismiss="modal"]'
          );
          if (closeButton) {
            closeButton.click();
          }
        }
      } else {
        // console.log("Creating new content:", formData);
        // Create new content
        await axios.post("http://localhost:3001/createContent", formData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Content added successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      }

      fetchContents(); // Reload table data
      setFormData(initialFormState); // Reset form fields
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to process request.");
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
  };

  // console.log(selectedContent);
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""} ${theme}`}
      id="modalContent"
      tabIndex={-1}
      aria-labelledby="modalContentLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalContentLabel">
              {selectedContent ? "Edit Content" : "Add New Content"}
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
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="link" className="form-label">
                  Link
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
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

export default CreateContentModal;
