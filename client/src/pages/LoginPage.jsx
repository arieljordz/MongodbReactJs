import React from "react";
import GoogleLoginButton from "../customPages/GoogleLoginButton";
import { useTheme } from "../customPages/ThemeContext";

function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center vh-100 bg-light${theme}`}
    >
      {/* Select Type Dropdown */}
      <div className="d-flex align-items-center mb-3">
        <label className="me-2 mt-1">Type:</label>
        <select className="form-select">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      {/* Card with Google Login */}
      <div className="card shadow p-4 text-center" style={{ width: "350px" }}>
        <h3 className="mb-4">Google Login</h3>
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
