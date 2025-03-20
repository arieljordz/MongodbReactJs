import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import QuestionModal from "../modals/QuestionModal";
import { useTheme } from "../customPages/ThemeContext";
import Header from "../customPages/Header";
import QuestionTable from "../tables/QuestionTable";

const QuestionPage = () => {
  const { theme } = useTheme();
  const [contents, setContents] = useState([]);
  const [questions, setQuestions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("ADD");
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchContents();
    fetchQuestions();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getContents/all");
      setContents(response.data);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/getQuestions/all"
      );
      const groupedQuestions = response.data.reduce((acc, question) => {
        const { contentId } = question;
        if (!acc[contentId._id]) {
          acc[contentId._id] = { content: contentId, questions: [] };
        }
        acc[contentId._id].questions.push(question);
        return acc;
      }, {});
      setQuestions(groupedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAddNew = () => {
    setShowModal(true);
    setSelectedContent(null);
    setSelectedRow(null);
    setMode("ADD");
  };

  const handleUpdate = (questionId, contentId) => {
    const selectedContentData =
      questions[contentId]?.questions.find((q) => q._id === questionId) || null;

    // console.log("selectedContentData:", selectedContentData);
    setSelectedContent(selectedContentData);
    setShowModal(true);
    setMode("UPDATE");
  };

  // Handle Delete
  const handleDelete = async (questionId, contentId) => {
    try {
      const isYesNo = await Swal.fire({
        title: "Confirmation",
        text: "Are you sure you want to delete this record?",
        icon: "question",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "Yes, Delete it",
        cancelButtonText: "Cancel",
      });
      // console.log(isYesNo.isConfirmed);
      if (isYesNo.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:3001/deleteQuestion/${questionId}`
        );
        setMode("DELETE");
        if (response.status === 200) {
          toast.success("Question successfully deleted.", {
            autoClose: 2000,
            position: "top-right",
            closeButton: true,
          });

          fetchQuestions();
        }
      }
    } catch (error) {
      console.error("Error deleting question:", error);

      toast.error(
        error.response?.data?.message || "Error while deleting question.",
        {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        }
      );
    }
    setSelectedRow(null);
  };

  return (
    <div className={`container mt-6 ${theme}`}>
      <Header levelOne="Home" levelTwo="Questions" />
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
          <h2 className="card-title font-weight-bold m-0">📝 Questions</h2>
        </div>
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          <div className="mb-3 row g-2 align-items-center">
            <div className="col-12 col-md-1">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleAddNew}
              >
                Add New
              </button>
            </div>
          </div>
          <QuestionTable
            questionsData={questions}
            theme={theme}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        </div>
      </div>
      <QuestionModal
        fetchQuestions={fetchQuestions}
        contents={contents}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
        showModal={showModal}
        setShowModal={setShowModal}
        mode={mode}
        setMode={setMode}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
};

export default QuestionPage;
