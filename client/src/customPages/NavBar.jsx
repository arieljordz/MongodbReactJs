import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import Settings from "./Settings";
import UserProfileModal from "../modals/UserProfileModal";

function NavBar({ studentData, moveToNextStep, allowedPath }) {
  const { theme, toggleTheme, navBgColor, toggleNavBar, cardBgColor, btnBgColor } =
    useTheme();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  // console.log("NavBar: ", studentData);

  const handleLogout = () => {
    console.log("User logged out! Implement logout logic here.");
    localStorage.removeItem("user");
    localStorage.removeItem("allowedPath");
    // localStorage.removeItem("progress");

    localStorage.setItem("allowedPath", "/student/home");
    // moveToNextStep();
    window.location.href = "/";
  };

  const handleProfile = () => {
    setShowModal(true);
    setShowDropdown(false);
  };

  const handleCloseProfile = () => {
    setShowModal(false);
  };

  const handleClick = (path) => {
    moveToNextStep(); // Call your function
    // navigate(path); // Navigate after function execution
    setTimeout(() => {
      window.location.href = path; // Navigate programmatically
    }, 100);
  };

  return (
    <div>
      <nav className={`navbar navbar-expand-lg fixed-top ${navBgColor}`}>
        <div className="container">
          <label className="navbar-brand">E-Learning</label>

          {/* Navbar Toggler for Mobile View */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {studentData?.userType === "teacher" && (
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={() => handleClick("/admin/results")}
                  >
                    Results
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={() => handleClick("/admin/accounts")}
                  >
                    Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={() => handleClick("/admin/contents")}
                  >
                    Contents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={() => handleClick("/admin/questions")}
                  >
                    Questions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={() => handleClick("/admin/appsettings")}
                  >
                    AppSettings
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Move Settings Outside the Collapsible Menu for Mobile View */}
          <div className="d-flex ms-auto align-items-center">
            <Settings
              theme={theme}
              onProfile={handleProfile}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          </div>
        </div>
        <UserProfileModal
          theme={theme}
          onClose={handleCloseProfile}
          showModal={showModal}
          studentData={studentData}
        />
      </nav>
    </div>
  );
}

export default NavBar;
