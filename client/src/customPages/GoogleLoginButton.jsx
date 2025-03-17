import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

function GoogleLoginButton({ userDetails, setStudentData }) {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  // console.log("GoogleLoginButton: ", userDetails);

  // Fetch students data
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getPersons/all");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Validate user and return their details
  const validateUser = (userData) => {
    return students.find(
      (student) =>
        student.email === userData.email &&
        student.userType === userData.userType
    );
  };

  const handleSuccess = (response) => {
    const decoded = jwt_decode(response.credential);
  
    // User Data from Google
    const userData = {
      email: decoded.email,
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      userType: userDetails.userType,
      category: userDetails.category, 
    };
  
    // console.log("userData: ", userData);
    const validatedStudent = validateUser(userData);
  
    if (!validatedStudent) {
      toast.warning("Unauthorized: Email address is not registered.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
      console.error("Unauthorized: Email address is not registered.");
      return;
    }
  
    // Merge validated student data with category
    const updatedStudentData = { ...validatedStudent, category: userDetails.category };
  
    // Store updated user data in localStorage
    localStorage.setItem("user", JSON.stringify(updatedStudentData));
  
    // Pass student details to parent component
    setStudentData(updatedStudentData);
  };
  
  const handleFailure = () => {
    console.log("Google login failed");
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />;
}

export default GoogleLoginButton;
