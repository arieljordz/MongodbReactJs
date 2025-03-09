import React from 'react'
import { GoogleLogin } from "@react-oauth/google"
import jwt_decode from "jwt-decode"
import { useNavigate } from "react-router-dom"

function GoogleLoginButton() {
    const navigate = useNavigate();
    const handleSuccess = (response) => {
        const decoded = jwt_decode(response.credential);
        console.log("User Info:", decoded);

        // Store user data in localStorage or state (optional)
        localStorage.setItem("user", JSON.stringify(decoded));

        // Redirect to ContentPage Page
        navigate("/exercises");
      };
    
      const handleFailure = () => {
        console.log("Google login failed");
      };
    
      return (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleFailure}
        />
      );
}

export default GoogleLoginButton
