import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

function GoogleLoginButton({ userDetails, navigate }) {
  const handleSuccess = (response) => {
    const decoded = jwt_decode(response.credential);

    // Store user data in localStorage or state
    const userData = {
      ...decoded,
      ...userDetails,
    };
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect based on user type
    navigate(userDetails.userType === "student" ? "/exercises" : "/content", {
      state: userData,
    });
  };

  const handleFailure = () => {
    console.log("Google login failed");
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />;
}

export default GoogleLoginButton;
