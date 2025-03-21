import React from "react";

const NavBarColor = ({ navBgColor, toggleNavBar }) => {
  const colors = [
    "navbar-light",
    "navbar-dark",
    "navbar-primary",
    "navbar-secondary",
    "navbar-info",
    "navbar-success",
    "navbar-warning",
    "navbar-danger",
  ];

  return (
    <div className="mb-3">
      <label className="form-label">Navbar Color</label>
      <select
        className="form-select"
        value={navBgColor}
        onChange={(e) => toggleNavBar(e.target.value)}
      >
        {colors.map((color) => (
          <option key={color} value={color}>
            {color.charAt(0) + color.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NavBarColor;
