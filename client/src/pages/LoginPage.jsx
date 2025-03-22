import React, { useEffect, useState } from "react";
import GoogleLoginButton from "../customPages/GoogleLoginButton";
import { useTheme } from "../customPages/ThemeContext";
import axios from "axios";

function LoginPage({ setStudentData }) {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [userDetails, setUserDetails] = useState({
    userType: "student",
    category: "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Set default active category when categories change
    const activeCat = categories.find((cat) => cat.isActive);
    if (activeCat) {
      setUserDetails((prev) => ({
        ...prev,
        category: activeCat.description,
      }));
    }
  }, [categories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getCategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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
            {categories.map((cat) => (
              <option key={cat._id} value={cat.description}>
                {cat.description}
              </option>
            ))}
          </select>
        </div>

        {/* Google Login Button */}
        <GoogleLoginButton userDetails={userDetails} setStudentData={setStudentData} />
      </div>
    </div>
  );
}

export default LoginPage;
