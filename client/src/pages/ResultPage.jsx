import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import { useTheme } from "../customPages/ThemeContext";
import Header from "../customPages/Header";

const ResultPage = () => {
  const { theme } = useTheme();
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const [results, setResults] = useState({});
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
        `http://localhost:3001/getProgress/${studentData._id}/${
          studentData.category
        }/${true}`
      );

      if (response.data && response.data.progress) {
        setResults(formatProgressData(response.data.progress));
        // console.log("Fetched response:", response.data);
        console.log(
          "Formatted progress:",
          formatProgressData(response.data.progress)
        );
      } else {
        console.warn("No progress found in DB.");
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load progress.");
    }
  };

  // Function to format progress data
  const formatProgressData = (progressData) =>
    progressData.map(({ contentId, answeredQuestions }) => ({
      contentId: contentId?._id,
      title: contentId?.title || "Unknown Title",
      totalCount: answeredQuestions.length,
      correctCount: answeredQuestions.filter((q) => q.isCorrect).length,
      percentage:
        answeredQuestions.length > 0
          ? Math.round(
              (answeredQuestions.filter((q) => q.isCorrect).length /
                answeredQuestions.length) *
                100
            )
          : 0,
      questions: answeredQuestions.map((q) => ({
        questionId: q.questionId?._id,
        question: q.questionId?.question || "No question available",
        answers: {
          A: q.questionId?.answerA,
          B: q.questionId?.answerB,
          C: q.questionId?.answerC,
          D: q.questionId?.answerD,
        },
        correctAnswers: {
          A: q.questionId?.answerACheck,
          B: q.questionId?.answerBCheck,
          C: q.questionId?.answerCCheck,
          D: q.questionId?.answerDCheck,
        },
        selectedAnswers: q.selectedAnswers,
        isCorrect: q.isCorrect,
      })),
    }));

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="Results" />
      <div
        className={`card shadow-lg rounded-lg text-center mx-auto card-${theme}`}
      >
        <div
          className={`card-header ${
            theme === "dark"
              ? "bg-success-dark-mode text-white"
              : "bg-success text-white"
          } py-3 d-flex justify-content-start`}
        >
          <h2 className="card-title font-weight-bold m-0">🎯 Results!</h2>
        </div>
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          {results.length > 0 ? (
            <ResultsTable
              results={results}
              setSelectedContent={setSelectedContent}
              theme={theme}
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

const ResultsTable = ({ results, setSelectedContent, theme }) => (
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
                className="btn btn-primary btn-sm"
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
