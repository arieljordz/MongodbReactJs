import React, { useState, useEffect } from "react";
import StudentModal from "../modals/StudentModal";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";
import Header from "../customPages/Header";

function AppSettingsPage({ moveToNextStep, allowedPath }) {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();

  console.log("Student User Data:", studentData);

  const [timeDuration, setTimeDuration] = useState("");
  const [isEnabled, setIsEnabled] = useState(true); // Add state for isEnabled
  const formData = { timeDuration, isEnabled };

  const handleSave = async (e) => {
    e.preventDefault();

    // Convert timeDuration to a number
    const duration = Number(timeDuration);

    // Validation
    if (!duration || isNaN(duration) || duration <= 0) {
      alert("Please enter a valid time duration.");
      return;
    }

    // Save to local storage
    // localStorage.setItem("timeDuration", duration);
    alert(`Time duration saved: ${duration} minutes`);

    const formData = { timeDuration: duration, isEnabled };

    try {
      await axios.post("http://localhost:3001/saveAppSettings", formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("App Settings saved!", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to process request.");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="App Settings" />
      <div
        className={`card card-${theme} shadow-lg rounded-lg mx-auto`}
        style={{ maxWidth: "400px" }}
      >
        {/* Card Header */}
        <div
          className={`card-header ${
            theme === "dark"
              ? "bg-success-dark-mode text-white"
              : "bg-success text-white"
          } py-3 d-flex justify-content-start`}
        >
          <h2 className="card-title font-weight-bold m-0">⚙️ App Settings</h2>
        </div>
        {/* Card Body */}
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <label className="form-label">Time Duration (in minutes):</label>
          <input
            type="number"
            className="form-control"
            value={timeDuration}
            onChange={(e) => setTimeDuration(e.target.value)}
            placeholder="Enter minutes"
            min="1"
          />
          <button className="btn btn-primary mt-3 w-100" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppSettingsPage;
