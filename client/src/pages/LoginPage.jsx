import React, { useState } from "react";
import GoogleLoginButton from "../customPages/GoogleLoginButton";
import { useTheme } from "../customPages/ThemeContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    userType: "student",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className={`d-flex flex-column justify-content-center align-items-center vh-100 bg-light${theme}`}>
      <div className="card shadow p-4 text-start" style={{ width: "350px" }}>
        <h3 className="mb-4 text-center">Login</h3>

        {/* Name Inputs */}
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstname"
            name="firstName"
            placeholder="First Name"
            value={userDetails.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastname"
            name="lastName"
            placeholder="Last Name"
            value={userDetails.lastName}
            onChange={handleChange}
            required
          />
        </div>

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

        {/* Google Login Button */}
        <GoogleLoginButton userDetails={userDetails} navigate={navigate} />
      </div>
    </div>
  );
}

export default LoginPage;
