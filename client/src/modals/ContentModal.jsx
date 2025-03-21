import React from "react";

function ContentModal({
  theme,
  onChange,
  onSubmit,
  onClose,
  formData,
  showModal,
  mode,
  btnBgColor,
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
              {mode === "ADD" ? "Add New Content" : "Update Content"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => onClose()}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
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
                  onChange={onChange}
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
                  onChange={onChange}
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
                  onChange={onChange}
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
                  onChange={onChange}
                  required
                  placeholder="Enter Category"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
                <button type="submit" className={`btn ${btnBgColor}`}>
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
