import React, { useState } from "react"
import ContentTable from "../customPages/ContentTable"
import CreateContentModal from '../modals/CreateContentModal'

function HomeCopy() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/createContents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Content added successfully!");
        setFormData({ title: "", description: "", link: "", category: "" }); // Reset form
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add content. Please try again.");
    }
  };

  return (
    <div className="container mt-3">
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add New
      </button>
      <CreateContentModal />
      <ContentTable />
      <h2 className="mb-4">Add New Content</h2>
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
        {/* Buttons aligned to the right */}
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() =>
              setFormData({
                title: "",
                description: "",
                link: "",
                category: "",
              })
            }
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default HomeCopy
