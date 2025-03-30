import React, { useState, useEffect, useRef } from "react";

function Settings({
  theme,
  onProfile,
  onToggleTheme,
  onLogout,
  showDropdown,
  setShowDropdown,
  navBgColor,
  toggleNavBar,
  cardBgColor,
  btnBgColor,
  navColor,
  setNavColor,
}) {
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

  const colors = [
    "navbar-dark",
    "navbar-light",
    "navbar-primary",
    "navbar-secondary",
    "navbar-info",
    "navbar-success",
    "navbar-warning",
    "navbar-danger",
  ];

  const handleChange = (e) => {
    const selectedColor = e.target.value;
    setNavColor(selectedColor);
    toggleNavBar(selectedColor);
  };

  return (
    <>
      <div className="dropdown ms-auto" ref={dropdownRef}>
        <i
          className="fas fa-user-circle fa-2x text-secondary"
          style={{ cursor: "pointer" }}
          onClick={() => setShowDropdown(!showDropdown)}
        ></i>

        {showDropdown && (
          <div
            className="dropdown-menu show dropdown-menu-start"
            style={{ left: "auto", right: "0" }} // Force it to align left
          >
            <button className="dropdown-item btn btn-sm" onClick={onProfile}>
              <i className="fas fa-user"></i> Profile
            </button>
            <button
              className="dropdown-item btn btn-sm"
              onClick={onToggleTheme}
            >
              <i
                className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}
              ></i>
              {theme === "dark" ? " Light Mode" : " Dark Mode"}
            </button>
            <div className="dropdown-item ps-3">
              <label className="form-label d-block small mb-1">
                <i className="fas fa-palette"></i> Navbar Color
              </label>
              <select
                className="form-select form-select-sm"
                style={{ fontSize: "0.85rem", padding: "2px 6px" }} 
                value={navBgColor}
                onChange={(e) => {
                  const selectedColor = e.target.value;
                  setNavColor(selectedColor);
                  toggleNavBar(selectedColor);
                }}
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color.replace("navbar-", "").charAt(0).toUpperCase() +
                      color.replace("navbar-", "").slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="dropdown-item btn btn-sm text-danger"
              onClick={onLogout}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Settings;
