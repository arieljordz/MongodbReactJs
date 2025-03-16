import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";
import { useNavigate } from "react-router-dom";

function CongratsPage( allowedPath ) {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();
  const navigate = useNavigate();

  console.log("CongratsPage: ", allowedPath);

  return (
    <div className={`container mt-6 ${theme}`}>
      <div className="content-header">
        <div className="d-flex justify-content-start">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a children="text-blue">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a children="text-blue">Congratulations</a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div
        className={`card card-${theme} shadow-lg rounded-lg text-center mx-auto`}
      >
        {/* Card Header */}
        <div
          className={`card-header ${
            theme === "dark"
              ? "bg-success-dark-mode text-white"
              : "bg-success text-white"
          } py-3 d-flex justify-content-center`}
        >
          <h2 className="card-title font-weight-bold m-0">
            🎉 Congratulations!
          </h2>
        </div>
        {/* /.card-header */}
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <p className="lead">
            You did an amazing job! Keep up the great work! 🚀
          </p>

          <button
            className="btn btn-primary mt-3 px-4 py-2 rounded-lg shadow-sm"
            onClick={() => navigate("/student/results")}
          >
            🎯 See Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default CongratsPage;
