import React from "react";

const NavBarColor = ({ navBgColor, toggleNavBar, navColor, setNavColor }) => {
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
    <div className="mb-2 text-left">
      <label className="form-label d-block text-start">Navbar Color (active):</label>
      <select
        className="form-select"
        value={navBgColor}
        onChange={handleChange}
        // onChange={(e) => toggleNavBar(e.target.value)}
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
