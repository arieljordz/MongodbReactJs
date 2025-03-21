import React from "react";

const StudentModal = ({
  theme,
  onChange,
  onSubmit,
  onClose,
  formData,
  showModal,
  mode,
  btnBgColor,
}) => {
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
              {mode === "ADD" ? "Add New Student" : "Update Student"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => onClose()}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              {["firstname", "middlename", "lastname", "email"].map(
                (field, index) => (
                  <div className="mb-3" key={index}>
                    <label htmlFor={field} className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      className="form-control"
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={onChange}
                      required={field !== "middlename"}
                      placeholder={`Enter ${
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }`}
                    />
                  </div>
                )
              )}

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="userType"
                  value={formData.userType}
                  onChange={onChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
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
};

export default StudentModal;
