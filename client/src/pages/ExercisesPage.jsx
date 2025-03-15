import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTheme } from "../customPages/ThemeContext";
import Timer from "../customPages/Timer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ExercisesPage() {
  const studentData = JSON.parse(localStorage.getItem("user")) || {};
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [titles, setTitles] = useState([]);
  const [questionsByTitle, setQuestionsByTitle] = useState({});
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const totalTime = 10 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleTimeUp = () => {
    toast.error("Time is up! Submitting automatically.", { autoClose: 2000 });
    navigate("/congrats");
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/getExercises/all"
      );
      const exerciseData = response.data[0];
      if (!exerciseData) return;

      const sequenceIds = exerciseData.sequence.split(",");
      const titlesArray = exerciseData.titles.split(",");
      setTitles(titlesArray);
      fetchQuestionsByIds(sequenceIds);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const fetchQuestionsByIds = async (sequenceIds) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/getQuestionsBycontentIds",
        { contentIds: sequenceIds }
      );

      console.log("Raw API Response:", response.data); // Debugging log

      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.error("No questions found or response is not an array.");
        return;
      }

      const groupedQuestions = response.data.reduce((acc, question) => {
        if (!question.contentId || !question.contentId.title) {
          console.warn("Skipping question due to missing title:", question);
          return acc;
        }

        const title = question.contentId.title;
        if (!acc[title]) {
          acc[title] = {
            description: question.contentId.description || "",
            link: question.contentId.link ? question.contentId.link.trim() : "",
            category: question.contentId.category || "Uncategorized",
            questions: [],
          };
        }

        acc[title].questions.push(question);
        return acc;
      }, {});

      console.log("Grouped Questions by Title:", groupedQuestions);
      setQuestionsByTitle(groupedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const getCurrentQuestion = () => {
    const currentTitle = titles[currentTitleIndex];
    return (
      questionsByTitle[currentTitle]?.questions[currentQuestionIndex] || null
    );
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

  const handleSubmitAnswer = async () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    const selected = selectedAnswers[currentQuestion._id] || {};
    const selectedKeys = Object.keys(selected).filter((key) => selected[key]);

    if (selectedKeys.length === 0) {
      toast.warning("⚠️ Please select at least one answer before proceeding!", {
        autoClose: 2000,
      });
      return;
    }

    // Get correct answers from the question
    const correctKeys = ["A", "B", "C", "D"].filter(
      (key) => currentQuestion[`answer${key}Check`]
    );

    // Determine correctness levels
    const correctSelections = selectedKeys.filter((key) =>
      correctKeys.includes(key)
    ).length;
    const incorrectSelections = selectedKeys.filter(
      (key) => !correctKeys.includes(key)
    ).length;

    let feedbackMessage = "";
    let toastType = "";

    if (correctSelections === correctKeys.length && incorrectSelections === 0) {
      feedbackMessage = "✅ Correct answer!";
      toastType = "success";
    } else if (correctSelections > 0 && incorrectSelections === 0) {
      feedbackMessage = "⚠️ Partially correct! Some answers are missing.";
      toastType = "warning";
    } else if (correctSelections > 0 && incorrectSelections > 0) {
      feedbackMessage =
        "⚠️ Partially correct! Some correct, but some are incorrect.";
      toastType = "warning";
    } else {
      feedbackMessage = "❌ Wrong answer!";
      toastType = "error";
    }

    toast[toastType](feedbackMessage, { autoClose: 1500 });

    try {
      await axios.post("http://localhost:3001/saveAnswerByQuestion", {
        studentId: studentData._id,
        contentId: currentQuestion.contentId,
        questionId: currentQuestion._id,
        selectedAnswers: selectedKeys,
        isCorrect:
          correctSelections === correctKeys.length && incorrectSelections === 0,
        isPartiallyCorrect: correctSelections > 0 && incorrectSelections > 0,
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
    }

    setTimeout(() => {
      const currentTitle = titles[currentTitleIndex];
      const questions = questionsByTitle[currentTitle]?.questions || [];

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else if (currentTitleIndex < titles.length - 1) {
        setCurrentTitleIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        navigate("/congrats");
      }

      setSelectedAnswers({});
    }, 1600);
  };

  const currentTitle = titles[currentTitleIndex];
  const currentQuestion = getCurrentQuestion();
  const contentDetail = questionsByTitle[currentTitle] || {};

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
                <a children="text-blue">Exercises</a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className={`card card-${theme}`}>
        <div className="card-header">
          <h3 className="card-title">Exercises</h3>
          <Timer duration={timeLeft} onTimeUp={handleTimeUp} />
        </div>

        <div className="card-body">
          {currentTitle ? (
            <h4>Topic: {currentTitle}</h4>
          ) : (
            <p>No title available.</p>
          )}

          {/* Display Content Details */}
          {contentDetail.description && (
            <div className="mb-3 p-3 border rounded bg-light">
              <h5>Category: {contentDetail.category}</h5>
              <p
                className="text-justify"
                style={{ textAlign: "justify", textIndent: "2em" }}
                dangerouslySetInnerHTML={{ __html: contentDetail.description }}
              ></p>

              {contentDetail.link && (
                <div
                  className="mt-2 position-relative"
                  style={{
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    className="position-absolute top-0 start-0 w-100 h-100"
                    src={contentDetail.link}
                    title="Video Content"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          )}

          {/* Display Question */}
          {currentQuestion ? (
            <div className="border rounded p-3">
              <h5>{currentQuestion.question}</h5>
              {["A", "B", "C", "D"].map((key) => (
                <div key={key} className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${currentQuestion._id}-${key}`}
                    checked={
                      selectedAnswers[currentQuestion._id]?.[key] || false
                    }
                    onChange={() =>
                      handleCheckboxChange(currentQuestion._id, key)
                    }
                  />
                  <label
                    className="cursor-pointer"
                    htmlFor={`${currentQuestion._id}-${key}`}
                  >
                    {currentQuestion[`answer${key}`]}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p>No question available.</p>
          )}

          <button className="btn btn-primary mt-3" onClick={handleSubmitAnswer}>
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExercisesPage;
