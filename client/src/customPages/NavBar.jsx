import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import Settings from "./Settings";
import { useNavigate } from "react-router-dom";

function NavBar({ studentData, moveToNextStep, allowedPath }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  // console.log("NavBar: ", studentData);

  const handleLogout = () => {
    console.log("User logged out! Implement logout logic here.");
    localStorage.removeItem("user");
    localStorage.removeItem("allowedPath");
    // localStorage.removeItem("progress");

    // let path = studentData?.userType = "student"?"/student/home":"/admin/results";
    localStorage.setItem("allowedPath", "/student/home");
    // moveToNextStep();
    window.location.href = "/";
  };

  const handleProfile = () => {
    alert("Show profile modal");
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
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
