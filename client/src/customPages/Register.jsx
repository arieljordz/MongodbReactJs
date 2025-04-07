import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function Register({ onBackToLogin }) {
  const API_URL = import.meta.env.VITE_BASE_API_URL;

  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    userType: "student",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("info");

  const toastRef = useRef();

  useEffect(() => {
    if (toastMsg) {
      const toast = new bootstrap.Toast(toastRef.current);
      toast.show();
    }
  }, [toastMsg]);

  const showToast = (message, type = "info") => {
    setToastMsg(message);
    setToastType(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/createPerson`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.success) {
        showToast("Registration successful! Check your email for verification.", "success");
        setFormData({
          firstname: "",
          middlename: "",
          lastname: "",
          email: "",
          userType: "student",
        });
      } else {
        showToast("Registration failed. Please try again.", "danger");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("An error occurred during registration.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow p-4" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Register</h3>

        <form onSubmit={handleRegister}>
          {["firstname", "middlename", "lastname", "email"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label text-capitalize">
                {field === "firstname"
                  ? "First Name"
                  : field === "middlename"
                  ? "Middle Name"
                  : field === "lastname"
                  ? "Last Name"
                  : "Email"}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                className="form-control"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required={field !== "middlename"}
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Sending email...
              </>
            ) : (
              "Register"
            )}
          </button>

          <button
            type="button"
            className="btn btn-link w-100 mt-2"
            onClick={onBackToLogin}
            disabled={isLoading}
          >
            Back to Login
          </button>
        </form>
      </div>

      {/* Toast container */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div
          className={`toast align-items-center text-white bg-${toastType} border-0`}
          role="alert"
          ref={toastRef}
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMsg}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
