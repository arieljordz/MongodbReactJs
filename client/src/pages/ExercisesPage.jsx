import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTheme } from "../customPages/ThemeContext";
import Timer from "../customPages/Timer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ExercisesPage({ moveToNextStep, allowedPath }) {
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

  // console.log("ExercisesPage: ", allowedPath);

  // useEffect(() => {
  //   fetchExercises();

  //   // Restore progress from localStorage
  //   const storedProgress =
  //     JSON.parse(localStorage.getItem("exerciseProgress")) || {};
  //   const userProgress = storedProgress[studentData._id];

  //   console.log("1. userProgress:", userProgress);
  //   if (userProgress) {
  //     setCurrentTitleIndex(userProgress.currentTitleIndex);
  //     setCurrentQuestionIndex(userProgress.currentQuestionIndex);
  //   }
  // }, []);

  useEffect(() => {
    fetchExercises();
    const savedIndex = localStorage.getItem("currentQuestionIndex");
    setCurrentQuestionIndex(savedIndex ? parseInt(savedIndex, 10) : 0);
  }, []);

  
  const handleTimeUp = () => {
    toast.error("Time is up! Submitting automatically.", { autoClose: 2000 });
    navigate("/student/congrats");
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

      // console.log("Raw API Response:", response.data); // Debugging log

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

      // console.log("Grouped Questions by Title:", groupedQuestions);
      setQuestionsByTitle(groupedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // const getCurrentQuestion = () => {
  //   const currentTitle = titles[currentTitleIndex];
  //   return (
  //     questionsByTitle[currentTitle]?.questions[currentQuestionIndex] || null
  //   );
  // };

  const getCurrentQuestion = () => {
    const currentTitle = titles[currentTitleIndex];
    const storedProgress =
      JSON.parse(localStorage.getItem("exerciseProgress")) || {};
      console.log("2. storedProgress:", storedProgress);

    const answeredQuestions =
      storedProgress[studentData._id]?.answeredQuestions || [];
      console.log("3. answeredQuestions:", answeredQuestions);

      console.log("4. questionsByTitle:", questionsByTitle[currentTitle]?.questions);

    const remainingQuestions = questionsByTitle[currentTitle]?.questions.filter(
      (q) => !answeredQuestions.includes(q._id)
    );
    console.log("5. remainingQuestions:", remainingQuestions);
    console.log("6. currentQuestionIndex:", currentQuestionIndex);
    return remainingQuestions?.[currentQuestionIndex] || null;
    // return remainingQuestions || null;
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

  const updateExerciseStatus = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/updateExerciseStatus/${studentData._id}`
      );

      // console.log("Exercise updated:", response.data);
      navigate("/student/congrats");
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
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
  
    // Get correct answers
    const correctKeys = ["A", "B", "C", "D"].filter(
      (key) => currentQuestion[`answer${key}Check`]
    );
  
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
      feedbackMessage = "⚠️ Partially correct! Some correct, but some are incorrect.";
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
        isCorrect: correctSelections === correctKeys.length && incorrectSelections === 0,
        isPartiallyCorrect: correctSelections > 0 && incorrectSelections > 0,
      });
  
      setTimeout(() => {
        const currentTitle = titles[currentTitleIndex];
        const questions = questionsByTitle[currentTitle]?.questions || [];
  
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => {
            const newIndex = prev + 1;
            localStorage.setItem("currentQuestionIndex", newIndex);
            return newIndex;
          });
        } else if (currentTitleIndex < titles.length - 1) {
          setCurrentTitleIndex((prev) => {
            const newTitleIndex = prev + 1;
            localStorage.setItem("currentTitleIndex", newTitleIndex);
            return newTitleIndex;
          });
          setCurrentQuestionIndex(0);
          localStorage.setItem("currentQuestionIndex", 0);
        } else {
          updateExerciseStatus();
        }
  
        setSelectedAnswers({});
      }, 1600);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };
  

  const currentTitle = titles[currentTitleIndex];
  const currentQuestion = getCurrentQuestion();
  console.log("currentQuestion:", currentQuestion);
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
          <h2 className="card-title font-weight-bold m-0">
            📚 Reading Comprehension
          </h2>
        </div>
        {/* /.card-header */}
        <div className="d-flex justify-content-end mt-2 me-3">
          <Timer duration={timeLeft} onTimeUp={handleTimeUp} />
        </div>
        <div
          className={`card-body ${
            theme === "dark" ? "dark-mode text-white" : ""
          }`}
        >
          {/* Display Content Details */}
          {contentDetail.description && (
            <div
              className={`mb-3 p-3 border rounded ${
                theme === "dark" ? "bg-dark text-white" : "bg-light"
              }`}
            >
              {/* <h5>Category: {contentDetail.category}</h5> */}
              {currentTitle ? (
                <h4>{currentTitle}</h4>
              ) : (
                <p>No title available.</p>
              )}
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
            <div className="border rounded p-3 text-start">
              {/* Question aligned to the left */}
              <h5>{currentQuestion.question}</h5>

              {/* Answers aligned to the left */}
              <div className="d-flex flex-column">
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
                      className="cursor-pointer ms-2"
                      htmlFor={`${currentQuestion._id}-${key}`}
                    >
                      {key}) {currentQuestion[`answer${key}`]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No question available.</p>
          )}

          <button
            className="btn btn-primary mt-3 px-4 py-2 rounded-lg shadow-sm"
            onClick={handleSubmitAnswer}
          >
            🚀 Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExercisesPage;
