import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";

function ContentModal({
  fetchContents,
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
      if (mode === "ADD") {
        console.log("Add payload:", formData);
        await axios.post("http://localhost:3001/createContent", formData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Content added successfully!", {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      } else {
        console.log("Update payload:", formData);
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
        setShowModal(false);
      }

      fetchContents();
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to process request.");
    }
    setSelectedRow(null);
    setSelectedContent(null);
    setActiveDropdown(null);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setShowModal(false);
    setSelectedRow(null);
    setSelectedContent(null);
    setActiveDropdown(null);
  };

  // console.log(selectedContent);
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
              {mode === "ADD" ? "Add New Content" : "Update Content"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCancel}
            ></button>
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
                  placeholder="Enter Title"
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
                  placeholder="Enter Description"
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
                  required
                  placeholder="Enter Link"
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
                  placeholder="Enter Category"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
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

export default ContentModal;
