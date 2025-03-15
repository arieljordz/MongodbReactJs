import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useLocation } from "react-router-dom";
import { useTheme } from "../customPages/ThemeContext";
import { toast } from "react-toastify";

function ExercisesPage() {
  const location = useLocation();
  const studentData = location.state || {};
  const { theme } = useTheme();
  const [questionsByTitle, setQuestionsByTitle] = useState({});
  const [titles, setTitles] = useState([]);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [remainingQuestions, setRemainingQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  console.log("ExercisesPage: ", studentData);
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/getQuestions/all"
      );
      // console.log("response: ", response.data);
      const grouped = groupByTitle(response.data);
      setQuestionsByTitle(grouped);

      const titleKeys = Object.keys(grouped);
      setTitles(titleKeys);

      if (titleKeys.length > 0) {
        setCurrentTitleIndex(0);
        setRandomQuestion(grouped[titleKeys[0]]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const groupByTitle = (questions) => {
    return questions.reduce((acc, question) => {
      const title = question.contentId.title;
      acc[title] = acc[title] || [];
      acc[title].push(question);
      return acc;
    }, {});
  };

  const setRandomQuestion = (questions) => {
    if (questions.length > 0) {
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setRemainingQuestions(shuffled);
      setCurrentQuestion(shuffled[0]);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    const selected = selectedAnswers[currentQuestion._id] || {};
    const hasSelectedAnswer = Object.values(selected).some((value) => value);

    if (!hasSelectedAnswer) {
      toast.warning("Please select at least one answer before submitting.", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
      return;
    }

    // Get correct answers from the current question
    const correctAnswers = {
      answerA: currentQuestion.answerACheck,
      answerB: currentQuestion.answerBCheck,
      answerC: currentQuestion.answerCCheck,
      answerD: currentQuestion.answerDCheck,
    };

    const selectedKeys = Object.keys(selected).filter((key) => selected[key]); // Selected answer keys
    const correctKeys = Object.keys(correctAnswers).filter(
      (key) => correctAnswers[key]
    ); // Correct answer keys

    const isFullyCorrect =
      selectedKeys.length === correctKeys.length &&
      selectedKeys.every((key) => correctKeys.includes(key));
    const isPartiallyCorrect =
      selectedKeys.some((key) => correctKeys.includes(key)) && !isFullyCorrect;

    let resultMessage = "";
    if (isFullyCorrect) {
      resultMessage = "Correct Answer! 🎉";
    } else if (isPartiallyCorrect) {
      resultMessage = "Partially Correct Answer! ⚠️";
    } else {
      resultMessage = "Incorrect Answer! ❌";
    }

    const answerPayload = {
      studentId: studentData._id,
      contentId: currentQuestion.contentId._id,
      questionId: currentQuestion._id,
      selectedAnswers: selected,
      isCorrect: isFullyCorrect,
      isPartiallyCorrect: isPartiallyCorrect,
    };

    console.log("answerPayload: ", answerPayload);

    try {
      await axios.post(
        "http://localhost:3001/saveAnswerByQuestion",
        answerPayload
      );

      if (isFullyCorrect) {
        toast.success(resultMessage, {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      } else if (isPartiallyCorrect) {
        toast.info(resultMessage, {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      } else {
        toast.error(resultMessage, {
          autoClose: 2000,
          position: "top-right",
          closeButton: true,
        });
      }

      // Move to the next question
      if (remainingQuestions.length > 1) {
        const nextQuestions = remainingQuestions.slice(1);
        setRemainingQuestions(nextQuestions);
        setCurrentQuestion(nextQuestions[0]);
      } else {
        handleNextTopic();
      }
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleNextTopic = () => {
    if (currentTitleIndex < titles.length - 1) {
      const nextIndex = currentTitleIndex + 1;
      setCurrentTitleIndex(nextIndex);
      setRandomQuestion(questionsByTitle[titles[nextIndex]]);
      setSelectedAnswers({});
    }
  };

  const handleCheckboxChange = (questionId, answerKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [answerKey]: !prev[questionId]?.[answerKey],
      },
    }));
  };

  return (
    <div className={`container mt-6 ${theme}`}>
      <div className="content-header">
        <div className="d-flex justify-content-start">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="">Exercises</a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className={`card card-${theme}`}>
        <div className="card-header">
          <h3 className="card-title">Exercises</h3>
        </div>
        {/* /.card-header */}
        <div className="card-body">
          {titles.length > 0 && (
            <div className="mb-3">
              <h4>Topic: {titles[currentTitleIndex]}</h4>

              {/* Display Description, Link, and Category */}
              {currentQuestion?.contentId && (
                <div className="mt-2">
                  <p>
                    <strong>Description:</strong>{" "}
                    {currentQuestion.contentId.description}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {currentQuestion.contentId.category}
                  </p>
                  {currentQuestion.contentId.link && (
                    <p>
                      <strong>Link:</strong>{" "}
                      <a
                        href={currentQuestion.contentId.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {currentQuestion.contentId.link}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            className={`question-container border rounded p-3 ${
              theme === "dark" ? "bg-dark text-white" : "bg-light"
            }`}
          >
            {currentQuestion ? (
              <div className="mb-3">
                <h5>{currentQuestion.question}</h5>
                {["A", "B", "C", "D"].map((key) => {
                  const answerKey = `answer${key}`;
                  return (
                    <div key={answerKey} className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`${currentQuestion._id}-${answerKey}`}
                        checked={
                          selectedAnswers[currentQuestion._id]?.[answerKey] ||
                          false
                        }
                        onChange={() =>
                          handleCheckboxChange(currentQuestion._id, answerKey)
                        }
                      />
                      <label
                        className="form-check-label cursor-pointer"
                        htmlFor={`${currentQuestion._id}-${answerKey}`}
                      >
                        {currentQuestion[answerKey]}
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Loading questions...</p>
            )}
            <button
              className="btn btn-primary mt-3"
              onClick={handleSubmitAnswer}
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExercisesPage;
