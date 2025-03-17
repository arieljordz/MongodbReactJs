import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";

function AllResultPage({ moveToNextStep, allowedPath }) {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();
  const [results, setResults] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const studentId = studentData._id;
  // console.log("AllResultPage: ", studentData);

  const getExerciseResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getExerciseResults/${studentId}`
      );
      setResults(response.data);
      console.log("Results Response:", response.data);
    } catch (error) {
      console.error("Error fetching exercise results:", error);

      if (error.response) {
        return { error: error.response.data.message }; // Return API error message
      }
      return { error: "Network error or server unavailable" };
    }
  };

  const getContentWithQuestions = async (contentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getContentWithQuestions/${contentId}`
      );

      setSelectedContent(response.data);
      console.log("ShowDetails Response:", response.data);
    } catch (error) {
      console.error("Error fetching content details:", error);
    }
  };

  const handleShowDetails = async (contentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getStudentsAnswer/${contentId}/${studentId}`
      );

      setSelectedContent(response.data);
      console.log("ShowDetails Response:", response.data);
    } catch (error) {
      console.error("Error fetching content details:", error);
    }
  };

  useEffect(() => {
    getExerciseResults();
  }, []);

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
                <a children="text-blue">Results</a>
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
          <h2 className="card-title font-weight-bold m-0">🎯 Results!</h2>
        </div>

        {/* Card Body */}
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          {results.length > 0 ? (
            <>
              <div className="table-responsive">
                {/* Main Results Table */}
                <table className="table table-striped table-bordered">
                  <thead
                    className={theme === "dark" ? "table-dark" : "table-light"}
                  >
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Total Items</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => {
                      const percentage = Math.round(
                        (result.correctCount / result.totalCount) * 100
                      );

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{result.title}</td>
                          <td>{result.totalCount}</td>
                          <td>{result.correctCount}</td>
                          <td>{percentage}%</td>
                          <td>
                            <span
                              className={`badge ${
                                percentage >= 75 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {percentage >= 75 ? "Passed" : "Failed"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() =>
                                handleShowDetails(result.contentId)
                              }
                            >
                              See Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Display Question */}
              <div
                className={`card mt-4 p-3 ${
                  theme === "dark" ? "bg-dark text-white" : ""
                }`}
              >
                <h4
                  className={`${
                    theme === "dark" ? "text-light" : "text-primary"
                  }`}
                >
                  {selectedContent?.title}
                </h4>
                {selectedContent ? (
                  <div
                    className={`border rounded p-3 text-start ${
                      theme === "dark" ? "border-light" : "border-dark"
                    }`}
                  >
                    {selectedContent.questions.map((q, index) => {
                      return (
                        <div key={q.id} className="mb-3">
                          {/* Question aligned to the left */}
                          <h5>
                            {index + 1}. {q.question}
                          </h5>

                          {/* Answers aligned to the left */}
                          <div className="d-flex flex-column">
                            {["A", "B", "C", "D"].map((option) => {
                              // Check if the student selected this option
                              const isSelected = Array.isArray(
                                q.studentSelectedAnswers
                              )
                                ? q.studentSelectedAnswers.includes(option)
                                : false;

                              // Check if this option is the correct answer
                              const isCorrect = q[`answer${option}Check`];

                              return (
                                <div key={option} className="form-check mt-2">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    disabled
                                    checked={isSelected}
                                  />
                                  <label
                                    className={`ms-2 ${
                                      isSelected
                                        ? isCorrect
                                          ? "text-success"
                                          : "text-danger"
                                        : ""
                                    }`}
                                  >
                                    {option}) {q[`answer${option}`]}{" "}
                                    {isSelected
                                      ? isCorrect
                                        ? "✅"
                                        : "❌"
                                      : ""}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    className={`${
                      theme === "dark" ? "text-light" : "text-muted"
                    }`}
                  >
                    No question available.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-muted">No results available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllResultPage;
