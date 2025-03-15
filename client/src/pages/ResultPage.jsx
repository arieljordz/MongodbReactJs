import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";

function ResultPage() {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();
  const results = [
    { title: "Math Quiz", score: 85 },
    { title: "Science Test", score: 70 },
    { title: "History Exam", score: 92 },
  ];

  console.log("ResultPage: ", studentData);

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
                <a children="text-blue">Result</a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className={`card card-${theme}`}>
        <div className="card-header">
          <h3 className="card-title">Results</h3>
        </div>
        {/* /.card-header */}
        <div className="card-body">
          {results.length > 0 ? (
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{result.title}</td>
                    <td>{result.score}%</td>
                    <td>
                      <span
                        className={`badge ${
                          result.score >= 75 ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {result.score >= 75 ? "Passed" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-muted">No results available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
