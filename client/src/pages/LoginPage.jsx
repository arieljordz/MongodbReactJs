import React, { useState } from "react";
import GoogleLoginButton from "../customPages/GoogleLoginButton";
import { useTheme } from "../customPages/ThemeContext";
import { useNavigate } from "react-router-dom";

function LoginPage({ setStudentData }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    userType: "student",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center vh-100 bg-light${theme}`}
    >
      <div className="card shadow p-4 text-start" style={{ width: "350px" }}>
        <h3 className="mb-4 text-center">Login</h3>

        {/* User Type Selection */}
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="userType"
            value={userDetails.userType}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Category Selection */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            name="category"
            value={userDetails.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="english">English</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="history">History</option>
          </select>
        </div>

        {/* Google Login Button */}
        <GoogleLoginButton
          userDetails={userDetails}
          setStudentData={setStudentData}
        />
      </div>
    </div>
  );
}

export default LoginPage;
