import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import Settings from "./Settings";

function NavBar({ studentData }) {
  const { theme, toggleTheme } = useTheme();
  // console.log("NavBar: ", studentData);

  const handleLogout = () => {
    console.log("User logged out! Implement logout logic here.");
    localStorage.removeItem("user");
    localStorage.removeItem("allowedPath");
    localStorage.removeItem("exerciseProgress");
    window.location.href = "/";
  };
  const handleProfile = () => {
    alert("Show profile modal");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
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
                  <Link className="nav-link" to="/admin/results">
                    Results
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/accounts">
                    Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/contents">
                    Contents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/questions">
                    Questions
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
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
