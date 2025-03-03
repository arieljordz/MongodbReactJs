import React, { useState } from "react";
import axios from "axios";

function UpdateContentModal({ fetchContents }) {
  const initialFormState = { title: "", description: "", link: "", category: "" };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/createContent", formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Content added successfully!");
      setFormData(initialFormState); // Reset form fields

      fetchContents(); // Reload table data

      // Close modal
      document.querySelector("#exampleModal .btn-close").click();
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to add content. Please try again.");
    }
  };

  // **Reset fields when clicking Cancel**
  const handleCancel = () => {
    setFormData(initialFormState);
  };

  return (
    <div>
      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Add New Content</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancel} />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea className="form-control" id="description" name="description" rows={3} value={formData.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="link" className="form-label">Link</label>
                  <input type="url" className="form-control" id="link" name="link" value={formData.link} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <input type="text" className="form-control" id="category" name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div className="d-flex justify-content-end">
                  {/* Cancel Button - Calls handleCancel */}
                  <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateContentModal;
