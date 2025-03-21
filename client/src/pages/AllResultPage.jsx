import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import { useTheme } from "../customPages/ThemeContext";
import Header from "../customPages/Header";

const AllResultPage = () => {
  const { theme, toggleTheme, navBgColor, toggleNavBar, cardBgColor, btnBgColor } =
    useTheme();
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getAllResults/${studentData.category}/${true}`
      );
      console.log("response data:", response);
      if (response.data) {
        const formattedData = formatProgressData(response.data);
        console.log("Formatted Progress Data:", formattedData);
        setResults(formattedData);
      } else {
        console.warn("No progress found.");
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load progress.");
    }
  };

  const formatProgressData = (data) => {
    const groupedResults = {};

    data.forEach(({ studentId, progress }) => {
      const studentKey = studentId._id;
      if (!groupedResults[studentKey]) {
        groupedResults[studentKey] = {
          studentId: studentId._id,
          studentName: `${studentId.firstname} ${studentId.middlename} ${studentId.lastname}`,
          contents: [],
        };
      }

      progress.forEach(({ contentId, answeredQuestions }) => {
        const totalCount = answeredQuestions.length;
        const correctCount = answeredQuestions.filter(
          (q) => q.isCorrect
        ).length;
        const percentage =
          totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        const status =
          totalCount > 0
            ? correctCount / totalCount >= 0.75
              ? "Passed"
              : "Failed"
            : "No Data";

        groupedResults[studentKey].contents.push({
          contentId: contentId._id,
          contentTitle: contentId.title,
          totalCount,
          correctCount,
          percentage,
          status,
        });
      });
    });

    return Object.values(groupedResults);
  };

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="Results" />
      <div
        className={`card shadow-lg rounded-lg text-center mx-auto card-${theme}`}
      >
        <div
          className={`card-header ${cardBgColor} py-3 d-flex justify-content-between`}
        >
          <h2 className="card-title font-weight-bold m-0">🎯 Results!</h2>
        </div>
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <ProgressTable progressData={results} theme={theme} />
        </div>
      </div>
    </div>
  );
};

const ProgressTable = ({ progressData, theme }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (studentId) => {
    setExpanded((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  return (
    <div className="accordion" id="resultsAccordion">
      {progressData.map((student, index) => (
        <div className="card mb-2" key={student.studentId}>
          <div
            className="card-header d-flex align-items-center"
            onClick={() => toggleExpand(student.studentId)}
            style={{ cursor: "pointer" }}
          >
            <h5 className="mb-0">
              {index + 1}. {student.studentName}
            </h5>
            <i
              className={`fas ${
                expanded[student.studentId]
                  ? "fa-chevron-up"
                  : "fa-chevron-down"
              } ms-auto`}
            />
          </div>
          {expanded[student.studentId] && (
            <div className="card-body pt-0">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead
                    className={theme === "dark" ? "table-dark" : "table-light"}
                  >
                    <tr>
                      <th>Content Title</th>
                      <th>Total Items</th>
                      <th>Correct Answers</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.contents.map((content) => (
                      <tr key={content.contentId}>
                        <td>{content.contentTitle}</td>
                        <td>{content.totalCount}</td>
                        <td>{content.correctCount}</td>
                        <td>{content.percentage}%</td>
                        <td>
                          <span
                            className={`badge ${
                              content.status === "Passed"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {content.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllResultPage;
