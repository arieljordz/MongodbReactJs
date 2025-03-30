import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTheme } from "../customPages/ThemeContext";
import Header from "../customPages/Header";
import { getItemWithExpiry } from "../utils/storageUtils";
import DownloadResults from "../customPages/DownloadResults";
import RequestRetake from "../customPages/RequestRetake";

const AllResultPage = () => {
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
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchResults();
    fetchRequests();
  }, []);

  const fetchData = async (isDone, isRetake) => {
    const response = await axios.get(
      `${API_URL}/getAllResults/${studentData.category}/${isDone}/${isRetake}`
    );
    return response.data || null;
  };

  const fetchResults = async () => {
    try {
      const response = await fetchData(true, true);
      console.log("response results:", response);
      if (response) {
        const formattedData = formatProgressData(response);
        // console.log("Formatted results Data:", formattedData);
        setResults(formattedData);
      } else {
        console.warn("No results found.");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetchData(true, false);
      console.log("response requests:", response);
      if (response) {
        setRequests(response);
      } else {
        console.warn("No requests found.");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const formatProgressData = (data) => {
    const groupedResults = {};

    data.forEach(({ studentId, progress, isRetake, _id }) => {
      const studentKey = studentId._id;
      if (!groupedResults[studentKey]) {
        groupedResults[studentKey] = {
          studentId: studentId._id,
          studentName: `${studentId.firstname} ${studentId.middlename} ${studentId.lastname}`,
          isRetake: isRetake,
          progressId: _id,
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

  const handleCloseModal = (action) => {
    setShowModal(action);
  };

  const handleRowClick = (id, event) => {
    if (event.target.closest(".action-buttons")) return;
    setSelectedRow((prev) => (prev === id ? null : id));
  };

  const handleSubmitRequest = async (progressId, action, progressData) => {
    console.log("progressData:", progressData);

    if (!selectedRow) {
      toast.warning("Please select a row first.");
      return;
    }

    if (selectedRow !== progressId) {
      toast.warning("Please click the action button on the selected row.");
      return;
    }

    try {
      // Ensure progressData has the correct structure
      if (!progressData.progress || !Array.isArray(progressData.progress)) {
        toast.error("Invalid progress data!");
        return;
      }

      if (action === true) {
        // Reset progress details while keeping answeredQuestions intact
        const updatedProgress = progressData.progress.map((progressItem) => ({
          contentId: progressItem.contentId._id, // Extracting ObjectId from contentId object
          currentQuestionIndex: 0,
          answeredQuestions: progressItem.answeredQuestions.map((q) => ({
            ...q, // Preserve existing properties
            selectedAnswers: [],
            isCorrect: false,
            isPartiallyCorrect: false,
            isDone: false,
          })),
        }));

        // Send updated data to API
        await axios.put(`${API_URL}/approvedRetake/${progressId}`, {
          isRetake: action,
          progress: updatedProgress,
          timeLeft: 0,
          isDone: false,
        });
        toast.success("Request has been approved!");
      } else {
        const isConfirmed = await Swal.fire({
          title: "Decline Confirmation",
          text: "Are you sure you want to decline this request?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Decline",
          cancelButtonText: "Cancel",
        });

        if (isConfirmed.isConfirmed) {
          try {
            await axios.put(`${API_URL}/requestDeclineRetake/${progressId}`, {
              isRetake: action,
            });
            toast.success("Request has been declined!");
          } catch (error) {
            toast.error("Failed to decline request.");
          }
        }
      }
      fetchResults();
      fetchRequests();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
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
          <h2 className="card-title font-weight-bold m-0">🎯 Results</h2>
        </div>
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <div className="d-flex justify-content-end mb-2">
            <RequestRetake
              theme={theme}
              showModal={showModal}
              onClose={handleCloseModal}
              onSubmitRequest={handleSubmitRequest}
              onRowClick={handleRowClick}
              selectedRow={selectedRow}
              requests={requests}
              btnBgColor={btnBgColor}
            />
            <DownloadResults results={results} btnBgColor={btnBgColor} />
          </div>
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
            <div className="card-body">
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
