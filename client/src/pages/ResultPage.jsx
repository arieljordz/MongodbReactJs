import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import { useTheme } from "../customPages/ThemeContext";
import Header from "../customPages/Header";
import { getItemWithExpiry } from "../utils/storageUtils";

const ResultPage = () => {
  const API_URL = import.meta.env.VITE_BASE_API_URL;
  const {
    theme,
    toggleTheme,
    navBgColor,
    toggleNavBar,
    cardBgColor,
    btnBgColor,
  } = useTheme();
  const studentData = getItemWithExpiry("user") || {};
  const [results, setResults] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      // Validate studentData before API call
      if (!studentData?._id || !studentData?.category) {
        console.warn("Student data is missing.");
        return;
      }

      // Fetch progress from database
      const response = await axios.get(
        `${API_URL}/getProgress/${studentData._id}/${
          studentData.category
        }/${true}`
      );

      if (response.data && response.data.progress) {
        setResults(formatProgressData(response.data));
        console.log("Fetched response:", response.data);
        console.log("Formatted progress:", formatProgressData(response.data));
      } else {
        console.warn("No progress found in DB.");
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // Function to format progress data
  const formatProgressData = (progressData) => {
    const { _id, isRetake, progress } = progressData;

    return progress.map(({ contentId, answeredQuestions }) => {
      const totalCount = answeredQuestions.length;
      const correctCount = answeredQuestions.filter((q) => q.isCorrect).length;

      return {
        progressId: _id,
        isRetake,
        contentId: contentId?._id || "Unknown Content ID",
        title: contentId?.title || "Unknown Title",
        totalCount,
        correctCount,
        percentage:
          totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0,
        questions: answeredQuestions.map(
          ({ questionId, selectedAnswers, isCorrect }) => ({
            questionId: questionId?._id || "Unknown Question ID",
            question: questionId?.question || "No question available",
            answers: {
              A: questionId?.answerA || "N/A",
              B: questionId?.answerB || "N/A",
              C: questionId?.answerC || "N/A",
              D: questionId?.answerD || "N/A",
            },
            correctAnswers: {
              A: questionId?.answerACheck || false,
              B: questionId?.answerBCheck || false,
              C: questionId?.answerCCheck || false,
              D: questionId?.answerDCheck || false,
            },
            selectedAnswers: selectedAnswers || [],
            isCorrect: isCorrect ?? false, // Default to false if undefined
          })
        ),
      };
    });
  };

  const handleRequestRetake = async () => {
    try {
      await axios.put(
        `${API_URL}/requestDeclineRetake/${results[0]?.progressId}`,
        {
          isRetake: false,
        }
      );
      fetchProgress();
      toast.success("Request has been sent!");
    } catch (error) {
      console.error("Error sending retake request:", error);
    }
  };

  const retakeStatus = {
    null: "Request Retake",
    false: "Request Pending",
    true: "Request Accepted",
  };

  // Enable button only if at least one result has isRetake === null
  const isDisabled = results[0]?.isRetake === null ? false : true;

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="Results" />
      <div
        className={`card shadow-lg rounded-lg text-center mx-auto card-${theme}`}
      >
        <div
          className={`card-header ${cardBgColor} py-3 d-flex justify-content-between`}
        >
          <h2 className="card-title font-weight-bold m-0">🎯 Results</h2>
        </div>
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <div className="d-flex justify-content-end mb-2">
            <button
              className={`btn ${btnBgColor}`}
              onClick={handleRequestRetake}
              disabled={isDisabled}
            >
              <i className="fa-solid fa-paper-plane"></i>{" "}
              {results.length > 0
                ? retakeStatus[results[0].isRetake]
                : "Request Retake"}
            </button>
          </div>
          {results.length > 0 ? (
            <ResultsTable
              results={results}
              setSelectedContent={setSelectedContent}
              theme={theme}
              btnBgColor={btnBgColor}
            />
          ) : (
            <p className="text-center text-muted">No results available.</p>
          )}
          {selectedContent && (
            <ResultDetails selectedContent={selectedContent} theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
};

const ResultsTable = ({ results, setSelectedContent, theme, btnBgColor }) => (
  <div className="table-responsive">
    <table className="table table-striped table-bordered">
      <thead className={theme === "dark" ? "table-dark" : "table-light"}>
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
        {results.map((result, index) => (
          <tr key={result.contentId}>
            <td>{index + 1}</td>
            <td>{result.title}</td>
            <td>{result.totalCount}</td>
            <td>{result.correctCount}</td>
            <td>{result.percentage}%</td>
            <td>
              <span
                className={`badge ${
                  result.percentage >= 75 ? "bg-success" : "bg-danger"
                }`}
              >
                {result.percentage >= 75 ? "Passed" : "Failed"}
              </span>
            </td>
            <td>
              <button
                className={`btn ${btnBgColor} btn-sm`}
                onClick={() => setSelectedContent(result)}
              >
                See Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ResultDetails = ({ selectedContent, theme }) => (
  <div
    className={`card mt-4 p-3 ${theme === "dark" ? "bg-dark text-white" : ""}`}
  >
    <h4 className={theme === "dark" ? "text-light" : "text-primary"}>
      {selectedContent.title}
    </h4>
    <div
      className={`border rounded p-3 text-start ${
        theme === "dark" ? "border-light" : "border-dark"
      }`}
    >
      {selectedContent.questions?.length > 0 ? (
        selectedContent.questions.map((q, index) => (
          <div key={q.questionId || index} className="mb-3">
            <h5>
              {index + 1}. {q.question}
            </h5>
            <div className="d-flex flex-column">
              {Object.entries(q.answers).map(([key, answerText]) => {
                const isSelected = q.selectedAnswers.includes(key);
                const isCorrect = q.correctAnswers[key];

                return (
                  <div key={key} className="form-check mt-2">
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
                      {key}) {answerText}{" "}
                      {isSelected ? (isCorrect ? "✅" : "❌") : ""}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <p className={theme === "dark" ? "text-light" : "text-muted"}>
          No questions available.
        </p>
      )}
    </div>
  </div>
);

export default ResultPage;
