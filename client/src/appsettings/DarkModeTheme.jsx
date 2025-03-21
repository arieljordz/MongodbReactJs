import React from "react";

const DarkModeTheme = ({ theme, toggleTheme }) => {
  return (
    <div className="mb-1">
      <label className="text-start">
        {theme === "dark" ? "Dark " : "Light "}Theme
      </label>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={theme === "dark" ? true : false}
          onChange={toggleTheme}
          style={{ width: "3rem", height: "1.5rem" }}
        />
      </div>
    </div>
  );
};

export default DarkModeTheme;
