import React from "react";

const UserProfileModal = ({ theme, onClose, showModal, studentData }) => {
  if (!showModal) return null; // Prevent rendering if not visible

  // Dynamic Theme Styles
  const isDarkMode = theme === "dark";
  const modalBgClass = isDarkMode ? "bg-dark text-white" : "bg-white";
  const borderColor = isDarkMode ? "border-light" : "border-primary";
  const emailTextClass = isDarkMode ? "text-white-50" : "text-muted";

  // Format userType (Capitalize first letter)
  const formattedUserType = studentData.userType
    ? studentData.userType.charAt(0).toUpperCase() +
      studentData.userType.slice(1)
    : "N/A";

  // Format category (Capitalize first letter)
  const formattedCategory = studentData.category
    ? studentData.category.charAt(0).toUpperCase() +
      studentData.category.slice(1)
    : "N/A";

  // Format dateAdded (March 22, 2025)
  const formattedDate = studentData.dateAdded
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(studentData.dateAdded))
    : "N/A";

  // Profile Picture (With Fallback)
  const profilePicture =
    studentData.picture || "https://via.placeholder.com/100";

  return (
    <div
      className={`modal fade show ${theme}`}
      tabIndex={-1}
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className={`modal-content shadow-lg ${modalBgClass}`}>
          {/* Modal Header */}
          <div className={`modal-header ${modalBgClass}`}>
            <h5 className="modal-title fw-bold">User Profile</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body text-center">
            {/* Profile Image */}
            <div className="mb-3">
              <img
                src={profilePicture}
                alt="Profile"
                className={`rounded-circle border border-2 ${borderColor} img-fluid`}
                width="100"
                height="100"
              />
            </div>

            {/* User Details */}
            <h5 className="fw-bold mb-1">
              {`${studentData.firstname || "N/A"} ${
                studentData.lastname || ""
              }`}
            </h5>
            <p className={`mb-2 small ${emailTextClass}`}>
              {studentData.email || "N/A"}
            </p>

            {/* Static Info Section */}
            <div className="border p-3 rounded text-start small">
              <p className="mb-1">
                <strong>Role:</strong> {formattedUserType}
              </p>
              <p className="mb-1">
                <strong>Date Added:</strong> {formattedDate}
              </p>
              <p className="mb-1">
                <strong>Category:</strong> {formattedCategory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
