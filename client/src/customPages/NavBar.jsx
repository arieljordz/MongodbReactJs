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
    window.location.href = "/";
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
        <div className="container">
          <label className="navbar-brand">MyApp</label>
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
            <ul className="navbar-nav me-auto">
              {studentData?.userType === "student" ? (
                <>
                  {/* <li className="nav-item">
                    <Link className="nav-link" to="/home">
                      | Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/exercises">
                      | Exercises
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/result">
                      | Result
                    </Link>
                  </li> */}
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/result">
                      | Result
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/account">
                      | Student
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/content">
                      | Content
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/question">
                      | Question
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Right-aligned User Info and Logout */}
            <ul className="navbar-nav">
              {/* {studentData && (
                <li className="nav-item">
                  <label className="nav-link text-white">
                    {studentData.email}
                  </label>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  Logout
                </Link>
              </li>
              <button
                className="btn btn-outline-secondary"
                onClick={toggleTheme}
              >
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button> */}
              <Settings
                theme={theme}
                onToggleTheme={toggleTheme}
                onLogout={handleLogout}
              />
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
