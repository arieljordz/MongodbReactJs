import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useLocation } from "react-router-dom";
import { useTheme } from "../customPages/ThemeContext";
import { toast } from "react-toastify";

function ExercisesPage() {
  const location = useLocation();
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

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/getQuestions/all"
      );
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

    try {
      await axios.post("http://localhost:3001/saveAnswerByQuestion", {
        studentId: currentQuestion._id,
        contentId: currentQuestion.contentId._id,
        questionId: currentQuestion._id,
        selectedAnswers: selected,
      });

      toast.success("Answer has been submitted!", {
        autoClose: 2000,
        position: "top-right",
        closeButton: true,
      });
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
                    <div key={answerKey} className="form-check">
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
                        className="form-check-label"
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
