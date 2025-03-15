import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

function GoogleLoginButton({ userDetails, navigate, setStudentData }) {
  const [students, setStudents] = useState([]);
  // console.log("GoogleLoginButton: ", setStudentData);

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

    // User Data
    const userData = {
      email: decoded.email,
      userType: userDetails.userType,
      firstName: decoded.given_name,
      lastName: decoded.family_name,
    };

    const validatedStudent = validateUser(userData);

    // If the user is not registered
    if (!validatedStudent) {
      toast.warning("Unauthorized: Email address is not registered.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
      console.error("Unauthorized: Email address is not registered.");
      return;
    }

    // Store validated user data
    localStorage.setItem("user", JSON.stringify(validatedStudent));

    // Pass student details to parent component
    setStudentData(validatedStudent);

    // Redirect based on userType
    navigate(
      validatedStudent.userType === "student" ? "/home" : "/results",
      { state: validatedStudent }
    );
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
