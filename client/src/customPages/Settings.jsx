import React, { useState } from "react";
import { Link } from "react-router-dom";

function Settings({ theme, onToggleTheme, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="dropdown">
      {/* Cog Icon to Toggle Dropdown */}
      <i
        className="fas fa-cog fa-2x text-secondary"
        style={{ cursor: "pointer" }}
        onClick={() => setShowDropdown(!showDropdown)}
      ></i>

      {showDropdown && (
        <div className="dropdown-menu show" style={{ right: 0, left: "auto" }}>
          <Link className="dropdown-item" to="/contents">
            <i className="fas fa-user"></i> Profile
          </Link>
          
          {/* Theme Toggle Button with Dynamic Icon */}
          <button className="dropdown-item" onClick={onToggleTheme}>
            <i className={theme === "dark" ? "fas fa-moon" : "fas fa-sun"}></i> 
            {theme === "dark" ? " Dark Mode" : " Light Mode"}
          </button>

          <div className="dropdown-divider"></div>
          
          {/* Logout Button */}
          <button className="dropdown-item text-danger" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Settings;
