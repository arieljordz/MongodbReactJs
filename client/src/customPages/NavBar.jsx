import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";

function NavBar() {
  const { theme, toggleTheme } = useTheme(); 
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          MyApp
        </Link>
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
            <li className="nav-item">
              <Link className="nav-link active" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/question">
                Question
              </Link>
            </li>
          </ul>
          {/* Right-aligned Logout Link */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-danger fw-bold" to="/">
                Logout
              </Link>
            </li>
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
