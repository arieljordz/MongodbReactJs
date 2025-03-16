import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Settings({ theme, onProfile, onToggleTheme, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // Reference for detecting outside clicks

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="dropdown ms-auto" ref={dropdownRef}>
      <i
        className="fas fa-user-circle fa-2x text-secondary"
        style={{ cursor: "pointer" }}
        onClick={() => setShowDropdown(!showDropdown)}
      ></i>

      {showDropdown && (
        <div className="dropdown-menu show dropdown-menu-end">
          <button className="dropdown-item btn btn-sm" onClick={onProfile}>
            <i className="fas fa-user"></i> Profile
          </button>
          <button className="dropdown-item btn btn-sm" onClick={onToggleTheme}>
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
            {theme === "dark" ? " Light Mode" : " Dark Mode"}
          </button>
          <button
            className="dropdown-item btn btn-sm text-danger"
            onClick={onLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Settings;
